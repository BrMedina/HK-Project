"use no memo";
import React from "react";
import { FlexWidget, TextWidget, ImageWidget } from "react-native-android-widget";

export function QuickAddWidget({
  totalBudgetPHP = 0,
  totalSpentPHP = 0,
  budgetLeftPHP = 0,
  spentPercent = 0,
}) {
  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 14,
        flexDirection: "column",
      }}
    >
      {/* Top Row: Title, Value and Logo */}
      <FlexWidget
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "match_parent",
        }}
      >
        <FlexWidget style={{ flexDirection: "column", flex: 1 }}>
          <TextWidget text="Total Budget" style={{ fontSize: 12, color: "#717786" }} />
          <TextWidget
            text={`PHP ${Math.round(totalBudgetPHP).toLocaleString("en-PH")}`}
            style={{ fontSize: 20, color: "#181c23", fontWeight: "800", marginTop: 2 }}
          />
        </FlexWidget>

        <FlexWidget
          style={{
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ImageWidget
            image={require("../../assets/galafund.png")}
            imageWidth={36}
            imageHeight={36}
          />
        </FlexWidget>
      </FlexWidget>

      {/* Middle: Spent stats & Horizontal progress bar */}
      <FlexWidget style={{ flexDirection: "column", marginTop: 12, width: "match_parent" }}>
        <TextWidget
          text={`Spent PHP ${Math.round(totalSpentPHP).toLocaleString("en-PH")} • ${spentPercent}%`}
          style={{ fontSize: 11, color: "#717786" }}
        />
        <FlexWidget
          style={{
            height: 6,
            backgroundColor: "#ebedf8",
            borderRadius: 3,
            marginTop: 6,
            width: "match_parent",
            flexDirection: "row",
          }}
        >
          {/* Progress fill using flex-based weights */}
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
      </FlexWidget>

      {/* Bottom info: Remaining budget */}
      <FlexWidget
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
          width: "match_parent",
        }}
      >
        <TextWidget text="Remaining" style={{ fontSize: 12, color: "#717786" }} />
        <TextWidget
          text={`PHP ${Math.round(budgetLeftPHP).toLocaleString("en-PH")}`}
          style={{ fontSize: 13, color: spentPercent >= 80 ? "#ef4444" : "#39baa6", fontWeight: "700" }}
        />
      </FlexWidget>

      {/* Action Buttons: Deep link triggers */}
      <FlexWidget
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 14,
          width: "match_parent",
        }}
      >
        <FlexWidget
          clickAction="SCAN_QR"
          style={{
            flex: 1,
            backgroundColor: "#39baa6",
            borderRadius: 10,
            paddingVertical: 8,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 6,
          }}
        >
          <TextWidget text="Scan QR Code" style={{ fontSize: 11, color: "#ffffff", fontWeight: "700" }} />
        </FlexWidget>

        <FlexWidget
          clickAction="MANUAL_ENTRY"
          style={{
            flex: 1,
            backgroundColor: "#39baa6",
            borderRadius: 10,
            paddingVertical: 8,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 6,
          }}
        >
          <TextWidget text="Manual Entry" style={{ fontSize: 11, color: "#ffffff", fontWeight: "700" }} />
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}
