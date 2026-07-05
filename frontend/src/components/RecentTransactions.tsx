import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import TransactionItem, { Expense } from "./TransactionItem";

type Props = {
  expenses: Expense[];
  currency?: string;
  exchangeRate?: number;
};

export default function RecentTransactions({ expenses, currency = "PHP", exchangeRate = 1 }: Props) {
  const recent = expenses.slice(0, 5);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <Pressable onPress={() => router.replace("/transactions")}>
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
          recent.map((expense, index) => (
            <TransactionItem
              key={expense.id}
              expense={expense}
              currency={currency}
              exchangeRate={exchangeRate}
              showTimeOnly={false}
              isLast={index === recent.length - 1}
            />
          ))
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
