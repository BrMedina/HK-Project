"use no memo";
import React from "react";
import { Linking } from "react-native";
import { QuickAddWidget } from "./QuickAddWidget";
import { getAllTrips, getTodaySpentPHP, getTotalSpentPHP } from "../db/queries";
import { fetchExchangeRate } from "../api/currency";

async function getActiveTrip() {
  try {
    const trips = await getAllTrips();
    return trips.length > 0 ? trips[0] : null;
  } catch (e) {
    console.error("Widget getActiveTrip error:", e);
    return null;
  }
}

async function loadWidgetData(activeTrip) {
  if (!activeTrip) {
    return { todaySpentPHP: 0, totalSpentPHP: 0, rate: 7.84, budgetHkd: 0 };
  }
  try {
    const activeTripId = activeTrip.id;
    const todaySpentPHP = await getTodaySpentPHP(activeTripId);
    const totalSpentPHP = await getTotalSpentPHP(activeTripId);
    let rate = activeTrip.exchange_rate || 7.84;
    try {
      const result = await fetchExchangeRate("HKD", "PHP");
      rate = result.rate;
    } catch (e) {
      // Fallback to database exchange rate if offline or request fails
    }
    return { todaySpentPHP, totalSpentPHP, rate, budgetHkd: activeTrip.budget_hkd };
  } catch (e) {
    console.error("Widget loadWidgetData error:", e);
    return { todaySpentPHP: 0, totalSpentPHP: 0, rate: activeTrip.exchange_rate || 7.84, budgetHkd: activeTrip.budget_hkd };
  }
}

export async function widgetTaskHandler(props) {
  let totalBudgetPHP = 0;
  let todaySpentPHP = 0;
  let totalSpentPHP = 0;
  let budgetLeftPHP = 0;
  let spentPercent = 0;
  let currencyPreference = "PHP";
  let exchangeRate = 7.84;

  try {
    const activeTrip = await getActiveTrip();
    if (activeTrip) {
      const { todaySpentPHP: today, totalSpentPHP: total, rate, budgetHkd } = await loadWidgetData(activeTrip);
      todaySpentPHP = today || 0;
      totalSpentPHP = total || 0;
      exchangeRate = rate;
      currencyPreference = activeTrip.currency_preference || "PHP";
      totalBudgetPHP = (budgetHkd || 0) * rate;
      budgetLeftPHP = Math.max(0, totalBudgetPHP - totalSpentPHP);
      spentPercent = totalBudgetPHP > 0 ? Math.min(Math.round((totalSpentPHP / totalBudgetPHP) * 100), 100) : 0;
    }
  } catch (err) {
    console.error("GalaFund Widget Task Handler Data Load Error:", err);
  }

  try {
    switch (props.widgetAction) {
      case "WIDGET_ADDED":
      case "WIDGET_UPDATE":
      case "WIDGET_RESIZED":
        props.renderWidget(
          <QuickAddWidget
            totalBudgetPHP={totalBudgetPHP}
            totalSpentPHP={totalSpentPHP}
            budgetLeftPHP={budgetLeftPHP}
            spentPercent={spentPercent}
            currencyPreference={currencyPreference}
            exchangeRate={exchangeRate}
          />
        );
        break;

      case "WIDGET_CLICK":
        if (props.clickAction === "SCAN_QR") {
          Linking.openURL("galafund://scan?tab=qr");
        } else if (props.clickAction === "MANUAL_ENTRY") {
          Linking.openURL("galafund://scan?mode=manual");
        }
        break;

      default:
        break;
    }
  } catch (renderErr) {
    console.error("GalaFund Widget Render Error:", renderErr);
  }
}
