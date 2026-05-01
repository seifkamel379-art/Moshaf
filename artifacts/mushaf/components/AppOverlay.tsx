import React from "react";
import { View, StyleSheet } from "react-native";
import { useApp } from "@/context/AppContext";

export function AppOverlay({ children }: { children: React.ReactNode }) {
  const { opacity } = useApp();

  return (
    <View style={styles.container}>
      {children}
      {opacity < 1 && (
        <View
          style={[
            styles.overlay,
            { backgroundColor: `rgba(0,0,0,${(1 - opacity) * 0.45})` },
          ]}
          pointerEvents="none"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
