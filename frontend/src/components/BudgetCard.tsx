import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Svg, { Circle } from "react-native-svg";

type Props = {
  budgetPhp: number;
  spentPhp: number;
  remainingPhp: number;
  spentPercent: number;
};

function formatPhp(amount: number) {
  return `PHP ${amount.toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function BudgetCard({ budgetPhp, spentPhp, remainingPhp, spentPercent }: Props) {
  const fillWidth = `${Math.min(spentPercent, 100)}%` as `${number}%`;

  // Circular Progress Calculation
  const size = 64;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2; // (64 - 6) / 2 = 29
  const circumference = 2 * Math.PI * radius; // ~182.2
  const progress = Math.min(spentPercent, 100) / 100;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View style={styles.budgetCard}>
      <View style={styles.budgetTopRow}>
        <View style={styles.budgetLeft}>
          <Text style={styles.budgetLabel}>Total Budget</Text>
          <Text style={styles.budgetValue}>{formatPhp(budgetPhp)}</Text>
        </View>
        <View style={styles.progressCircleContainer}>
          <Svg width={size} height={size} style={styles.svg}>
            {/* Background Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#ebedf8"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#39baa6"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              origin={`${size / 2}, ${size / 2}`}
              rotation="-90"
            />
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
            Spent <Text style={styles.spentAmount}>{formatPhp(spentPhp)}</Text> • {spentPercent}%
          </Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: fillWidth }]} />
        </View>
        <View style={styles.remainingRow}>
          <Text style={styles.remainingLabel}>Remaining</Text>
          <Text style={styles.remainingValue}>{formatPhp(remainingPhp)}</Text>
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
