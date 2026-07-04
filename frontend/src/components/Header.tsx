import React from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { ChevronDown, Bell, ArrowRight, Plane } from "lucide-react-native";

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.mainHeader}>
        <Image
          source={require("../../assets/galafund.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Pressable style={styles.tripSelector}>
          <Text style={styles.tripTitle}>Hong Kong Trip</Text>
          <ChevronDown size={18} color="#181c23" strokeWidth={2.5} />
        </Pressable>
        <Pressable style={styles.notificationButton}>
          <Bell size={22} color="#181c23" />
          <View style={styles.notificationBadge} />
        </Pressable>
      </View>

      <View style={styles.routeHeader}>
        <Text style={styles.routeText}>From Philippines 🇵🇭</Text>
        <ArrowRight size={12} color="#c1c6d7" />
        <Plane size={14} color="#c1c6d7" />
        <ArrowRight size={12} color="#c1c6d7" />
        <Text style={styles.routeText}>Hong Kong 🇭🇰</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  mainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  logo: {
    width: 24,
    height: 24,
  },
  tripSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#181c23",
  },
  notificationButton: {
    padding: 4,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  routeHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3fe",
  },
  routeText: {
    fontSize: 12,
    color: "#414754",
    fontWeight: "500",
  },
});
