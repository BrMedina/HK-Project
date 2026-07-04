import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Train, Utensils, ShoppingBag, Camera, Ticket, HelpCircle } from "lucide-react-native";
import { Expense } from "../db/useDashboard";

type Props = {
  expenses: Expense[];
};

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; bg: string }> = {
  Food: { icon: <Utensils size={20} color="#f97316" />, bg: "#ffedd5" },
  Transport: { icon: <Train size={20} color="#ef4444" />, bg: "#fee2e2" },
  Shopping: { icon: <ShoppingBag size={20} color="#a855f7" />, bg: "#f3e8ff" },
  Activities: { icon: <Camera size={20} color="#007dfe" />, bg: "#dbeafe" },
  Entertainment: { icon: <Ticket size={20} color="#39baa6" />, bg: "#d1fae5" },
};

function getIconConfig(category: string) {
  return CATEGORY_CONFIG[category] ?? { icon: <HelpCircle size={20} color="#717786" />, bg: "#ebedf8" };
}

function formatDate(timestamp: number | null): string {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

export default function RecentTransactions({ expenses }: Props) {
  const recent = expenses.slice(0, 5);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <Pressable>
          <Text style={styles.seeAllText}>See All</Text>
        </Pressable>
      </View>

      <View style={styles.transactionsList}>
        {recent.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No transactions yet.</Text>
            <Text style={styles.emptySubText}>Tap the scan button to add your first expense.</Text>
          </View>
        ) : (
          recent.map((expense, index) => {
            const { icon, bg } = getIconConfig(expense.category);
            const isLast = index === recent.length - 1;
            return (
              <View key={expense.id} style={[styles.transactionItem, isLast && styles.transactionItemLast]}>
                <View style={[styles.transIconContainer, { backgroundColor: bg }]}>
                  {icon}
                </View>
                <View style={styles.transDetails}>
                  <Text style={styles.transTitle} numberOfLines={1}>
                    {expense.note || expense.category}
                  </Text>
                  <Text style={styles.transSub}>
                    {formatDate(expense.date)} • {expense.category}
                  </Text>
                </View>
                <Text style={styles.transAmount}>
                  -PHP {expense.php_amount.toLocaleString("en-PH")}
                </Text>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
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
  seeAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#39baa6",
  },
  transactionsList: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(193, 198, 215, 0.2)",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3fe",
  },
  transactionItemLast: {
    borderBottomWidth: 0,
  },
  transIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  transDetails: {
    flex: 1,
    marginLeft: 12,
  },
  transTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#181c23",
  },
  transSub: {
    fontSize: 10,
    color: "#717786",
    marginTop: 2,
  },
  transAmount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#181c23",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 6,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#181c23",
  },
  emptySubText: {
    fontSize: 12,
    color: "#717786",
    textAlign: "center",
  },
});
