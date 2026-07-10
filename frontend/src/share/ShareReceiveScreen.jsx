import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useShareIntentContext } from "expo-share-intent";
import { router, Stack } from "expo-router";
import { ChevronLeft, Save } from "lucide-react-native";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import { parseReceiptText } from "../scanner/receiptParser";
import { getAllTrips, createTrip, addExpense } from "../db/queries";
import { getCategoryColor } from "../lib/categoryColors";

const CATEGORIES = ["Food", "Transport", "Shopping", "Activities"];
const DEFAULT_EXCHANGE_RATE = 7.84;

export default function ShareReceiveScreen() {
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntentContext();
  const [tripId, setTripId] = useState(null);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [loading, setLoading] = useState(true);
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("Food");
  const [amountCurrency, setAmountCurrency] = useState("HKD");
  const [exchangeRate, setExchangeRate] = useState(DEFAULT_EXCHANGE_RATE);

  useEffect(() => {
    async function loadActiveTrip() {
      try {
        setLoadingTrip(true);
        const trips = await getAllTrips();
        if (trips.length > 0) {
          setTripId(trips[0].id);
          setExchangeRate(trips[0].exchange_rate || DEFAULT_EXCHANGE_RATE);
        } else {
          const newTrip = await createTrip("Gala Fund", 5000, DEFAULT_EXCHANGE_RATE);
          setTripId(newTrip.id);
          setExchangeRate(newTrip.exchange_rate || DEFAULT_EXCHANGE_RATE);
        }
      } catch (err) {
        console.error("Failed to load active trip for share receive:", err);
      } finally {
        setLoadingTrip(false);
      }
    }
    loadActiveTrip();
  }, []);

  useEffect(() => {
    if (!hasShareIntent || !shareIntent?.files?.length) return;
    runOcr(shareIntent.files[0].path);
  }, [hasShareIntent, shareIntent]);

  const runOcr = async (imageUri) => {
    setLoading(true);
    setError("");
    try {
      const result = await TextRecognition.recognize(imageUri);
      const parsedData = parseReceiptText(result.text);
      setParsed({ ...parsedData, imageUri });
      // Pre-categorize based on keywords if possible
      const noteLower = (parsedData.merchantName || parsedData.note || "").toLowerCase();
      if (noteLower.includes("starbucks") || noteLower.includes("food") || noteLower.includes("cafe") || noteLower.includes("restaurant")) {
        setCategory("Food");
      } else if (noteLower.includes("grab") || noteLower.includes("uber") || noteLower.includes("taxi") || noteLower.includes("train") || noteLower.includes("mtr")) {
        setCategory("Transport");
      } else if (noteLower.includes("mall") || noteLower.includes("store") || noteLower.includes("shop")) {
        setCategory("Shopping");
      } else if (noteLower.includes("disney") || noteLower.includes("museum") || noteLower.includes("ticket")) {
        setCategory("Activities");
      } else {
        setCategory("Food");
      }
    } catch (e) {
      setError("Couldn't read that image. You can still enter it manually below.");
      setParsed({ amount: null, referenceNumber: null, date: null, rawText: "", imageUri });
    } finally {
      setLoading(false);
    }
  };

  const getConvertedAmount = (value, from) => {
    const parsedValue = parseFloat(value?.toString().replace(/,/g, ""));
    if (!value || Number.isNaN(parsedValue) || parsedValue <= 0) {
      return 0;
    }
    if (from === "HKD") {
      return Number((parsedValue * exchangeRate).toFixed(2));
    }
    return Number((parsedValue / exchangeRate).toFixed(2));
  };

  const toggleAmountCurrency = () => {
    const nextCurrency = amountCurrency === "HKD" ? "PHP" : "HKD";
    if (parsed?.amount) {
      const converted = getConvertedAmount(parsed.amount, amountCurrency);
      setParsed({ ...parsed, amount: converted });
    }
    setAmountCurrency(nextCurrency);
  };

  const save = async () => {
    if (!parsed?.amount || !tripId) return;
    
    let tDate = null;
    if (parsed.date) {
      const ts = Date.parse(parsed.date);
      if (!isNaN(ts)) {
        tDate = ts;
      }
    }

    const phpAmount = amountCurrency === "PHP"
      ? parsed.amount
      : Number((parsed.amount * exchangeRate).toFixed(2));

    await addExpense(tripId, {
      phpAmount,
      category,
      note: parsed.referenceNumber ? `Ref ${parsed.referenceNumber}` : "Shared receipt",
      transactionDate: tDate,
      source: "share",
      imageUri: parsed.imageUri,
    });
    resetShareIntent();
    router.replace("/dashboard");
  };

  const handleCancel = () => {
    resetShareIntent();
    router.replace("/dashboard");
  };

  if (loadingTrip) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#39baa6" />
      </View>
    );
  }

  if (!hasShareIntent) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <StatusBar style="dark" />
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={handleCancel}>
            <ChevronLeft size={24} color="#181c23" />
          </Pressable>
          <Text style={styles.headerTitle}>Shared Receipt</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.center}>
          <Text style={styles.infoText}>No shared image received.</Text>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelBtnText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <StatusBar style="dark" />
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={handleCancel}>
            <ChevronLeft size={24} color="#181c23" />
          </Pressable>
          <Text style={styles.headerTitle}>Shared Receipt</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#39baa6" />
          <Text style={styles.loadingText}>Reading receipt…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleCancel}>
          <ChevronLeft size={24} color="#181c23" />
        </Pressable>
        <Text style={styles.headerTitle}>Confirm Expense</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Confirm Scanned Details</Text>
            <Text style={styles.formSub}>Gala Fund Share Target</Text>

            {parsed?.imageUri && (
              <Image source={{ uri: parsed.imageUri }} style={styles.preview} resizeMode="contain" />
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* Amount input */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>AMOUNT ({amountCurrency})</Text>
                <Pressable style={styles.currencyToggle} onPress={toggleAmountCurrency}>
                  <Text style={styles.currencyToggleText}>Switch to {amountCurrency === "HKD" ? "PHP" : "HKD"}</Text>
                </Pressable>
              </View>
              <TextInput
                style={styles.amountInput}
                value={parsed?.amount ? String(parsed.amount) : ""}
                onChangeText={(val) => setParsed({ ...parsed, amount: parseFloat(val) || null })}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor="#717786"
              />
              <Text style={styles.conversionHint}>
                {parsed?.amount
                  ? `≈ ${amountCurrency === "HKD" ? "PHP" : "HKD"} ${amountCurrency === "HKD"
                      ? getConvertedAmount(parsed.amount, "HKD").toFixed(2)
                      : getConvertedAmount(parsed.amount, "PHP").toFixed(2)}`
                  : `Enter an amount to see the ${amountCurrency === "HKD" ? "PHP" : "HKD"} equivalent`}
              </Text>
            </View>

            {/* Category picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>SELECT CATEGORY</Text>
              <View style={styles.categoryRow}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
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
                      onPress={() => setCategory(cat)}
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

            {/* Note Display (Optional/Info) */}
            {parsed?.referenceNumber ? (
              <View style={styles.infoGroup}>
                <Text style={styles.infoLabel}>REFERENCE NUMBER</Text>
                <Text style={styles.infoValue}>{parsed.referenceNumber}</Text>
              </View>
            ) : null}

            {/* Actions */}
            <View style={styles.btnRow}>
              <Pressable style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.saveBtn, !parsed?.amount && styles.saveBtnDisabled]}
                onPress={save}
                disabled={!parsed?.amount}
              >
                <Save size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9f9ff" },
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
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f9f9ff" },
  loadingText: { marginTop: 12, color: "#717786", fontSize: 14, fontWeight: "500" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  infoText: { fontSize: 16, fontWeight: "600", color: "#181c23", marginBottom: 16 },

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
  formSub: { fontSize: 12, color: "#717786", marginTop: 4, marginBottom: 20, textTransform: "uppercase", letterSpacing: 0.5 },
  preview: { width: "100%", height: 200, marginBottom: 20, borderRadius: 14 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 10, fontWeight: "800", color: "#717786", marginBottom: 8, letterSpacing: 0.5 },
  labelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  amountInput: {
    fontSize: 32,
    fontWeight: "800",
    color: "#007dfe",
    borderBottomWidth: 2,
    borderBottomColor: "#007dfe",
    paddingVertical: 6,
  },
  currencyToggle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(57, 186, 166, 0.12)",
  },
  currencyToggleText: { fontSize: 11, fontWeight: "700", color: "#39baa6" },
  conversionHint: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#39baa6",
  },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  categoryChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f1f3fe",
    borderWidth: 1,
    borderColor: "transparent",
  },
  categoryChipText: { fontSize: 13, fontWeight: "600", color: "#717786" },

  // Info Group
  infoGroup: { marginBottom: 24, backgroundColor: "#f8f9ff", padding: 12, borderRadius: 12 },
  infoLabel: { fontSize: 9, fontWeight: "800", color: "#717786", marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: "600", color: "#181c23" },

  error: { color: "#ef4444", marginBottom: 16, fontSize: 13, fontWeight: "500" },

  // Form Buttons
  btnRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  cancelBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(193,198,215,0.5)",
    borderRadius: 14,
    paddingVertical: 14,
  },
  cancelBtnText: { fontSize: 14, fontWeight: "700", color: "#717786" },
  saveBtn: {
    flex: 1,
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
});
