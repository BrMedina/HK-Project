import React from "react";
import { StyleSheet, ScrollView, View, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

import Header from "../components/Header";
import WelcomeHero from "../components/WelcomeHero";
import BudgetCard from "../components/BudgetCard";
import QuickOverview from "../components/QuickOverview";
import RecentTransactions from "../components/RecentTransactions";
import BottomNav from "../components/BottomNav";
import { useDashboard } from "../db/useDashboard";

export default function Dashboard() {
  const {
    trip,
    expenses,
    totalSpent,
    categoryTotals,
    budgetPhp,
    remainingPhp,
    spentPercent,
    loading,
  } = useDashboard();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      <Header tripName={trip?.name ?? "My Trip"} showDropdown={true} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#39baa6" />
          <Text style={styles.loadingText}>Loading your trip...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <WelcomeHero />
          <BudgetCard
            budgetPhp={budgetPhp}
            spentPhp={totalSpent}
            remainingPhp={remainingPhp}
            spentPercent={spentPercent}
            currency={trip?.currency_preference || "PHP"}
            exchangeRate={trip?.exchange_rate || 6.5}
          />
          <QuickOverview
            categoryTotals={categoryTotals}
            totalSpent={totalSpent}
          />
          <RecentTransactions 
            expenses={expenses} 
            currency={trip?.currency_preference || "PHP"}
            exchangeRate={trip?.exchange_rate || 6.5}
          />
          <View style={styles.spacer} />
        </ScrollView>
      )}

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9ff",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  spacer: {
    height: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#717786",
    fontWeight: "500",
  },
});
