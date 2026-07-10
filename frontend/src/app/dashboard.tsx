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
import { useTheme, lightColors, darkColors } from "../lib/ThemeContext";

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
  const { theme } = useTheme();
  const colors = theme === "light" ? lightColors : darkColors;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar style={theme === "light" ? "dark" : "light"} />
      <Stack.Screen options={{ headerShown: false }} />

      <Header tripName={trip?.name ?? "My Trip"} showDropdown={true} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#39baa6" />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading your trip...</Text>
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
            exchangeRate={trip?.exchange_rate || 7.84}
          />
          <QuickOverview
            categoryTotals={categoryTotals}
            totalSpent={totalSpent}
          />
          <RecentTransactions 
            expenses={expenses} 
            currency={trip?.currency_preference || "PHP"}
            exchangeRate={trip?.exchange_rate || 7.84}
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
