import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { Cloud, Sun, CloudSun, CloudRain, CloudLightning } from "lucide-react-native";
import { fetchCurrentWeather } from "../api/weather";

function getWeatherIcon(iconId?: number) {
  if (!iconId) return <Cloud size={16} color="#39baa6" />;
  if (iconId === 50 || iconId === 51) return <Sun size={16} color="#f59e0b" />;
  if (iconId === 52) return <CloudSun size={16} color="#39baa6" />;
  if (iconId === 53 || iconId === 54) return <CloudLightning size={16} color="#3b82f6" />;
  if ([62, 63, 64, 65].includes(iconId)) return <CloudRain size={16} color="#39baa6" />;
  return <Cloud size={16} color="#39baa6" />;
}

export default function WelcomeHero() {
  const [temp, setTemp] = useState<string>("--");
  const [iconId, setIconId] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function loadWeather() {
      try {
        const { data } = await fetchCurrentWeather();
        // Find temperature for Hong Kong Observatory
        const obTemp = data.temperature?.data?.find(
          (t: any) => t.place === "Hong Kong Observatory"
        );
        if (obTemp) {
          setTemp(`${obTemp.value}°${obTemp.unit || "C"}`);
        } else if (data.temperature?.data?.[0]) {
          const first = data.temperature.data[0];
          setTemp(`${first.value}°${first.unit || "C"}`);
        }
        if (data.icon && data.icon.length > 0) {
          setIconId(data.icon[0]);
        }
      } catch (err) {
        console.error("Failed to load weather in WelcomeHero:", err);
      }
    }
    loadWeather();
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/afternoon-homepage.png")}
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
          {getWeatherIcon(iconId)}
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherTemp}>{temp}</Text>
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
    width: "100%",
  },
  heroGreeting: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 4,
    textShadowColor: "#39baa6",
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
    alignSelf: "flex-start",
    marginTop: -4,
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
