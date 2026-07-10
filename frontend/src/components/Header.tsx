import React, { useRef, useEffect } from "react";
import { StyleSheet, Text, View, Image, Pressable, Animated } from "react-native";
import { Moon, Sun } from "lucide-react-native";
import { useTheme, lightColors, darkColors } from "../lib/ThemeContext";

type Props = {
  tripName?: string;
  showDropdown?: boolean;
};

export default function Header({ tripName = "My Trip", showDropdown = false }: Props) {
  const { theme, toggleTheme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colors = theme === "light" ? lightColors : darkColors;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [theme]);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, borderBottomColor: colors.borderBottom }]}>
      <View style={styles.mainHeader}>
        <Image
          source={require("../../assets/galafund.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Pressable style={styles.tripSelector} disabled={!showDropdown}>
          <Text style={[styles.tripTitle, showDropdown && styles.brandTitle, { color: colors.text }]}>{tripName}</Text>
        </Pressable>
        <Pressable style={styles.themeButton} onPress={toggleTheme}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            {theme === "light" ? (
              <Moon size={22} color={colors.icon} />
            ) : (
              <Sun size={22} color={colors.icon} />
            )}
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
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
  },
  brandTitle: {
    fontFamily: "Poppins",
    color: "#39baa6",
  },
  themeButton: {
    padding: 4,
  },
});
