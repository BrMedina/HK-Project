import { Platform } from "react-native";
import { requestWidgetUpdate } from "react-native-android-widget";
import React from "react";

// ponytail: lazy require of queries to avoid circular dependency
export async function updateAppWidget() {
  if (Platform.OS !== "android") return;

  try {
    const { getAllTrips, getTodaySpentPHP, getTotalSpentPHP } = require("../db/queries");
    const { QuickAddWidget } = require("./QuickAddWidget");

    const trips = await getAllTrips();
    if (trips.length === 0) return;

    const activeTrip = trips[0];
    const todaySpentPHP = await getTodaySpentPHP(activeTrip.id);
    const totalSpentPHP = await getTotalSpentPHP(activeTrip.id);
    const rate = activeTrip.exchange_rate || 7.84;
    const currencyPreference = activeTrip.currency_preference || "PHP";
    const budgetHkd = activeTrip.budget_hkd || 0;

    const totalBudgetPHP = budgetHkd * rate;
    const budgetLeftPHP = Math.max(0, totalBudgetPHP - totalSpentPHP);
    const spentPercent = totalBudgetPHP > 0 ? Math.min(Math.round((totalSpentPHP / totalBudgetPHP) * 100), 100) : 0;

    requestWidgetUpdate({
      widgetName: "QuickAdd",
      renderWidget: () => (
        <QuickAddWidget
          totalBudgetPHP={totalBudgetPHP}
          totalSpentPHP={totalSpentPHP}
          budgetLeftPHP={budgetLeftPHP}
          spentPercent={spentPercent}
          currencyPreference={currencyPreference}
          exchangeRate={rate}
        />
      ),
    });
  } catch (err) {
    console.error("Failed to update widget:", err);
  }
}
