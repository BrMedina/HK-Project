import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Utensils, Train, ShoppingBag, Ticket } from "lucide-react-native";
import Svg, { Circle } from "react-native-svg";
import { router } from "expo-router";
import { getCategoryColor } from "../lib/categoryColors";

type CategoryTotals = { [category: string]: number };

type Props = {
  categoryTotals: CategoryTotals;
  totalSpent: number;
};

type CategoryConfig = {
  key: string;
  label: string;
  icon: React.ReactNode;
  color: string;
};

const CATEGORIES: CategoryConfig[] = [
  {
    key: "Food",
    label: "Food",
    icon: <Utensils size={18} color={getCategoryColor("Food").color} />,
    color: getCategoryColor("Food").color,
  },
  {
    key: "Transport",
    label: "Transport",
    icon: <Train size={18} color={getCategoryColor("Transport").color} />,
    color: getCategoryColor("Transport").color,
  },
  {
    key: "Shopping",
    label: "Shopping",
    icon: <ShoppingBag size={18} color={getCategoryColor("Shopping").color} />,
    color: getCategoryColor("Shopping").color,
  },
  {
    key: "Activities",
    label: "Activities",
    icon: <Ticket size={18} color={getCategoryColor("Activities").color} />,
    color: getCategoryColor("Activities").color,
  },
];

export default function QuickOverview({ categoryTotals, totalSpent }: Props) {
  const [activeView, setActiveView] = useState<"Circle" | "Card">("Circle");

  const getPercent = (catKey: string) => {
    if (totalSpent === 0) return 0;
    return Math.round(((categoryTotals[catKey] || 0) / totalSpent) * 100);
  };

  const size = 52;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2; // 23.5
  const circumference = 2 * Math.PI * radius; // ~147.65

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Overview</Text>
        <View style={styles.toggleContainer}>
          <Pressable
            style={[styles.toggleBtn, activeView === "Circle" && styles.toggleActive]}
            onPress={() => setActiveView("Circle")}
          >
            <Text style={activeView === "Circle" ? styles.toggleActiveText : styles.toggleInactiveText}>Circle</Text>
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, activeView === "Card" && styles.toggleActive]}
            onPress={() => setActiveView("Card")}
          >
            <Text style={activeView === "Card" ? styles.toggleActiveText : styles.toggleInactiveText}>Card</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => router.replace("/budget")}>
          <Text style={styles.seeAllText}>See All</Text>
        </Pressable>
      </View>

      <View style={styles.categoryRow}>
        {CATEGORIES.map((cat) => {
          const pct = getPercent(cat.key);
          const progress = pct / 100;
          const strokeDashoffset = circumference - progress * circumference;

          return (
            <View key={cat.key} style={styles.categoryItem}>
              {activeView === "Circle" ? (
                <View style={styles.categoryCircleContainer}>
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
                      stroke={cat.color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      origin={`${size / 2}, ${size / 2}`}
                      rotation="-90"
                    />
                  </Svg>
                  <View style={styles.iconWrapper}>
                    {cat.icon}
                  </View>
                </View>
              ) : (
                /* Card View Alternative */
                <View style={[styles.categoryCard, { backgroundColor: `${cat.color}15` }]}>
                  {cat.icon}
                </View>
              )}
              <Text style={styles.categoryLabel}>{cat.label}</Text>
              <Text style={[styles.categoryPercent, { color: cat.color }]}>
                {pct}%
              </Text>
            </View>
          );
        })}
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
  categoryCircleContainer: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  svg: {
    position: "absolute",
  },
  iconWrapper: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryCard: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
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
