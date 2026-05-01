import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const { setUserName, loaded, userName } = useApp();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");

  if (!loaded) return null;

  if (userName) {
    router.replace("/(tabs)/mushaf");
    return null;
  }

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
      <View style={[styles.inner, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={[styles.appName, { color: colors.primary }]}>المصحف المثمن</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          بسم الله الرحمن الرحيم
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.welcomeText, { color: colors.foreground }]}>
            أهلاً وسهلاً بك
          </Text>
          <Text style={[styles.welcomeSubtext, { color: colors.mutedForeground }]}>
            أدخل اسمك للبدء في رحلتك مع القرآن الكريم
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.foreground,
              },
            ]}
            placeholder="اسمك"
            placeholderTextColor={colors.mutedForeground}
            value={name}
            onChangeText={setName}
            textAlign="right"
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            autoFocus
          />

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: name.trim() ? colors.primary : colors.muted },
            ]}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.buttonText,
                { color: name.trim() ? colors.primaryForeground : colors.mutedForeground },
              ]}
            >
              ابدأ القراءة
            </Text>
          </TouchableOpacity>
        </View>

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
    gap: 16,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: { width: "100%", height: "100%" },
  appName: {
    fontSize: 28,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  card: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  welcomeSubtext: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  footer: {
    fontSize: 11,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    marginTop: 8,
  },
});
