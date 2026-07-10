import React from "react";
import { StyleSheet, Text, View, ScrollView, Pressable, ActivityIndicator, ImageBackground, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { TrendingUp, RotateCcw } from "lucide-react-native";

import { useConverter } from "../db/useConverter";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import QuickConverter from "../components/QuickConverter";
import ManualRateCard from "../components/ManualRateCard";
import { useTheme, lightColors, darkColors } from "../lib/ThemeContext";

export default function ConvertScreen() {
  const c = useConverter();
  const { theme } = useTheme();
  const colors = theme === "light" ? lightColors : darkColors;

  if (c.loading) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
        <StatusBar style={theme === "light" ? "dark" : "light"} />
        <Stack.Screen options={{ headerShown: false }} />
        <Header tripName="Currency Converter" />
        <View style={s.loading}>
          <ActivityIndicator size="large" color="#39baa6" />
          <Text style={[s.loadingText, { color: colors.text }]}>Loading converter…</Text>
        </View>
        <BottomNav activeTab="convert" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar style={theme === "light" ? "dark" : "light"} />
      <Stack.Screen options={{ headerShown: false }} />

      <Header tripName="Currency Converter" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {/* Hero Header */}
          <ImageBackground
            source={require("../../assets/images/skyline.png")}
            style={s.hero}
            imageStyle={{ opacity: 0.1 }}
            resizeMode="cover"
          >
            <View style={[s.heroOverlay, { backgroundColor: theme === "light" ? "#f8f9ff" : "#1a1a1a" }]} />
            <View style={{ position: "relative" }}>
              <Text style={[s.heroLabel, { color: theme === "light" ? "#717786" : "#7d8a87" }]}>CURRENT EXCHANGE FOCUS</Text>
              <Text style={[s.heroTitle, { color: colors.text }]}>{c.isSwapped ? "HKD to PHP" : "PHP to HKD"}</Text>
              <View style={[s.badge, { backgroundColor: theme === "light" ? "rgba(214,227,255,0.45)" : "rgba(57, 186, 166, 0.2)" }]}>
                <TrendingUp size={14} color="#39baa6" />
                <Text style={[s.badgeText, { color: "#39baa6" }]}>Live Rate: 1 HKD = {c.rate} PHP</Text>
              </View>
              <Text style={[s.rateNote, { color: theme === "light" ? "#717786" : "#7d8a87" }]}>Updates every 6 hours from the web, not every second.</Text>
            </View>
          </ImageBackground>

          {/* Quick Converter */}
          <QuickConverter
            isSwapped={c.isSwapped}
            phpValue={c.phpValue}
            hkdValue={c.hkdValue}
            onPhpChange={c.handlePhpChange}
            onHkdChange={c.handleHkdChange}
            onSwap={c.handleSwap}
            onRefresh={c.handleRefreshRate}
          />

          {/* Rate History */}
          <View style={[s.card, { backgroundColor: colors.bg, borderColor: theme === "light" ? "rgba(193,198,215,0.25)" : "rgba(100, 110, 108, 0.2)" }]}>
            <View style={s.cardHeader}>
              <Text style={[s.cardTitle, { color: colors.text }]}>Rate Adjustments</Text>
              <Pressable style={s.resetBtn} onPress={c.handleRefreshRate}>
                <RotateCcw size={12} color="#39baa6" />
                <Text style={[s.resetText, { color: "#39baa6" }]}>{c.refreshing ? "Refreshing..." : "Refresh Live Rate"}</Text>
              </Pressable>
            </View>
            {c.rateHistory.map((e, i) => (
              <View key={e.id} style={[s.histRow, i < c.rateHistory.length - 1 && { ...s.histBorder, borderBottomColor: theme === "light" ? "rgba(193,198,215,0.15)" : "rgba(100, 110, 108, 0.1)" }]}>
                <View style={s.histLeft}>
                  <View style={[s.dot, { backgroundColor: e.isCurrent ? "#39baa6" : theme === "light" ? "#c1c6d7" : "#3d4d4a" }]} />
                  <Text style={[s.histDate, { color: colors.text }]}>{e.date}</Text>
                </View>
                <Text style={[s.histRate, { color: e.isCurrent ? colors.text : theme === "light" ? "#717786" : "#7d8a87" }]}>
                  1 HKD = {e.rate} PHP
                </Text>
              </View>
            ))}
          </View>

          {/* Manual Rate Override */}
          <ManualRateCard
            customRateInput={c.customRateInput}
            saving={c.saving}
            onRateChange={c.handleCustomRateChange}
            onSave={c.handleSaveRate}
          />

          <View style={s.spacer} />
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNav activeTab="convert" />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  loadingText: { fontSize: 14, fontWeight: "500" },
  scroll: { paddingBottom: 100 },

  // Hero
  hero: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32, overflow: "hidden" },
  heroOverlay: { ...StyleSheet.absoluteFill as object, opacity: 0.6 },
  heroLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5, marginBottom: 6, textTransform: "uppercase" },
  heroTitle: { fontSize: 36, fontWeight: "800", letterSpacing: -0.5, marginBottom: 10 },
  badge: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { fontSize: 14, fontWeight: "700" },
  rateNote: { marginTop: 8, fontSize: 12, lineHeight: 16, fontWeight: "500" },

  // Rate history card
  card: {
    marginHorizontal: 20, marginTop: 16, borderRadius: 12, padding: 20,
    borderWidth: 1,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 16, elevation: 3,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: "700", flex: 1 },
  resetBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  resetText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.3 },

  histRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14 },
  histBorder: { borderBottomWidth: 1 },
  histLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  histDate: { fontSize: 15, fontWeight: "500" },
  histRate: { fontSize: 15, fontWeight: "700" },

  spacer: { height: 40 },
});
