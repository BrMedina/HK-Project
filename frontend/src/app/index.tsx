import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { Redirect, router, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "gala_onboarded";

export default function Index() {
  const [checked, setChecked] = useState(false);
  const [firstTime, setFirstTime] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
      setFirstTime(val === null);
      setChecked(true);
    });
  }, []);

  if (!checked) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#006b5e" />
      </View>
    );
  }

  if (!firstTime) {
    return <Redirect href="/dashboard" />;
  }

  const handleGetStarted = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    router.replace("/dashboard");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.center}>
        <Image
          source={require("../../assets/splash-icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.footer}>
        <Pressable style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    alignItems: "center",
  },
  logo: {
    width: 220,
    height: 220,
  },
  button: {
    backgroundColor: "#39baa6",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
