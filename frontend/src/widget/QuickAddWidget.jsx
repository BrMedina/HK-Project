import React from "react";
import { FlexWidget, TextWidget } from "react-native-android-widget";

// Pure presentational widget. `totalSpentPHP` and `budgetLeftHKD` are passed
// in by widget-task-handler.js after querying the existing database.
export function QuickAddWidget({ totalSpentPHP = 0, budgetLeftHKD = 0 }) {
  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        backgroundColor: "#101820",
        borderRadius: 16,
        padding: 12,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <FlexWidget style={{ flexDirection: "column" }}>
        <TextWidget text="Gala Fund" style={{ fontSize: 12, color: "#9AA5B1" }} />
        <TextWidget
          text={`\u20B1${totalSpentPHP.toFixed(0)} spent today`}
          style={{ fontSize: 16, color: "#F2EFE9", fontWeight: "600" }}
        />
        <TextWidget
          text={`HK$${budgetLeftHKD.toFixed(0)} left`}
          style={{ fontSize: 12, color: "#2FBF71" }}
        />
      </FlexWidget>

      <FlexWidget
        clickAction="OPEN_ADD_EXPENSE"
        style={{
          backgroundColor: "#FF3D81",
          borderRadius: 20,
          paddingVertical: 8,
          alignItems: "center",
        }}
      >
        <TextWidget text="+ Add expense" style={{ fontSize: 13, color: "#101820", fontWeight: "600" }} />
      </FlexWidget>
    </FlexWidget>
  );
}
