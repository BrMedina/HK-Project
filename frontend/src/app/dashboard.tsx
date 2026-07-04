import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

import Header from "../components/Header";
import WelcomeHero from "../components/WelcomeHero";
import BudgetCard from "../components/BudgetCard";
import QuickOverview from "../components/QuickOverview";
import RecentTransactions from "../components/RecentTransactions";
import BottomNav from "../components/BottomNav";

export default function Dashboard() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <WelcomeHero />
        <BudgetCard />
        <QuickOverview />
        <RecentTransactions />
        <View style={styles.spacer} />
      </ScrollView>

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
});
