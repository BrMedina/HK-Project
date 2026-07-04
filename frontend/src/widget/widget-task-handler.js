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
  const activeTrip = await getActiveTrip();
  const { todaySpentPHP, totalSpentPHP, rate, budgetHkd } = await loadWidgetData(activeTrip);
  
  // Calculate remaining budget in HKD
  // If activeTrip.currency_preference === 'PHP', does budget left mean HKD or PHP?
  // The widget says `HK$${budgetLeftHKD} left`, so it expects HKD.
  const budgetLeftHKD = activeTrip ? Math.max(0, budgetHkd - (totalSpentPHP / rate)) : 0;

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
}
