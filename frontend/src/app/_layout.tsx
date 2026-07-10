import React, { useEffect } from "react";
import { BackHandler, Platform } from "react-native";
import { Stack, usePathname, useRouter } from "expo-router";
import { ShareIntentProvider, useShareIntentContext } from "expo-share-intent";
import { ThemeProvider } from "../lib/ThemeContext";

function NavigationWrapper() {
  const pathname = usePathname();
  const router = useRouter();
  const { hasShareIntent } = useShareIntentContext();

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

  useEffect(() => {
    if (hasShareIntent && pathname !== "/share") {
      router.push("/share");
    }
  }, [hasShareIntent, pathname]);

  return <Stack />;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ShareIntentProvider>
        <NavigationWrapper />
      </ShareIntentProvider>
    </ThemeProvider>
  );
}
