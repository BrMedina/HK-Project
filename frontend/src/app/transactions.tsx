import { StyleSheet, Text, View, ScrollView, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import { Stack } from "expo-router";
import { consumeFromDashboard } from "../lib/navigationFlag";
import { Search } from "lucide-react-native";
import { deleteExpense, getAllTrips, getExpensesForTrip } from "../db/queries";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import DeleteTransactionDialog from "../components/DeleteTransactionDialog";
import TransactionItem, { Expense } from "../components/TransactionItem";
import { getCategoryColor } from "../lib/categoryColors";

const CATEGORIES = ["All", "Food", "Transport", "Shopping", "Activities"];

export default function TransactionsScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);

  const handleDeleteExpense = (expense: Expense) => setDeleteTarget(expense);

  const confirmDeleteExpense = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteBusy(true);
      await deleteExpense(deleteTarget.id);
      setExpenses((current) => current.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete expense:", err);
    } finally {
      setDeleteBusy(false);
    }
  };

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
                  style={[
                    styles.filterChip,
                    isActive && cat !== "All" && {
                      backgroundColor: `${getCategoryColor(cat).color}15`,
                      borderColor: getCategoryColor(cat).color,
                    },
                    isActive && cat === "All" && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isActive && cat !== "All" && { color: getCategoryColor(cat).color },
                      isActive && cat === "All" && styles.filterChipTextActive,
                    ]}
                  >
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
                  {grouped[groupKey].map((item, index) => (
                    <TransactionItem
                      key={item.id}
                      expense={item}
                      showTimeOnly={true}
                      onDelete={handleDeleteExpense}
                      isLast={index === grouped[groupKey].length - 1}
                    />
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
      </KeyboardAvoidingView>

      <DeleteTransactionDialog
        visible={deleteTarget !== null}
        title="Delete transaction?"
        message={`This will permanently remove ${deleteTarget?.note || deleteTarget?.category || "this item"} from your transaction history.`}
        onCancel={() => {
          if (!deleteBusy) setDeleteTarget(null);
        }}
        onConfirm={confirmDeleteExpense}
        busy={deleteBusy}
      />

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
    borderWidth: 1,
    borderColor: "transparent",
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

  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#6d7a76",
  },
});
