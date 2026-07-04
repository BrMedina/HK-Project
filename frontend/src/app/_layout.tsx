import React, { useEffect } from "react";
import { BackHandler, Platform } from "react-native";
import { Stack, usePathname, useRouter } from "expo-router";

export default function RootLayout() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const onHardwareBackPress = () => {
      if (pathname === "/dashboard") {
        return false;
      }

      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/dashboard");
      }

      return true;
    };

    const subscription = BackHandler.addEventListener("hardwareBackPress", onHardwareBackPress);
    return () => subscription.remove();
  }, [pathname, router]);

  return <Stack />;
}
