import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const sampleTransactions = [
  { id: 1, title: "MTR top-up", amount: "-₱120", note: "Airport Express" },
  { id: 2, title: "Dim Sum lunch", amount: "-₱480", note: "Tsim Sha Tsui" },
  { id: 3, title: "Cash received", amount: "+₱2,000", note: "From friend" },
];

export default function Index() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Gala Fund</Text>
          <Text style={styles.title}>Quick sample build</Text>
        </View>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>+ Add</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Trip budget left</Text>
        <Text style={styles.amount}>₱14,800</Text>
        <Text style={styles.cardHint}>You have spent 62% of your planned budget.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent activity</Text>
        {sampleTransactions.map((item) => (
          <View key={item.id} style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowNote}>{item.note}</Text>
            </View>
            <Text style={styles.amountText}>{item.amount}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f8ff",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  eyebrow: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardLabel: {
    color: "#6b7280",
    fontSize: 13,
    marginBottom: 6,
  },
  amount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  cardHint: {
    color: "#4b5563",
    fontSize: 13,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  rowNote: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  amountText: {
    fontWeight: "700",
    color: "#111827",
  },
});
