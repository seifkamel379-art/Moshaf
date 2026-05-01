import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useRef } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const { setUserName, loaded, userName } = useApp();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const scaleAnim = useRef(new Animated.Value(1)).current;

  if (!loaded) return null;

  if (userName) {
    router.replace("/(tabs)/mushaf");
    return null;
  }

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setUserName(trimmed);
    router.replace("/(tabs)/mushaf");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={[colors.background, colors.card, colors.background]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={[styles.inner, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.logoWrapper}>
          <View style={[styles.logoShadow, { shadowColor: colors.primary }]}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={styles.titleBlock}>
          <Text style={[styles.appName, { color: colors.primary }]}>المصحف المثمن</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            برواية ورش عن نافع
          </Text>
        </View>

        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />

        <Text style={[styles.welcomeText, { color: colors.foreground }]}>
          أدخل اسمك لبدء رحلتك
        </Text>

        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: colors.primary,
            },
          ]}
        >
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder="اسمك الكريم..."
            placeholderTextColor={colors.mutedForeground}
            value={name}
            onChangeText={setName}
            textAlign="right"
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            autoFocus
          />
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }], width: "100%" }}>
          <TouchableOpacity
            onPress={handleContinue}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          >
            <LinearGradient
              colors={
                name.trim()
                  ? [colors.accent, colors.primary]
                  : [colors.muted, colors.secondary]
              }
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: name.trim() ? colors.primaryForeground : colors.mutedForeground },
                ]}
              >
                ابدأ القراءة
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Text style={[styles.footer, { color: colors.mutedForeground }]}>
          made by Seif kamel
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 18,
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 4,
  },
  logoShadow: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    borderRadius: 45,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  titleBlock: { alignItems: "center", gap: 4 },
  appName: {
    fontSize: 30,
    fontFamily: "Amiri_700Bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Amiri_400Regular",
    textAlign: "center",
  },
  dividerLine: {
    width: 80,
    height: 1,
    borderRadius: 1,
  },
  welcomeText: {
    fontSize: 17,
    fontFamily: "Cairo_600SemiBold",
    textAlign: "center",
  },
  inputWrapper: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 17,
    fontFamily: "Cairo_400Regular",
  },
  button: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    fontSize: 17,
    fontFamily: "Cairo_700Bold",
  },
  footer: {
    fontSize: 11,
    fontFamily: "Cairo_400Regular",
    textAlign: "center",
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
