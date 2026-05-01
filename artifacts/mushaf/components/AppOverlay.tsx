import React from "react";
import { View, StyleSheet } from "react-native";
import { useApp } from "@/context/AppContext";

export function AppOverlay({ children }: { children: React.ReactNode }) {
  const { brightness } = useApp();
  const dimAmount = brightness < 1 ? (1 - brightness) * 0.7 : 0;

  return (
    <View style={styles.container}>
      {children}
      {dimAmount > 0 && (
        <View
          style={[
            styles.overlay,
            { backgroundColor: `rgba(0,0,0,${dimAmount})` },
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
