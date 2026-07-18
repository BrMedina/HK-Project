"use no memo";
import React from "react";
import { FlexWidget, TextWidget } from "react-native-android-widget";

function formatCurrency(amount, currency = "PHP") {
  const formatted = Math.round(amount).toLocaleString("en-PH");
  if (currency === "HKD") {
    return `HKD ${formatted}`;
  }
  return `PHP ${formatted}`;
}

export function QuickAddWidget({
  totalBudgetPHP = 0,
  totalSpentPHP = 0,
  budgetLeftPHP = 0,
  spentPercent = 0,
  currencyPreference = "PHP",
  exchangeRate = 7.84,
}) {
  const displayBudget = currencyPreference === "HKD" && exchangeRate > 0 ? totalBudgetPHP / exchangeRate : totalBudgetPHP;
  const displaySpent = currencyPreference === "HKD" && exchangeRate > 0 ? totalSpentPHP / exchangeRate : totalSpentPHP;
  const displayRemaining = currencyPreference === "HKD" && exchangeRate > 0 ? budgetLeftPHP / exchangeRate : budgetLeftPHP;

  const displayBudgetHkd = exchangeRate > 0 ? totalBudgetPHP / exchangeRate : 0;
  const displaySpentHkd = exchangeRate > 0 ? totalSpentPHP / exchangeRate : 0;
  const displayRemainingHkd = exchangeRate > 0 ? budgetLeftPHP / exchangeRate : 0;

  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 12,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top Row: Total budget & spent percentage badge */}
      <FlexWidget
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "match_parent",
        }}
      >
        <FlexWidget style={{ flexDirection: "column", flex: 1 }}>
          <TextWidget text="Total budget" style={{ fontSize: 11, color: "#717786" }} />
          <TextWidget
            text={formatCurrency(displayBudget, currencyPreference)}
            style={{ fontSize: 20, color: "#181c23", fontWeight: "800", marginTop: 2 }}
          />
          {currencyPreference === "PHP" && exchangeRate > 0 && (
            <TextWidget
              text={formatCurrency(displayBudgetHkd, "HKD")}
              style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}
            />
          )}
        </FlexWidget>

        {/* Spent percentage badge */}
        <FlexWidget
          style={{
            backgroundColor: spentPercent >= 80 ? "#fee2e2" : "#e6f4fe",
            borderRadius: 10,
            paddingHorizontal: 8,
            paddingVertical: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextWidget
            text={`${spentPercent}%`}
            style={{
              fontSize: 12,
              fontWeight: "800",
              color: spentPercent >= 80 ? "#ef4444" : "#39baa6",
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* Middle: Spent / Progress / Remaining (BudgetCard Style) */}
      <FlexWidget style={{ flexDirection: "column", marginTop: 10, width: "match_parent" }}>
        {/* Spent Row */}
        <FlexWidget
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "match_parent",
          }}
        >
          <TextWidget text="Spent" style={{ fontSize: 11, color: "#717786" }} />
          <FlexWidget style={{ flexDirection: "column", alignItems: "flex-end" }}>
            <TextWidget
              text={formatCurrency(displaySpent, currencyPreference)}
              style={{ fontSize: 12, fontWeight: "700", color: spentPercent >= 80 ? "#ef4444" : "#181c23" }}
            />
            {currencyPreference === "PHP" && exchangeRate > 0 && (
              <TextWidget
                text={formatCurrency(displaySpentHkd, "HKD")}
                style={{ fontSize: 9, color: "#94a3b8", marginTop: 1 }}
              />
            )}
          </FlexWidget>
        </FlexWidget>

        {/* Progress Bar */}
        <FlexWidget
          style={{
            height: 6,
            backgroundColor: "#ebedf8",
            borderRadius: 3,
            marginTop: 6,
            marginBottom: 6,
            width: "match_parent",
            flexDirection: "row",
          }}
        >
          {spentPercent > 0 && (
            <FlexWidget
              style={{
                height: 6,
                backgroundColor: spentPercent >= 80 ? "#ef4444" : "#39baa6",
                borderRadius: 3,
                flex: spentPercent,
              }}
            />
          )}
          {spentPercent < 100 && (
            <FlexWidget
              style={{
                height: 6,
                flex: 100 - spentPercent,
              }}
            />
          )}
        </FlexWidget>

        {/* Remaining Row */}
        <FlexWidget
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "match_parent",
          }}
        >
          <TextWidget text="Remaining" style={{ fontSize: 11, color: "#717786" }} />
          <FlexWidget style={{ flexDirection: "column", alignItems: "flex-end" }}>
            <TextWidget
              text={formatCurrency(displayRemaining, currencyPreference)}
              style={{ fontSize: 12, fontWeight: "700", color: spentPercent >= 80 ? "#ef4444" : "#39baa6" }}
            />
            {currencyPreference === "PHP" && exchangeRate > 0 && (
              <TextWidget
                text={formatCurrency(displayRemainingHkd, "HKD")}
                style={{ fontSize: 9, color: "#94a3b8", marginTop: 1 }}
              />
            )}
          </FlexWidget>
        </FlexWidget>
      </FlexWidget>

      {/* Action Buttons: Native Deep Link Triggers (work when closed) */}
      <FlexWidget
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "match_parent",
        }}
      >
        <FlexWidget
          clickAction="OPEN_URI"
          clickActionData={{ uri: "galafund://scan?tab=qr" }}
          style={{
            flex: 1,
            backgroundColor: "#39baa6",
            borderRadius: 10,
            paddingVertical: 6,
            minHeight: 32,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 4,
          }}
        >
          <TextWidget text="Scan QR Code" style={{ fontSize: 11, color: "#ffffff", fontWeight: "700" }} />
        </FlexWidget>

        <FlexWidget
          clickAction="OPEN_URI"
          clickActionData={{ uri: "galafund://scan?mode=manual" }}
          style={{
            flex: 1,
            backgroundColor: "#39baa6",
            borderRadius: 10,
            paddingVertical: 6,
            minHeight: 32,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 4,
          }}
        >
          <TextWidget text="Manual Entry" style={{ fontSize: 11, color: "#ffffff", fontWeight: "700" }} />
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}
