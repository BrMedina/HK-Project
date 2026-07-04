import { getDB } from "./database";

function genId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function getAllTrips() {
  const db = await getDB();
  return db.getAllAsync("SELECT * FROM trips ORDER BY created_at DESC");
}

export async function createTrip(name, budgetHkd, exchangeRate) {
  const db = await getDB();
  const id = genId();
  const now = Date.now();
  await db.runAsync(
    "INSERT INTO trips (id, name, budget_hkd, exchange_rate, created_at, duration_days, currency_preference) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, name, budgetHkd, exchangeRate, now, 7, "PHP"]
  );
  return { id, name, budget_hkd: budgetHkd, exchange_rate: exchangeRate, created_at: now, duration_days: 7, currency_preference: "PHP" };
}

export async function addExpense(tripId, { phpAmount, category, note, transactionDate, source = "manual" }) {
  const db = await getDB();
  const id = genId();
  const now = Date.now();
  const date = transactionDate ?? now;
  await db.runAsync(
    "INSERT INTO expenses (id, trip_id, php_amount, category, note, date, source, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [id, tripId, phpAmount, category, note ?? "", date, source, now]
  );
  return { id, tripId, phpAmount, category, note, transactionDate: date, source, createdAt: now };
}

export async function getExpensesForTrip(tripId) {
  const db = await getDB();
  return db.getAllAsync(
    "SELECT * FROM expenses WHERE trip_id = ? ORDER BY date DESC",
    [tripId]
  );
}

export async function getTotalSpentPHP(tripId) {
  const db = await getDB();
  const row = await db.getFirstAsync(
    "SELECT COALESCE(SUM(php_amount), 0) as total FROM expenses WHERE trip_id = ?",
    [tripId]
  );
  return row?.total ?? 0;
}

export async function getTotalsByCategory(tripId) {
  const db = await getDB();
  const rows = await db.getAllAsync(
    "SELECT category, SUM(php_amount) as total FROM expenses WHERE trip_id = ? GROUP BY category",
    [tripId]
  );
  return rows.reduce((acc, row) => {
    acc[row.category] = row.total;
    return acc;
  }, {});
}

export async function deleteExpense(expenseId) {
  const db = await getDB();
  await db.runAsync("DELETE FROM expenses WHERE id = ?", [expenseId]);
}

export async function updateTripPreferences(tripId, durationDays, currencyPreference, budgetHkd) {
  const db = await getDB();
  await db.runAsync(
    "UPDATE trips SET duration_days = ?, currency_preference = ?, budget_hkd = ? WHERE id = ?",
    [durationDays, currencyPreference, budgetHkd, tripId]
  );
}

export async function updateTripExchangeRate(tripId, exchangeRate) {
  const db = await getDB();
  await db.runAsync(
    "UPDATE trips SET exchange_rate = ? WHERE id = ?",
    [exchangeRate, tripId]
  );
}
