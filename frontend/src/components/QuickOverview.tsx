import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Utensils, Train, ShoppingBag, Ticket } from "lucide-react-native";

export default function QuickOverview() {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Overview</Text>
        <View style={styles.toggleContainer}>
          <Pressable style={[styles.toggleBtn, styles.toggleActive]}>
            <Text style={styles.toggleActiveText}>Circle</Text>
          </Pressable>
          <Pressable style={styles.toggleBtn}>
            <Text style={styles.toggleInactiveText}>Card</Text>
          </Pressable>
        </View>
        <Pressable>
          <Text style={styles.seeAllText}>See All</Text>
        </Pressable>
      </View>

      <View style={styles.categoryRow}>
        {/* Food */}
        <View style={styles.categoryItem}>
          <View style={[styles.categoryCircle, { borderColor: "#007dfe", borderTopColor: "#ebedf8" }]}>
            <Utensils size={18} color="#007dfe" />
          </View>
          <Text style={styles.categoryLabel}>Food</Text>
          <Text style={[styles.categoryPercent, { color: "#007dfe" }]}>34%</Text>
        </View>

        {/* Transport */}
        <View style={styles.categoryItem}>
          <View style={[styles.categoryCircle, { borderColor: "#39baa6", borderTopColor: "#ebedf8", borderRightColor: "#ebedf8" }]}>
            <Train size={18} color="#39baa6" />
          </View>
          <Text style={styles.categoryLabel}>Transport</Text>
          <Text style={[styles.categoryPercent, { color: "#39baa6" }]}>17%</Text>
        </View>

        {/* Shopping */}
        <View style={styles.categoryItem}>
          <View style={[styles.categoryCircle, { borderColor: "#f97316", borderTopColor: "#ebedf8" }]}>
            <ShoppingBag size={18} color="#f97316" />
          </View>
          <Text style={styles.categoryLabel}>Shopping</Text>
          <Text style={[styles.categoryPercent, { color: "#f97316" }]}>29%</Text>
        </View>

        {/* Activities */}
        <View style={styles.categoryItem}>
          <View style={[styles.categoryCircle, { borderColor: "#a855f7", borderTopColor: "#ebedf8", borderRightColor: "#ebedf8", borderLeftColor: "#ebedf8" }]}>
            <Ticket size={18} color="#a855f7" />
          </View>
          <Text style={styles.categoryLabel}>Activities</Text>
          <Text style={[styles.categoryPercent, { color: "#a855f7" }]}>14%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#181c23",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#ebedf8",
    padding: 3,
    borderRadius: 999,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  toggleActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleActiveText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#39baa6",
  },
  toggleInactiveText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#414754",
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#39baa6",
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  categoryItem: {
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  categoryCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  categoryLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#181c23",
  },
  categoryPercent: {
    fontSize: 8,
    fontWeight: "700",
  },
});
