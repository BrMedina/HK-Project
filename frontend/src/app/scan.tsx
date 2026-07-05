import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, QrCode, Receipt, Save, RefreshCw } from "lucide-react-native";

import { getAllTrips, createTrip, addExpense } from "../db/queries";
import QRScannerScreen from "../scanner/QRScannerScreen";
import ReceiptScannerScreen from "../scanner/ReceiptScannerScreen";
import { getCategoryColor } from "../lib/categoryColors";

const CATEGORIES = ["Food", "Transport", "Shopping", "Activities"];

export default function ScanScreen() {
  const { mode, tab } = useLocalSearchParams<{ mode?: string, tab?: "qr" | "ocr" }>();
  const [activeTab, setActiveTab] = useState<"qr" | "ocr">(tab || "qr");
  const [tripId, setTripId] = useState<string | null>(null);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [manualEntryMode, setManualEntryMode] = useState(false);

  useEffect(() => {
    if (tab === "qr" || tab === "ocr") {
      setActiveTab(tab);
    }
  }, [tab]);

  // Scanned result state
  const [scannedData, setScannedData] = useState<{
    amount: number | null;
    merchantName?: string | null;
    note?: string | null;
    referenceNumber?: string | null;
    date?: string | null;
    source: "qr" | "ocr" | "manual";
  } | null>(null);

  // Editable form state
  const [amountInput, setAmountInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadActiveTrip() {
      try {
        setLoadingTrip(true);
        const trips = await getAllTrips();
        if (trips.length > 0) {
          setTripId(trips[0].id);
        } else {
          // Fallback trip creation
          const newTrip = await createTrip("Hong Kong Trip", 5000, 6.5);
          setTripId(newTrip.id);
        }
      } catch (err) {
        console.error("Failed to load active trip for scan:", err);
      } finally {
        setLoadingTrip(false);
      }
    }
    loadActiveTrip();
  }, []);

  const handleScanned = (data: any) => {
    // Populate form with parsed values
    setManualEntryMode(false);
    setScannedData(data);
    setAmountInput(data.amount ? Math.round(data.amount).toString() : "");
    setNoteInput(data.merchantName || data.note || "");
    // Pre-categorize based on keywords if possible
    const noteLower = (data.merchantName || data.note || "").toLowerCase();
    if (noteLower.includes("starbucks") || noteLower.includes("food") || noteLower.includes("cafe") || noteLower.includes("restaurant")) {
      setSelectedCategory("Food");
    } else if (noteLower.includes("grab") || noteLower.includes("uber") || noteLower.includes("taxi") || noteLower.includes("train") || noteLower.includes("mtr")) {
      setSelectedCategory("Transport");
    } else if (noteLower.includes("mall") || noteLower.includes("store") || noteLower.includes("shop")) {
      setSelectedCategory("Shopping");
    } else if (noteLower.includes("disney") || noteLower.includes("museum") || noteLower.includes("ticket")) {
      setSelectedCategory("Activities");
    } else {
      setSelectedCategory("Food"); // default
    }
  };

  const handleManualEntry = () => {
    setActiveTab("qr");
    setManualEntryMode(true);
    setScannedData({
      amount: null,
      merchantName: null,
      note: null,
      referenceNumber: null,
      date: null,
      source: "manual",
    });
    setAmountInput("");
    setNoteInput("");
    setSelectedCategory("Food");
  };

  useEffect(() => {
    if (mode === "manual" && !loadingTrip) {
      handleManualEntry();
    }
  }, [mode, loadingTrip]);

  const handleSave = async () => {
    if (!tripId || !amountInput) return;
    try {
      setSaving(true);
      const parsedAmount = parseFloat(amountInput.replace(/,/g, ""));
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
      }

      await addExpense(tripId, {
        phpAmount: parsedAmount,
        category: selectedCategory,
        note: noteInput || `${selectedCategory} expense`,
        transactionDate: null,
        source: scannedData?.source || "manual",
      });

      // Clear & Go back to dashboard
      setScannedData(null);
      router.replace("/dashboard");
    } catch (err) {
      console.error("Failed to save scanned expense:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.replace("/dashboard")}>
          <ChevronLeft size={24} color="#181c23" />
        </Pressable>
        <Text style={styles.headerTitle}>Scan Expense</Text>
        <View style={styles.headerSpacer} />
      </View>

      {loadingTrip ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#39baa6" />
        </View>
      ) : scannedData ? (
        /* Confirmation screen when an item is scanned */
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>{manualEntryMode ? "Manual Expense Entry" : "Confirm Scanned Details"}</Text>
              <Text style={styles.formSub}>
                {manualEntryMode
                  ? "enter the expense details manually"
                  : `Parsed via ${scannedData.source === "qr" ? "QR PH code" : "ML Kit OCR"}`}
              </Text>

              {/* Amount input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>AMOUNT (PHP)</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amountInput}
                  onChangeText={(val) => setAmountInput(val.replace(/[^0-9.]/g, ""))}
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor="#717786"
                />
              </View>

              {/* Note input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>MERCHANT / NOTE</Text>
                <TextInput
                  style={styles.textInput}
                  value={noteInput}
                  onChangeText={setNoteInput}
                  placeholder="Enter merchant name or note"
                  placeholderTextColor="#717786"
                />
              </View>

              {/* Category picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>SELECT CATEGORY</Text>
                <View style={styles.categoryRow}>
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    const categoryColor = getCategoryColor(cat);
                    return (
                      <Pressable
                        key={cat}
                        style={[
                          styles.categoryChip,
                          isSelected && {
                            backgroundColor: categoryColor.bg,
                            borderColor: categoryColor.color,
                          },
                        ]}
                        onPress={() => setSelectedCategory(cat)}
                      >
                        <Text
                          style={[
                            styles.categoryChipText,
                            isSelected && { color: categoryColor.color, fontWeight: "700" },
                          ]}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Actions */}
              <View style={styles.btnRow}>
                <Pressable style={styles.actionBtn} onPress={() => setScannedData(null)}>
                  <RefreshCw size={18} color="#717786" />
                  <Text style={styles.retryBtnText}>Scan Again</Text>
                </Pressable>

                <Pressable style={[styles.actionBtn, styles.saveBtn, !amountInput && styles.saveBtnDisabled]} onPress={handleSave} disabled={saving || !amountInput}>
                  {saving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Save size={18} color="#fff" />
                      <Text style={styles.saveBtnText}>Save</Text>
                    </>
                  )}
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        /* Camera Scanner mode */
        <View style={{ flex: 1 }}>
          {/* Camera Frame */}
          <View style={styles.cameraBox}>
            {activeTab === "qr" ? (
              <QRScannerScreen onScanned={handleScanned} onManualEntry={handleManualEntry} />
            ) : (
              <ReceiptScannerScreen onScanned={handleScanned} />
            )}
          </View>

          {/* Tab Selector */}
          <View style={styles.tabContainer}>
            <Pressable
              style={[styles.tab, activeTab === "qr" && styles.tabActive]}
              onPress={() => setActiveTab("qr")}
            >
              <QrCode size={18} color={activeTab === "qr" ? "#007dfe" : "#717786"} />
              <Text style={[styles.tabText, activeTab === "qr" && styles.tabTextActive]}>QR PH Code</Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === "ocr" && styles.tabActive]}
              onPress={() => setActiveTab("ocr")}
            >
              <Receipt size={18} color={activeTab === "ocr" ? "#007dfe" : "#717786"} />
              <Text style={[styles.tabText, activeTab === "ocr" && styles.tabTextActive]}>Receipt OCR</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8f9ff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(193, 198, 215, 0.15)",
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#181c23" },
  headerSpacer: { width: 32 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Tab Selector
  tabContainer: {
    flexDirection: "row",
    padding: 6,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(193,198,215,0.25)",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabActive: { backgroundColor: "rgba(0,125,254,0.08)" },
  tabText: { fontSize: 13, fontWeight: "600", color: "#717786" },
  tabTextActive: { color: "#007dfe", fontWeight: "700" },

  // Camera Frame Box
  cameraBox: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "rgba(193,198,215,0.15)",
  },

  // Confirm Form
  formContainer: { padding: 20, paddingBottom: 60 },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(193,198,215,0.25)",
  },
  formTitle: { fontSize: 20, fontWeight: "800", color: "#181c23" },
  formSub: { fontSize: 12, color: "#717786", marginTop: 4, marginBottom: 24, textTransform: "uppercase", letterSpacing: 0.5 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 10, fontWeight: "800", color: "#717786", marginBottom: 8, letterSpacing: 0.5 },
  amountInput: {
    fontSize: 32,
    fontWeight: "800",
    color: "#007dfe",
    borderBottomWidth: 2,
    borderBottomColor: "#007dfe",
    paddingVertical: 6,
  },
  textInput: {
    fontSize: 15,
    fontWeight: "600",
    color: "#181c23",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(193,198,215,0.5)",
    paddingVertical: 8,
  },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#f1f3fe",
    borderWidth: 1,
    borderColor: "transparent",
  },
  categoryChipText: { fontSize: 13, fontWeight: "600", color: "#717786" },

  // Form Buttons
  btnRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  retryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(193,198,215,0.5)",
    borderRadius: 14,
    paddingVertical: 14,
  },
  retryBtnText: { fontSize: 14, fontWeight: "700", color: "#717786" },
  saveBtn: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#39baa6",
    borderRadius: 14,
    paddingVertical: 14,
  },
  saveBtnDisabled: { backgroundColor: "#c1c6d7" },
  saveBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },
  actionBtn: {
    flex: 1,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
});
