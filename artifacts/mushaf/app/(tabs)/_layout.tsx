import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { Icon3D } from "@/components/Icon3D";

export default function TabLayout() {
  const colors = useColors();
  const { isDark, mushafFullScreen } = useApp();
  const isIOS = Platform.OS === "ios";

  const globalTabBarStyle = {
    position: "absolute" as const,
    backgroundColor: isIOS ? "transparent" : colors.tabBar,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    elevation: 12,
    height: Platform.OS === "web" ? 84 : 68,
    paddingBottom: Platform.OS === "web" ? 24 : 10,
    paddingTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: globalTabBarStyle,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Cairo_600SemiBold",
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={95}
              tint={isDark ? "systemChromeMaterialDark" : "systemChromeMaterial"}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.tabBar }]} />
          ),
      }}
    >
      <Tabs.Screen
        name="mushaf"
        options={{
          title: "المصحف",
          tabBarStyle: mushafFullScreen ? { display: "none" } : globalTabBarStyle,
          tabBarIcon: ({ color, focused }) => (
            <Icon3D name="book" color={color} size={26} active={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "الفهرس",
          tabBarIcon: ({ color, focused }) => (
            <Icon3D name="list" color={color} size={26} active={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "الخصائص",
          tabBarIcon: ({ color, focused }) => (
            <Icon3D name="sliders" color={color} size={26} active={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
