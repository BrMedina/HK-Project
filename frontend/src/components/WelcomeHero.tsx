import React from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { Cloud } from "lucide-react-native";

export default function WelcomeHero() {
  return (
    <ImageBackground
      source={require("../../assets/homepage.png")}
      style={styles.heroBackground}
      imageStyle={styles.heroImage}
    >
      <View style={styles.heroOverlay}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroGreeting}>Kumusta! 👋</Text>
          <Text style={styles.heroText}>
            Enjoy your trip and track your spending in Hong Kong.
          </Text>
        </View>
        <View style={styles.weatherChip}>
          <Cloud size={16} color="#39baa6" />
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherTemp}>28°C</Text>
            <Text style={styles.weatherLoc}>Hong Kong</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  heroBackground: {
    height: 160,
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 20,
  },
  heroImage: {
    borderRadius: 24,
    opacity: 0.9,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  heroLeft: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
  },
  heroGreeting: {
    fontSize: 24,
    fontWeight: "800",
    color: "#39baa6",
    marginBottom: 4,
    textShadowColor: "rgba(255,255,255,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroText: {
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "600",
    maxWidth: 180,
    lineHeight: 18,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  weatherChip: {
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  weatherInfo: {
    flexDirection: "column",
  },
  weatherTemp: {
    fontSize: 13,
    fontWeight: "700",
    color: "#181c23",
  },
  weatherLoc: {
    fontSize: 9,
    color: "#414754",
    fontWeight: "500",
  },
});
