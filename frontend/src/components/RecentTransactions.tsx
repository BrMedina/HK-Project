import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Train, Utensils, ShoppingBag, Camera } from "lucide-react-native";

export default function RecentTransactions() {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <Pressable>
          <Text style={styles.seeAllText}>See All</Text>
        </Pressable>
      </View>

      <View style={styles.transactionsList}>
        {/* MTR */}
        <View style={styles.transactionItem}>
          <View style={[styles.transIconContainer, { backgroundColor: "#fee2e2" }]}>
            <Train size={20} color="#ef4444" />
          </View>
          <View style={styles.transDetails}>
            <Text style={styles.transTitle}>MTR Octopus Card Top-up</Text>
            <Text style={styles.transSub}>May 20, 2024 • Transport</Text>
          </View>
          <Text style={styles.transAmount}>-PHP 150</Text>
        </View>

        {/* DimDimSum */}
        <View style={styles.transactionItem}>
          <View style={[styles.transIconContainer, { backgroundColor: "#ffedd5" }]}>
            <Utensils size={20} color="#f97316" />
          </View>
          <View style={styles.transDetails}>
            <Text style={styles.transTitle}>DimDimSum (Tsim Sha Tsui)</Text>
            <Text style={styles.transSub}>May 20, 2024 • Food</Text>
          </View>
          <Text style={styles.transAmount}>-PHP 320</Text>
        </View>

        {/* Miniso */}
        <View style={styles.transactionItem}>
          <View style={[styles.transIconContainer, { backgroundColor: "#f3e8ff" }]}>
            <ShoppingBag size={20} color="#a855f7" />
          </View>
          <View style={styles.transDetails}>
            <Text style={styles.transTitle}>Miniso (Nathan Road)</Text>
            <Text style={styles.transSub}>May 19, 2024 • Shopping</Text>
          </View>
          <Text style={styles.transAmount}>-PHP 450</Text>
        </View>

        {/* The Peak Tram */}
        <View style={styles.transactionItem}>
          <View style={[styles.transIconContainer, { backgroundColor: "#dbeafe" }]}>
            <Camera size={20} color="#007dfe" />
          </View>
          <View style={styles.transDetails}>
            <Text style={styles.transTitle}>The Peak Tram</Text>
            <Text style={styles.transSub}>May 19, 2024 • Activities</Text>
          </View>
          <Text style={styles.transAmount}>-PHP 180</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#181c23",
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#39baa6",
  },
  transactionsList: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(193, 198, 215, 0.2)",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3fe",
  },
  transIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  transDetails: {
    flex: 1,
    marginLeft: 12,
  },
  transTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#181c23",
  },
  transSub: {
    fontSize: 10,
    color: "#717786",
    marginTop: 2,
  },
  transAmount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#181c23",
  },
});
