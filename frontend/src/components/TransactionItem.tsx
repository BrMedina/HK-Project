import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, Image, Modal, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Train, Utensils, ShoppingBag, Camera, HelpCircle, Trash2, X } from "lucide-react-native";
import { getCategoryColor } from "../lib/categoryColors";
import { useTheme, lightColors, darkColors } from "../lib/ThemeContext";

export type Expense = {
  id: string;
  note: string;
  category: string;
  php_amount: number;
  date: number;
  source: string;
  image_uri?: string | null;
  imageUri?: string | null;
};

type Props = {
  expense: Expense;
  currency?: string;
  exchangeRate?: number;
  showTimeOnly?: boolean;
  onDelete?: (expense: Expense) => void;
  isLast?: boolean;
};

const CATEGORY_ICONS: Record<string, { icon: React.ReactNode; bg: string }> = {
  Food: { icon: <Utensils size={20} color={getCategoryColor("Food").color} />, bg: getCategoryColor("Food").bg },
  Transport: { icon: <Train size={20} color={getCategoryColor("Transport").color} />, bg: getCategoryColor("Transport").bg },
  Shopping: { icon: <ShoppingBag size={20} color={getCategoryColor("Shopping").color} />, bg: getCategoryColor("Shopping").bg },
  Activities: { icon: <Camera size={20} color={getCategoryColor("Activities").color} />, bg: getCategoryColor("Activities").bg },
};

function getIconConfig(category: string) {
  return CATEGORY_ICONS[category] ?? { icon: <HelpCircle size={20} color="#717786" />, bg: "#ebedf8" };
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
}

export default function TransactionItem({
  expense,
  currency = "PHP",
  exchangeRate = 1,
  showTimeOnly = false,
  onDelete,
  isLast = false,
}: Props) {
  const { icon, bg } = getIconConfig(expense.category);
  const displayAmount = currency === "HKD" && exchangeRate > 0 ? expense.php_amount / exchangeRate : expense.php_amount;
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useTheme();
  const colors = theme === "light" ? lightColors : darkColors;

  // Normalize image URI (database returns image_uri, app object might use imageUri)
  const imageUri = expense.image_uri || expense.imageUri;

  return (
    <>
      <View style={[styles.transactionItem, isLast && styles.transactionItemLast, { borderBottomColor: theme === "light" ? "rgba(100, 110, 108, 0.15)" : "rgba(255, 255, 255, 0.1)" }]}>
        <Pressable onPress={() => setModalVisible(true)} style={styles.transMainPressable}>
          <View style={styles.transLeft}>
            <View style={[styles.iconContainer, { backgroundColor: bg }, imageUri && { borderRadius: 8, overflow: "hidden" }]}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.imageThumbnail} resizeMode="cover" />
              ) : (
                icon
              )}
            </View>
            <View style={styles.details}>
              <Text style={[styles.transTitle, { color: colors.text }]} numberOfLines={1}>
                {expense.note || expense.category}
              </Text>
              <Text style={[styles.transSub, { color: theme === "light" ? "#717786" : "#8b94a3" }]}>
                {showTimeOnly
                  ? `${expense.category} • ${formatTime(expense.date)}`
                  : `${formatDate(expense.date)} • ${expense.category}`}
              </Text>
            </View>
          </View>
          <Text style={[styles.transAmount, { color: colors.text }]}>
            -{currency === "HKD" ? "HKD" : "PHP"} {displayAmount.toLocaleString(currency === "HKD" ? "en-US" : "en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </Text>
        </Pressable>
        {onDelete && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Delete ${expense.note || expense.category}`}
            onPress={() => onDelete(expense)}
            style={styles.deleteButton}
          >
            <Trash2 size={16} color="#ef4444" />
          </Pressable>
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalSafeArea} edges={["top", "bottom"]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Expense Details</Text>
              <Pressable style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
                <X size={24} color="#fff" />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.modalCard}>
                {imageUri ? (
                  <View style={styles.modalImageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.modalImage} resizeMode="contain" />
                  </View>
                ) : (
                  <View style={[styles.modalIconContainer, { backgroundColor: bg }]}>
                    {icon}
                  </View>
                )}

                <Text style={styles.modalTitle}>{expense.note || expense.category}</Text>
                <Text style={styles.modalCategory}>{expense.category}</Text>

                <View style={styles.modalDivider} />

                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Amount</Text>
                  <Text style={styles.modalDetailValue}>
                    {currency === "HKD" ? "HKD" : "PHP"} {displayAmount.toLocaleString(currency === "HKD" ? "en-US" : "en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </View>

                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Date</Text>
                  <Text style={styles.modalDetailValue}>{formatDate(expense.date)}</Text>
                </View>

                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Time</Text>
                  <Text style={styles.modalDetailValue}>{formatTime(expense.date)}</Text>
                </View>

                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Source</Text>
                  <Text style={[styles.modalDetailValue, { textTransform: "capitalize" }]}>{expense.source}</Text>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  transactionItemLast: {
    borderBottomWidth: 0,
  },
  transMainPressable: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
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
  },
  imageThumbnail: {
    width: "100%",
    height: "100%",
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  transTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  transSub: {
    fontSize: 10,
    marginTop: 2,
  },
  transAmount: {
    fontSize: 13,
    fontWeight: "700",
    marginRight: 8,
  },
  deleteButton: {
    padding: 6,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(16, 24, 32, 0.95)",
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    alignItems: "center",
  },
  modalImageContainer: {
    width: "100%",
    height: 380,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f8f9ff",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#181c23",
    textAlign: "center",
  },
  modalCategory: {
    fontSize: 12,
    color: "#717786",
    fontWeight: "700",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#f1f3fe",
    width: "100%",
    marginVertical: 20,
  },
  modalDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
  },
  modalDetailLabel: {
    fontSize: 13,
    color: "#717786",
    fontWeight: "600",
  },
  modalDetailValue: {
    fontSize: 14,
    color: "#181c23",
    fontWeight: "700",
  },
});
