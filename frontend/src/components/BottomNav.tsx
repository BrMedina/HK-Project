import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { LayoutGrid, ClipboardList, Camera, Wallet, Coins } from "lucide-react-native";
import { router } from "expo-router";

type Props = {
  activeTab?: "dashboard" | "transactions" | "budget" | "convert";
};

export default function BottomNav({ activeTab = "dashboard" }: Props) {
  return (
    <View style={styles.bottomNav}>
      <Pressable style={styles.navItem} onPress={() => activeTab !== "dashboard" && router.replace("/dashboard")}>
        <LayoutGrid size={22} color={activeTab === "dashboard" ? "#39baa6" : "#717786"} />
        <Text
          style={[
            styles.navText,
            activeTab === "dashboard" && { color: "#39baa6", fontWeight: "700" },
          ]}
        >
          Dashboard
        </Text>
      </Pressable>

      <Pressable style={styles.navItem} onPress={() => activeTab !== "transactions" && router.replace("/transactions")}>
        <ClipboardList size={22} color={activeTab === "transactions" ? "#39baa6" : "#717786"} />
        <Text
          style={[
            styles.navText,
            activeTab === "transactions" && { color: "#39baa6", fontWeight: "700" },
          ]}
        >
          Transactions
        </Text>
      </Pressable>

      <View style={styles.scanButtonContainer}>
        <Pressable style={styles.scanButton}>
          <Camera size={24} color="#fff" />
        </Pressable>
      </View>

      <Pressable
        style={styles.navItem}
        onPress={() => activeTab !== "budget" && router.replace("/budget")}
      >
        <Wallet
          size={22}
          color={activeTab === "budget" ? "#39baa6" : "#717786"}
        />
        <Text
          style={[
            styles.navText,
            activeTab === "budget" && { color: "#39baa6", fontWeight: "700" },
          ]}
        >
          Budget
        </Text>
      </Pressable>

      <Pressable style={styles.navItem} onPress={() => activeTab !== "convert" && router.replace("/convert")}>
        <Coins size={22} color={activeTab === "convert" ? "#39baa6" : "#717786"} />
        <Text
          style={[
            styles.navText,
            activeTab === "convert" && { color: "#39baa6", fontWeight: "700" },
          ]}
        >Convert</Text>
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
    height: 78,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "rgba(193, 198, 215, 0.2)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
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
    minWidth: 60,
    paddingVertical: 6,
  },
  navText: {
    fontSize: 9,
    fontWeight: "500",
    color: "#717786",
    marginTop: 3,
  },
  scanButtonContainer: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    top: -12,
    marginHorizontal: 4,
  },
  scanButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
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
