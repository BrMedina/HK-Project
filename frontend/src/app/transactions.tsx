import { StyleSheet, Text, View, ScrollView, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import { Stack, router } from "expo-router";
import { consumeFromDashboard } from "../lib/navigationFlag";
import { Menu, Bell, Search, Utensils, Train, ShoppingBag, Camera, HelpCircle } from "lucide-react-native";
import { getAllTrips, getExpensesForTrip } from "../db/queries";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";

type Expense = {
  id: string;
  note: string;
  category: string;
  php_amount: number;
  date: number;
  source: string;
};

const CATEGORIES = ["All", "Food", "Transport", "Shopping", "Activities"];

const CATEGORY_ICONS: Record<string, { icon: React.ReactNode; bg: string }> = {
  Food: { icon: <Utensils size={20} color="#f97316" />, bg: "#ffedd5" },
  Transport: { icon: <Train size={20} color="#ef4444" />, bg: "#fee2e2" },
  Shopping: { icon: <ShoppingBag size={20} color="#a855f7" />, bg: "#f3e8ff" },
  Activities: { icon: <Camera size={20} color="#007dfe" />, bg: "#dbeafe" },
};

function getIconConfig(category: string) {
  return CATEGORY_ICONS[category] ?? { icon: <HelpCircle size={20} color="#717786" />, bg: "#ebedf8" };
}

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
}

export default function TransactionsScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    async function loadExpenses() {
      try {
        setLoading(true);
        const trips = await getAllTrips();
        if (trips.length > 0) {
          const list = await getExpensesForTrip(trips[0].id);
          setExpenses(list as unknown as Expense[]);
        }
      } catch (err) {
        console.error("Failed to load expenses:", err);
      } finally {
        setLoading(false);
      }
    }
    loadExpenses();
  }, []);

  useEffect(() => {
    if (consumeFromDashboard()) {
      setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 50);
    }
  }, []);

  // Filter logic
  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      (e.note || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Grouping by Date
  const grouped: Record<string, Expense[]> = {};
  filteredExpenses.forEach((e) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const itemDate = new Date(e.date).toDateString();

    let groupKey = new Date(e.date).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (itemDate === today) {
      groupKey = "Today";
    } else if (itemDate === yesterday) {
      groupKey = "Yesterday";
    }

    if (!grouped[groupKey]) grouped[groupKey] = [];
    grouped[groupKey].push(e);
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      <Header tripName="Transactions" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
      {/* Main Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006b5e" />
        </View>
      ) : (
        <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search size={20} color="#717786" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions..."
              placeholderTextColor="#717786"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Category Filter Row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          >
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Grouped Transaction List */}
          {Object.keys(grouped).length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No transactions found</Text>
            </View>
          ) : (
            Object.keys(grouped).map((groupKey) => (
              <View key={groupKey} style={styles.groupContainer}>
                <Text style={styles.groupHeader}>{groupKey}</Text>
                <View style={styles.cardList}>
                  {grouped[groupKey].map((item, index) => {
                    const { icon, bg } = getIconConfig(item.category);
                    const isLast = index === grouped[groupKey].length - 1;
                    return (
                      <View
                        key={item.id}
                        style={[styles.transactionCard, isLast && styles.transactionCardLast]}
                      >
                        <View style={styles.transLeft}>
                          <View style={[styles.iconContainer, { backgroundColor: bg }]}>
                            {icon}
                          </View>
                          <View style={styles.details}>
                            <Text style={styles.transTitle} numberOfLines={1}>
                              {item.note || item.category}
                            </Text>
                            <Text style={styles.transSub}>
                              {item.category} • {formatTime(item.date)}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.transAmount}>
                          -PHP {item.php_amount.toLocaleString("en-PH")}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
      </KeyboardAvoidingView>

      {/* Bottom Nav */}
      <BottomNav activeTab="transactions" />
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
    fontSize: 24,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff4ff",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#0b1c30",
  },
  filterContainer: {
    gap: 8,
    paddingBottom: 16,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#d3e4fe",
  },
  filterChipActive: {
    backgroundColor: "#006b5e",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3d4946",
  },
  filterChipTextActive: {
    color: "#fff",
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6d7a76",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  cardList: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(109, 122, 118, 0.1)",
  },
  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3fe",
  },
  transactionCardLast: {
    borderBottomWidth: 0,
  },
  transLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  transTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0b1c30",
  },
  transSub: {
    fontSize: 12,
    color: "#6d7a76",
    marginTop: 2,
  },
  transAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0b1c30",
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#6d7a76",
  },
});
