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

export default function ConvertScreen() {
  const c = useConverter();

  if (c.loading) {
    return (
      <SafeAreaView style={s.safe} edges={["top"]}>
        <StatusBar style="dark" />
        <Stack.Screen options={{ headerShown: false }} />
        <Header tripName="Currency Converter" />
        <View style={s.loading}>
          <ActivityIndicator size="large" color="#39baa6" />
          <Text style={s.loadingText}>Loading converter…</Text>
        </View>
        <BottomNav activeTab="convert" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <StatusBar style="dark" />
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
            <View style={s.heroOverlay} />
            <View style={{ position: "relative" }}>
              <Text style={s.heroLabel}>CURRENT EXCHANGE FOCUS</Text>
              <Text style={s.heroTitle}>{c.isSwapped ? "HKD to PHP" : "PHP to HKD"}</Text>
              <View style={s.badge}>
                <TrendingUp size={14} color="#007dfe" />
                <Text style={s.badgeText}>Live Rate: 1 HKD = {c.rate} PHP</Text>
              </View>
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
          />

          {/* Rate History */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardTitle}>Rate Adjustments</Text>
              <Pressable style={s.resetBtn} onPress={c.handleResetHistory}>
                <RotateCcw size={12} color="#007dfe" />
                <Text style={s.resetText}>Reset to Default</Text>
              </Pressable>
            </View>
            {c.rateHistory.map((e, i) => (
              <View key={e.id} style={[s.histRow, i < c.rateHistory.length - 1 && s.histBorder]}>
                <View style={s.histLeft}>
                  <View style={[s.dot, { backgroundColor: e.isCurrent ? "#39baa6" : "#c1c6d7" }]} />
                  <Text style={s.histDate}>{e.date}</Text>
                </View>
                <Text style={[s.histRate, !e.isCurrent && { color: "#717786" }]}>
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
  safe: { flex: 1, backgroundColor: "#f8f9ff" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  loadingText: { fontSize: 14, color: "#717786", fontWeight: "500" },
  scroll: { paddingBottom: 100 },

  // Hero
  hero: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32, overflow: "hidden" },
  heroOverlay: { ...StyleSheet.absoluteFill as object, backgroundColor: "#f8f9ff", opacity: 0.6 },
  heroLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5, color: "#717786", marginBottom: 6, textTransform: "uppercase" },
  heroTitle: { fontSize: 36, fontWeight: "800", color: "#181c23", letterSpacing: -0.5, marginBottom: 10 },
  badge: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: 6, backgroundColor: "rgba(214,227,255,0.45)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { fontSize: 14, fontWeight: "700", color: "#007dfe" },

  // Rate history card
  card: {
    backgroundColor: "#fff", marginHorizontal: 20, marginTop: 16, borderRadius: 12, padding: 20,
    borderWidth: 1, borderColor: "rgba(193,198,215,0.25)",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 16, elevation: 3,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#181c23", flex: 1 },
  resetBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  resetText: { fontSize: 11, fontWeight: "800", color: "#007dfe", letterSpacing: 0.3 },

  histRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14 },
  histBorder: { borderBottomWidth: 1, borderBottomColor: "rgba(193,198,215,0.15)" },
  histLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  histDate: { fontSize: 15, fontWeight: "500", color: "#181c23" },
  histRate: { fontSize: 15, fontWeight: "700", color: "#181c23" },

  spacer: { height: 40 },
});
