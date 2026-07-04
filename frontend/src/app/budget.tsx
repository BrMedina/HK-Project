import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable, ActivityIndicator, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack, router } from "expo-router";
import { Menu, Bell, Calendar, ShieldCheck, Settings, ChevronDown, Utensils, Train, ShoppingBag, Camera, HelpCircle, Wallet } from "lucide-react-native";
import { getAllTrips, getExpensesForTrip, updateTripPreferences } from "../db/queries";
import BottomNav from "../components/BottomNav";
import BudgetCard from "../components/BudgetCard";

type Trip = {
  id: string;
  name: string;
  budget_hkd: number;
  exchange_rate: number;
  created_at: number;
  duration_days?: number;
  currency_preference?: string;
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const formatDate = (date: Date) => {
  return `${months[date.getMonth()]} ${date.getDate()}`;
};
const getDurationText = (createdAt: number | undefined, days: number) => {
  const finalDays = days || 1;
  const start = new Date(createdAt || Date.now());
  const end = new Date(start.getTime() + (finalDays - 1) * 24 * 60 * 60 * 1000);
  return `${finalDays} ${finalDays === 1 ? 'Day' : 'Days'} (${formatDate(start)} - ${formatDate(end)})`;
};

type Expense = {
  id: string;
  php_amount: number;
  category: string;
  date: number;
};

const CATEGORY_LIMIT_PROPORTIONS: Record<string, number> = {
  Food: 0.4,       // 40% of total budget
  Transport: 0.2,  // 20%
  Shopping: 0.3,   // 30%
  Activities: 0.1, // 10%
};

const CATEGORY_ICONS: Record<string, { icon: React.ReactNode; bg: string; color: string }> = {
  Food: { icon: <Utensils size={20} color="#f97316" />, bg: "#ffedd5", color: "#f97316" },
  Transport: { icon: <Train size={20} color="#ef4444" />, bg: "#fee2e2", color: "#ef4444" },
  Shopping: { icon: <ShoppingBag size={20} color="#39baa6" />, bg: "#e6fcf5", color: "#39baa6" },
  Activities: { icon: <Camera size={20} color="#007dfe" />, bg: "#dbeafe", color: "#007dfe" },
};

function getIconConfig(category: string) {
  return CATEGORY_ICONS[category] ?? { icon: <HelpCircle size={20} color="#717786" />, bg: "#ebedf8", color: "#717786" };
}

export default function BudgetScreen() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [durationDays, setDurationDays] = useState(7);
  const [currencyPreference, setCurrencyPreference] = useState("PHP");

  const [budgetInputPhp, setBudgetInputPhp] = useState("");
  const [isBudgetFocused, setIsBudgetFocused] = useState(false);
  const [durationInputText, setDurationInputText] = useState("");
  const [isDurationFocused, setIsDurationFocused] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const trips = await getAllTrips();
        if (trips.length > 0) {
          const activeTrip = trips[0] as Trip;
          setTrip(activeTrip);
          const list = await getExpensesForTrip(activeTrip.id);
          setExpenses(list as unknown as Expense[]);
          if (activeTrip.duration_days) {
            setDurationDays(activeTrip.duration_days);
            setDurationInputText(activeTrip.duration_days.toString());
          } else {
            setDurationInputText("7");
          }
          if (activeTrip.currency_preference) {
            setCurrencyPreference(activeTrip.currency_preference);
          }
          const initialBudgetPhp = activeTrip.budget_hkd * activeTrip.exchange_rate;
          setBudgetInputPhp(Math.round(initialBudgetPhp).toString());
        }
      } catch (err) {
        console.error("Failed to load budget data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const budgetPhp = trip ? trip.budget_hkd * trip.exchange_rate : 0;
  const totalSpent = expenses.reduce((sum, e) => sum + e.php_amount, 0);
  const remainingPhp = budgetPhp - totalSpent;
  const spentPercent = budgetPhp > 0 ? Math.round((totalSpent / budgetPhp) * 100) : 0;

  const dailyLimit = budgetPhp / durationDays;
  const avgDailySpend = totalSpent / durationDays;
  const isUnderBudget = avgDailySpend <= dailyLimit;

  // Currency specific displays
  const currencySymbol = currencyPreference === "HKD" ? "HKD" : "PHP";
  const displayDailyLimit = currencyPreference === "HKD" && trip ? dailyLimit / trip.exchange_rate : dailyLimit;
  const displayAvgDailySpend = currencyPreference === "HKD" && trip ? avgDailySpend / trip.exchange_rate : avgDailySpend;

  // Group spent by category
  const categorySpent: Record<string, number> = {};
  expenses.forEach((e) => {
    categorySpent[e.category] = (categorySpent[e.category] || 0) + e.php_amount;
  });

  const handleSaveChanges = async () => {
    if (!trip) return;
    try {
      setLoading(true);
      const parsedDays = Number(durationInputText) || 7;
      const parsedBudgetPhp = parseFloat(budgetInputPhp.replace(/,/g, '')) || 30000;
      const budgetHkd = parsedBudgetPhp / trip.exchange_rate;
      await updateTripPreferences(trip.id, parsedDays, currencyPreference, budgetHkd);
      setDurationDays(parsedDays);
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to save preferences:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFormattedBudget = () => {
    if (isBudgetFocused) {
      return budgetInputPhp;
    }
    const val = parseFloat(budgetInputPhp.replace(/,/g, ''));
    return isNaN(val) ? "" : val.toLocaleString('en-US');
  };

  const handleBudgetChange = (text: string) => {
    const clean = text.replace(/[^0-9.]/g, '');
    setBudgetInputPhp(clean);
  };

  const handleDurationChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, '');
    setDurationInputText(clean);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.iconButton}>
            <Menu size={22} color="#006b5e" />
          </Pressable>
          <Text style={styles.headerTitle}>{trip?.name ?? "Trip Budget"}</Text>
        </View>
        <Pressable style={styles.iconButton}>
          <Bell size={22} color="#006b5e" />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006b5e" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Skyline Accent / Visual Depth Card */}
          <View style={styles.skylineCard}>
            <View style={styles.skylineOverlay}>
              <View style={styles.skylineHeader}>
                <View>
                  <Text style={styles.skylineLabel}>CURRENT TRIP</Text>
                  <Text style={styles.skylineTitle}>{trip?.name ?? "Hong Kong Trip"}</Text>
                </View>
                <View style={styles.daysBadge}>
                  <Calendar size={12} color="#fff" />
                  <Text style={styles.daysBadgeText}>{durationDays} Days</Text>
                </View>
              </View>
              <View style={styles.skylineFooter}>
                <View>
                  <Text style={styles.skylineLabel}>DAILY STATUS</Text>
                  <Text style={styles.skylineStatusText}>
                    {isUnderBudget ? "Under Budget" : "Over Budget"}
                  </Text>
                </View>
                <ShieldCheck size={32} color="#fff" style={styles.pulseIcon} />
              </View>
            </View>
          </View>

          {/* Budget Summary Card */}
          <BudgetCard
            budgetPhp={budgetPhp}
            spentPhp={totalSpent}
            remainingPhp={remainingPhp}
            spentPercent={spentPercent}
            currency={currencyPreference}
            exchangeRate={trip?.exchange_rate || 6.5}
          />

          {/* Daily Limit Grid */}
          <View style={styles.gridRow}>
            <View style={styles.gridCard}>
              <Text style={styles.gridLabel}>Daily Limit</Text>
              <Text style={styles.gridVal}>{currencySymbol} {Math.round(displayDailyLimit).toLocaleString()}</Text>
            </View>
            <View style={styles.gridCard}>
              <Text style={styles.gridLabel}>Avg. Daily Spend</Text>
              <Text style={[styles.gridVal, { color: "#007dfe" }]}>
                {currencySymbol} {Math.round(displayAvgDailySpend).toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Category Budgets */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Category Budgets</Text>
            <Pressable>
              <Text style={styles.resetBtn}>RESET</Text>
            </Pressable>
          </View>

          <View style={styles.categoriesList}>
            {Object.keys(CATEGORY_LIMIT_PROPORTIONS).map((catKey) => {
              const proportion = CATEGORY_LIMIT_PROPORTIONS[catKey];
              const limit = budgetPhp * proportion;
              const spent = categorySpent[catKey] || 0;
              const percent = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
              const { icon, bg, color } = getIconConfig(catKey);

              const displayLimit = currencyPreference === "HKD" && trip ? limit / trip.exchange_rate : limit;
              const displaySpentCat = currencyPreference === "HKD" && trip ? spent / trip.exchange_rate : spent;

              return (
                <View key={catKey} style={styles.categoryCard}>
                  <View style={[styles.categoryIconBox, { backgroundColor: bg }]}>
                    {icon}
                  </View>
                  <View style={styles.categoryInfo}>
                    <View style={styles.categoryHeader}>
                      <Text style={styles.categoryName}>{catKey}</Text>
                      <Text style={styles.categorySpendText}>
                        {currencySymbol} {Math.round(displaySpentCat).toLocaleString()} / {Math.round(displayLimit).toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.progressBg}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${percent}%` as any, backgroundColor: color || "#39baa6" },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Setup preferences section */}
          <View style={styles.setupCard}>
            <View style={styles.setupHeader}>
              <Settings size={20} color="#39baa6" />
              <Text style={styles.setupTitle}>Setup Preferences</Text>
            </View>

            <View style={styles.setupBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>TOTAL TRIP BUDGET (PHP)</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.inputText}
                    value={getFormattedBudget()}
                    keyboardType="numeric"
                    onChangeText={handleBudgetChange}
                    onFocus={() => setIsBudgetFocused(true)}
                    onBlur={() => setIsBudgetFocused(false)}
                    placeholder="30,000"
                    placeholderTextColor="#a1a1a1"
                  />
                  <Wallet size={18} color="#717786" />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>TRIP DURATION</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.inputText}
                    value={isDurationFocused ? durationInputText : getDurationText(trip?.created_at, Number(durationInputText) || 7)}
                    keyboardType="number-pad"
                    onChangeText={handleDurationChange}
                    onFocus={() => setIsDurationFocused(true)}
                    onBlur={() => setIsDurationFocused(false)}
                    placeholder="7"
                    placeholderTextColor="#a1a1a1"
                  />
                  <Calendar size={18} color="#717786" />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CURRENCY PREFERENCE</Text>
                <Pressable style={styles.inputWrapper} onPress={() => setShowCurrencyDropdown(!showCurrencyDropdown)}>
                  <Text style={styles.dropdownValueText}>
                    {currencyPreference === "HKD" ? "Hong Kong Dollar (HKD)" : "Philippine Peso (PHP)"}
                  </Text>
                  <ChevronDown size={18} color="#717786" />
                </Pressable>
                {showCurrencyDropdown && (
                  <View style={styles.dropdownMenu}>
                    <Pressable
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCurrencyPreference("PHP");
                        setShowCurrencyDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>Philippine Peso (PHP)</Text>
                    </Pressable>
                    <Pressable
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCurrencyPreference("HKD");
                        setShowCurrencyDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>Hong Kong Dollar (HKD)</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>

            <Pressable style={styles.saveBtn} onPress={handleSaveChanges}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}

      {/* Bottom Nav */}
      <BottomNav activeTab="budget" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9ff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(109, 122, 118, 0.1)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0b1c30",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  skylineCard: {
    height: 160,
    borderRadius: 24,
    backgroundColor: "#39baa6",
    overflow: "hidden",
    marginBottom: 20,
  },
  skylineOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  skylineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  skylineLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.7)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  skylineTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginTop: 4,
  },
  daysBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  daysBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  skylineFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  skylineStatusText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginTop: 2,
  },
  pulseIcon: {
    opacity: 0.9,
  },
  gridRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  gridCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(109, 122, 118, 0.1)",
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6d7a76",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  gridVal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0b1c30",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0b1c30",
  },
  resetBtn: {
    fontSize: 12,
    fontWeight: "700",
    color: "#39baa6",
  },
  categoriesList: {
    gap: 12,
    marginBottom: 20,
  },
  categoryCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(109, 122, 118, 0.1)",
    alignItems: "center",
  },
  categoryIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
    gap: 6,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0b1c30",
  },
  categorySpendText: {
    fontSize: 11,
    color: "#6d7a76",
  },
  progressBg: {
    height: 6,
    backgroundColor: "#eff4ff",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  setupCard: {
    backgroundColor: "#eff4ff",
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  setupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  setupTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0b1c30",
  },
  setupBody: {
    gap: 12,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6d7a76",
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    color: "#0b1c30",
    paddingRight: 10,
    paddingVertical: 0,
  },
  dropdownValueText: {
    flex: 1,
    fontSize: 14,
    color: "#0b1c30",
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "rgba(109, 122, 118, 0.15)",
    overflow: "hidden",
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(109, 122, 118, 0.05)",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#0b1c30",
  },
  saveBtn: {
    backgroundColor: "#39baa6",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#39baa6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
});
