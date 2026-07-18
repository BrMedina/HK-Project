"use no memo";
import React from "react";
import { Linking } from "react-native";
import { QuickAddWidget } from "./QuickAddWidget";
import { getAllTrips, getTotalSpentPHP } from "../db/queries";

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
    return { totalSpentPHP: 0, rate: 7.84, budgetHkd: 0 };
  }
  try {
    const totalSpentPHP = await getTotalSpentPHP(activeTrip.id);
    // ponytail: use DB rate, same source as useDashboard — keeps % in sync with the app
    const rate = activeTrip.exchange_rate || 7.84;
    return { totalSpentPHP, rate, budgetHkd: activeTrip.budget_hkd };
  } catch (error) {
    console.error("Widget loadWidgetData error:", error);
    return { totalSpentPHP: 0, rate: activeTrip.exchange_rate || 7.84, budgetHkd: activeTrip.budget_hkd };
  }
}

export async function widgetTaskHandler(props) {
  let totalBudgetPHP = 0;
  let totalSpentPHP = 0;
  let budgetLeftPHP = 0;
  let spentPercent = 0;
  let currencyPreference = "PHP";
  let exchangeRate = 7.84;

  try {
    const activeTrip = await getActiveTrip();
    if (activeTrip) {
      const { totalSpentPHP: total, rate, budgetHkd } = await loadWidgetData(activeTrip);
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
