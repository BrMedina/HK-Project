import React from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { Bell } from "lucide-react-native";

type Props = {
  tripName?: string;
  showDropdown?: boolean;
};

export default function Header({ tripName = "My Trip", showDropdown = false }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.mainHeader}>
        <Image
          source={require("../../assets/galafund.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Pressable style={styles.tripSelector} disabled={!showDropdown}>
          <Text style={[styles.tripTitle, showDropdown && styles.brandTitle]}>{tripName}</Text>
        </Pressable>
        <Pressable style={styles.notificationButton}>
          <Bell size={22} color="#181c23" />
          <View style={styles.notificationBadge} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3fe",
  },
  mainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
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
  brandTitle: {
    fontFamily: "Poppins",
    color: "#39baa6",
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
});
