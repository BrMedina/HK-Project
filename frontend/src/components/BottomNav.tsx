import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { LayoutGrid, ClipboardList, Camera, Wallet, Coins } from "lucide-react-native";

export default function BottomNav() {
  return (
    <View style={styles.bottomNav}>
      <Pressable style={styles.navItem}>
        <LayoutGrid size={22} color="#39baa6" />
        <Text style={[styles.navText, { color: "#39baa6", fontWeight: "700" }]}>Dashboard</Text>
      </Pressable>
      <Pressable style={styles.navItem}>
        <ClipboardList size={22} color="#717786" />
        <Text style={styles.navText}>Transactions</Text>
      </Pressable>
      <View style={styles.scanButtonContainer}>
        <Pressable style={styles.scanButton}>
          <Camera size={24} color="#fff" />
        </Pressable>
      </View>
      <Pressable style={styles.navItem}>
        <Wallet size={22} color="#717786" />
        <Text style={styles.navText}>Budget</Text>
      </Pressable>
      <Pressable style={styles.navItem}>
        <Coins size={22} color="#717786" />
        <Text style={styles.navText}>Convert</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "rgba(193, 198, 215, 0.2)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navText: {
    fontSize: 9,
    fontWeight: "500",
    color: "#717786",
    marginTop: 3,
  },
  scanButtonContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    top: -15,
  },
  scanButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#007dfe",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007dfe",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
});
