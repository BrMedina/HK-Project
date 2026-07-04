import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default function BudgetCard() {
  return (
    <View style={styles.budgetCard}>
      <View style={styles.budgetTopRow}>
        <View>
          <Text style={styles.budgetLabel}>Total Budget</Text>
          <Text style={styles.budgetValue}>PHP 30,000</Text>
        </View>
        <View style={styles.progressCircleContainer}>
          <View style={styles.progressCircle}>
            <Image
              source={require("../../assets/galafund.png")}
              style={styles.circleLogo}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      <View style={styles.budgetBottom}>
        <View style={styles.spentInfo}>
          <Text style={styles.spentText}>
            Spent <Text style={styles.spentAmount}>PHP 12,450</Text> • 41%
          </Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: "41%" }]} />
        </View>
        <View style={styles.remainingRow}>
          <Text style={styles.remainingLabel}>Remaining</Text>
          <Text style={styles.remainingValue}>PHP 17,550</Text>
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
  },
  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 6,
    borderColor: "#39baa6",
    borderTopColor: "#ebedf8",
    justifyContent: "center",
    alignItems: "center",
  },
  circleLogo: {
    width: 32,
    height: 32,
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
    width: "100%",
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
