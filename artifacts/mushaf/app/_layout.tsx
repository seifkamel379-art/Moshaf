import { Amiri_400Regular, Amiri_700Bold, useFonts as useAmiri } from "@expo-google-fonts/amiri";
import { Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold, useFonts as useCairo } from "@expo-google-fonts/cairo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Image, StyleSheet, Text, Animated } from "react-native";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider } from "@/context/AppContext";
import { AppOverlay } from "@/components/AppOverlay";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function CustomSplash({ onFinish }: { onFinish: () => void }) {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }),
      ]),
      Animated.delay(1200),
      Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start(() => onFinish());
  }, []);

  return (
    <View style={splashStyles.container}>
      <Animated.View style={[splashStyles.inner, { opacity, transform: [{ scale }] }]}>
        <Image source={require("@/assets/images/logo_nobg.png")} style={splashStyles.logo} resizeMode="contain" />
        <Text style={splashStyles.title}>المصحف المثمن</Text>
        <Text style={splashStyles.sub}>بسم الله الرحمن الرحيم</Text>
      </Animated.View>
      <Text style={splashStyles.made}>made by Seif kamel</Text>
    </View>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0E6C8",
    alignItems: "center",
    justifyContent: "center",
  },
  inner: { alignItems: "center", gap: 14 },
  logo: { width: 160, height: 160 },
  title: {
    fontSize: 28,
    fontFamily: "Amiri_700Bold",
    color: "#8B6914",
    textAlign: "center",
  },
  sub: {
    fontSize: 16,
    fontFamily: "Amiri_400Regular",
    color: "#7A6440",
    textAlign: "center",
  },
  made: {
    position: "absolute",
    bottom: 36,
    fontSize: 11,
    color: "#A08040",
    fontFamily: "Cairo_400Regular",
  },
});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [cairoLoaded] = useCairo({ Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold });
  const [amiriLoaded] = useAmiri({ Amiri_400Regular, Amiri_700Bold });
  const [showSplash, setShowSplash] = useState(true);

  const fontsLoaded = cairoLoaded && amiriLoaded;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  if (showSplash) {
    return <CustomSplash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <AppOverlay>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <KeyboardProvider>
                  <RootLayoutNav />
                </KeyboardProvider>
              </GestureHandlerRootView>
            </AppOverlay>
          </AppProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
