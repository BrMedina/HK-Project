import { getDB, isReleasedDatabaseError, resetDBCache } from "./database";

function genId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

async function withDB(operation) {
  try {
    const db = await getDB();
    return await operation(db);
  } catch (error) {
    if (isReleasedDatabaseError(error)) {
      resetDBCache();
      const db = await getDB();
      return await operation(db);
    }
    throw error;
  }
}

export async function getAllTrips() {
  return withDB((db) => db.getAllAsync("SELECT * FROM trips ORDER BY created_at DESC"));
}

function triggerWidgetUpdate() {
  try {
    const { Platform } = require("react-native");
    if (Platform.OS === "android") {
      const { updateAppWidget } = require("../widget/updateWidget");
      updateAppWidget().catch((err) => console.error("Widget update error:", err));
    }
  } catch (e) {
    // Fail silently in non-react-native environments
  }
}

export async function createTrip(name, budgetHkd, exchangeRate) {
  const id = genId();
  const now = Date.now();
  await withDB((db) => db.runAsync(
    "INSERT INTO trips (id, name, budget_hkd, exchange_rate, created_at, duration_days, currency_preference) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, name, budgetHkd, exchangeRate, now, 7, "PHP"]
  ));
  triggerWidgetUpdate();
  return { id, name, budget_hkd: budgetHkd, exchange_rate: exchangeRate, created_at: now, duration_days: 7, currency_preference: "PHP" };
}

export async function addExpense(tripId, { phpAmount, category, note, transactionDate, source = "manual", imageUri = null }) {
  const id = genId();
  const now = Date.now();
  const date = transactionDate ?? now;
  await withDB((db) => db.runAsync(
    "INSERT INTO expenses (id, trip_id, php_amount, category, note, date, source, image_uri, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, tripId, phpAmount, category, note ?? "", date, source, imageUri, now]
  ));
  triggerWidgetUpdate();
  return { id, tripId, phpAmount, category, note, transactionDate: date, source, imageUri, createdAt: now };
}

export async function getExpensesForTrip(tripId) {
  return withDB((db) => db.getAllAsync(
    "SELECT * FROM expenses WHERE trip_id = ? ORDER BY date DESC",
    [tripId]
  ));
}

export async function getTotalSpentPHP(tripId) {
  const row = await withDB((db) => db.getFirstAsync(
    "SELECT COALESCE(SUM(php_amount), 0) as total FROM expenses WHERE trip_id = ?",
    [tripId]
  ));
  return row?.total ?? 0;
}

export async function getTodaySpentPHP(tripId) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startTimestamp = startOfDay.getTime();
  const row = await withDB((db) => db.getFirstAsync(
    "SELECT COALESCE(SUM(php_amount), 0) as total FROM expenses WHERE trip_id = ? AND date >= ?",
    [tripId, startTimestamp]
  ));
  return row?.total ?? 0;
}


export async function getTotalsByCategory(tripId) {
  const rows = await withDB((db) => db.getAllAsync(
    "SELECT category, SUM(php_amount) as total FROM expenses WHERE trip_id = ? GROUP BY category",
    [tripId]
  ));
  return rows.reduce((acc, row) => {
    acc[row.category] = row.total;
    return acc;
  }, {});
}

export async function deleteExpense(expenseId) {
  await withDB((db) => db.runAsync("DELETE FROM expenses WHERE id = ?", [expenseId]));
  triggerWidgetUpdate();
}

export async function deleteAllExpensesForTrip(tripId) {
  await withDB((db) => db.runAsync("DELETE FROM expenses WHERE trip_id = ?", [tripId]));
  triggerWidgetUpdate();
}

export async function updateTripPreferences(tripId, durationDays, currencyPreference, budgetHkd) {
  await withDB((db) => db.runAsync(
    "UPDATE trips SET duration_days = ?, currency_preference = ?, budget_hkd = ? WHERE id = ?",
    [durationDays, currencyPreference, budgetHkd, tripId]
  ));
  triggerWidgetUpdate();
}

export async function updateTripExchangeRate(tripId, exchangeRate) {
  await withDB((db) => db.runAsync(
    "UPDATE trips SET exchange_rate = ? WHERE id = ?",
    [exchangeRate, tripId]
  ));
  triggerWidgetUpdate();
}
