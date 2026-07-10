import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { useTheme, lightColors, darkColors } from "../lib/ThemeContext";

type Props = {
  budgetPhp: number;
  spentPhp: number;
  remainingPhp: number;
  spentPercent: number;
  currency?: string;
  exchangeRate?: number;
};

function formatCurrency(amount: number, currency: string = "PHP") {
  if (currency === "HKD") {
    return `HKD ${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return `PHP ${amount.toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export default function BudgetCard({ budgetPhp, spentPhp, remainingPhp, spentPercent, currency = "PHP", exchangeRate = 1 }: Props) {
  const { theme } = useTheme();
  const colors = theme === "light" ? lightColors : darkColors;
  
  const displayBudget = currency === "HKD" && exchangeRate > 0 ? budgetPhp / exchangeRate : budgetPhp;
  const displaySpent = currency === "HKD" && exchangeRate > 0 ? spentPhp / exchangeRate : spentPhp;
  const displayRemaining = currency === "HKD" && exchangeRate > 0 ? remainingPhp / exchangeRate : remainingPhp;

  const displayBudgetHkd = exchangeRate > 0 ? budgetPhp / exchangeRate : 0;
  const displaySpentHkd = exchangeRate > 0 ? spentPhp / exchangeRate : 0;
  const displayRemainingHkd = exchangeRate > 0 ? remainingPhp / exchangeRate : 0;

  const fillWidth = `${Math.min(spentPercent, 100)}%` as `${number}%`;
  const safePercent = Math.min(Math.max(spentPercent, 0), 100);
  const size = 64;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const progress = safePercent / 100;
  const startAngle = 0;
  const endAngle = Math.min(progress, 0.9999) * 360;
  const arcPath = describeArc(size / 2, size / 2, radius, startAngle, endAngle);

  return (
    <View style={[styles.budgetCard, { backgroundColor: colors.bg }]}>
      <View style={styles.budgetTopRow}>
        <View style={styles.budgetLeft}>
          <Text style={[styles.budgetLabel, { color: theme === "light" ? "#414754" : "#a0aab8" }]}>Total budget</Text>
          <View style={styles.budgetValueBlock}>
            <Text style={[styles.budgetValue, { color: colors.text }]}>{formatCurrency(displayBudget, currency)}</Text>
            {currency === "PHP" && exchangeRate > 0 && (
              <Text style={[styles.secondaryValue, { color: theme === "light" ? "#94a3b8" : "#5d6875" }]}>{formatCurrency(displayBudgetHkd, "HKD")}</Text>
            )}
          </View>
        </View>
        <View style={styles.progressCircleContainer}>
          <Svg width={size} height={size} style={styles.svg}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={theme === "light" ? "#ebedf8" : "#2d2d2d"}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {progress > 0 && (
              <Path
                d={arcPath}
                stroke={spentPercent >= 80 ? "#ef4444" : "#39baa6"}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeLinecap="round"
              />
            )}
          </Svg>
          <View style={styles.circleCenter}>
            <Text style={[styles.circlePercentage, { color: colors.text }]}>{spentPercent}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.budgetBottom}>
        <View style={styles.metricRow}>
          <Text style={[styles.metricLabel, { color: theme === "light" ? "#717786" : "#8b94a3" }]}>Spent</Text>
          <View style={styles.primaryValueBlock}>
            <Text style={[styles.metricValue, spentPercent >= 80 && { color: "#ef4444" }]}>{formatCurrency(displaySpent, currency)}</Text>
            {currency === "PHP" && exchangeRate > 0 && (
              <Text style={[styles.secondaryValue, { color: theme === "light" ? "#94a3b8" : "#5d6875" }]}>{formatCurrency(displaySpentHkd, "HKD")}</Text>
            )}
          </View>
        </View>
        <View style={[styles.progressBarBg, { backgroundColor: theme === "light" ? "#ebedf8" : "#2d2d2d" }]}>
          <View style={[styles.progressBarFill, { width: fillWidth }, spentPercent >= 80 && { backgroundColor: "#ef4444" }]} />
        </View>
        <View style={styles.metricRow}>
          <Text style={[styles.metricLabel, { color: theme === "light" ? "#717786" : "#8b94a3" }]}>Remaining</Text>
          <View style={styles.primaryValueBlock}>
            <Text style={[styles.metricValue, spentPercent >= 80 && { color: "#ef4444" }]}>{formatCurrency(displayRemaining, currency)}</Text>
            {currency === "PHP" && exchangeRate > 0 && (
              <Text style={[styles.secondaryValue, { color: theme === "light" ? "#94a3b8" : "#5d6875" }]}>{formatCurrency(displayRemainingHkd, "HKD")}</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  budgetCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(193, 198, 215, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 24,
  },
  budgetTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  budgetLeft: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 24,
    fontWeight: "800",
  },
  budgetValueBlock: {
    marginTop: 2,
  },
  progressCircleContainer: {
    width: 72,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  svg: {
    position: "absolute",
  },
  circleCenter: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  circlePercentage: {
    fontSize: 12,
    fontWeight: "800",
  },
  budgetBottom: {
    gap: 8,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 12,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#39baa6",
  },
  primaryValueBlock: {
    alignItems: "flex-end",
  },
  secondaryValue: {
    fontSize: 11,
    marginTop: 2,
  },
  progressBarBg: {
    height: 8,
    alignSelf: "stretch" as const,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#39baa6",
    borderRadius: 4,
  },
  remainingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  remainingLabel: {
    fontSize: 12,
  },
  remainingValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#39baa6",
  },
});
