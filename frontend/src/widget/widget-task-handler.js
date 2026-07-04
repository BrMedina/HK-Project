import React from "react";
import { Linking } from "react-native";
import { QuickAddWidget } from "./QuickAddWidget";
import { getAllTrips, getTodaySpentPHP, getTotalSpentPHP } from "../db/queries";
import { fetchExchangeRate } from "../api/currency";

async function getActiveTrip() {
  const trips = await getAllTrips();
  return trips.length > 0 ? trips[0] : null;
}

async function loadWidgetData(activeTrip) {
  if (!activeTrip) {
    return { todaySpentPHP: 0, totalSpentPHP: 0, rate: 7.25, budgetHkd: 0 };
  }
  const activeTripId = activeTrip.id;
  const todaySpentPHP = await getTodaySpentPHP(activeTripId);
  const totalSpentPHP = await getTotalSpentPHP(activeTripId);
  let rate = activeTrip.exchange_rate || 7.25;
  try {
    const result = await fetchExchangeRate("HKD", "PHP");
    rate = result.rate;
  } catch (e) {
    // fall back to database rate if offline/failed
  }
  return { todaySpentPHP, totalSpentPHP, rate, budgetHkd: activeTrip.budget_hkd };
}

export async function widgetTaskHandler(props) {
  let todaySpentPHP = 0;
  let budgetLeftHKD = 0;

  try {
    const activeTrip = await getActiveTrip();
    if (activeTrip) {
      const { todaySpentPHP: today, totalSpentPHP: total, rate, budgetHkd } = await loadWidgetData(activeTrip);
      todaySpentPHP = today || 0;
      budgetLeftHKD = Math.max(0, budgetHkd - (total / rate));
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
          <QuickAddWidget totalSpentPHP={todaySpentPHP} budgetLeftHKD={budgetLeftHKD} />
        );
        break;

      case "WIDGET_CLICK":
        if (props.clickAction === "OPEN_ADD_EXPENSE") {
          await props.requestWidgetUpdate?.();
          Linking.openURL("galafund://add");
        }
        break;

      default:
        break;
    }
  } catch (renderErr) {
    console.error("GalaFund Widget Render Error:", renderErr);
  }
}
