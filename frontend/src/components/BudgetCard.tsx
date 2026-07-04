import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

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
  const displayBudget = currency === "HKD" && exchangeRate > 0 ? budgetPhp / exchangeRate : budgetPhp;
  const displaySpent = currency === "HKD" && exchangeRate > 0 ? spentPhp / exchangeRate : spentPhp;
  const displayRemaining = currency === "HKD" && exchangeRate > 0 ? remainingPhp / exchangeRate : remainingPhp;

  const fillWidth = `${Math.min(spentPercent, 100)}%` as `${number}%`;
  const safePercent = Math.min(Math.max(spentPercent, 0), 100);
  const size = 64;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const progress = safePercent / 100;
  const endAngle = -90 + progress * 360;
  const arcPath = describeArc(size / 2, size / 2, radius, -90, endAngle);

  return (
    <View style={styles.budgetCard}>
      <View style={styles.budgetTopRow}>
        <View style={styles.budgetLeft}>
          <Text style={styles.budgetLabel}>Total Budget</Text>
          <Text style={styles.budgetValue}>{formatCurrency(displayBudget, currency)}</Text>
        </View>
        <View style={styles.progressCircleContainer}>
          <Svg width={size} height={size} style={styles.svg}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#ebedf8"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {progress > 0 && (
              <Path
                d={arcPath}
                stroke="#39baa6"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeLinecap="round"
              />
            )}
          </Svg>
          <Image
            source={require("../../assets/galafund.png")}
            style={styles.circleLogo}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.budgetBottom}>
        <View style={styles.spentInfo}>
          <Text style={styles.spentText}>
            Spent <Text style={styles.spentAmount}>{formatCurrency(displaySpent, currency)}</Text> • {spentPercent}%
          </Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: fillWidth }]} />
        </View>
        <View style={styles.remainingRow}>
          <Text style={styles.remainingLabel}>Remaining</Text>
          <Text style={styles.remainingValue}>{formatCurrency(displayRemaining, currency)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  budgetCard: {
    backgroundColor: "#fff",
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
    color: "#414754",
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#181c23",
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
  circleLogo: {
    width: 28,
    height: 28,
    position: "absolute",
  },
  budgetBottom: {
    gap: 10,
  },
  spentInfo: {
    flexDirection: "row",
  },
  spentText: {
    fontSize: 12,
    color: "#414754",
  },
  spentAmount: {
    color: "#007dfe",
    fontWeight: "700",
  },
  progressBarBg: {
    height: 8,
    alignSelf: "stretch" as const,
    backgroundColor: "#ebedf8",
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
    color: "#414754",
  },
  remainingValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#39baa6",
  },
});
