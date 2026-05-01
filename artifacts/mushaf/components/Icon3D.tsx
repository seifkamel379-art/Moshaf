import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Path, Circle, Rect, G, Ellipse } from "react-native-svg";

interface Icon3DProps {
  name: "book" | "list" | "sliders";
  color: string;
  size?: number;
  active?: boolean;
}

export function Icon3D({ name, color, size = 26, active = false }: Icon3DProps) {
  if (name === "book") {
    return (
      <Svg width={size} height={size} viewBox="0 0 32 32">
        <Defs>
          <LinearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={active ? "#D4A84B" : "#C8A870"} />
            <Stop offset="1" stopColor={active ? "#8B6914" : "#7A5E30"} />
          </LinearGradient>
          <LinearGradient id="pageGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFFDF5" />
            <Stop offset="1" stopColor="#E8D5A3" />
          </LinearGradient>
          <LinearGradient id="spineGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={active ? "#E8B84B" : "#A08040"} />
            <Stop offset="1" stopColor={active ? "#B8861A" : "#6A4E20"} />
          </LinearGradient>
        </Defs>
        <Path d="M5 5 Q5 4 6 4 L15 4 L15 26 L6 26 Q5 26 5 25 Z" fill="url(#bookGrad)" />
        <Path d="M5 5 Q5 4 6 4 L7 4 L7 26 L6 26 Q5 26 5 25 Z" fill="url(#spineGrad)" />
        <Path d="M15 4 L26 4 Q27 4 27 5 L27 25 Q27 26 26 26 L15 26 Z" fill="url(#pageGrad)" />
        <Path d="M18 8 L25 8" stroke={active ? "#8B6914" : "#A08040"} strokeWidth="1" strokeLinecap="round" />
        <Path d="M18 11 L25 11" stroke={active ? "#8B6914" : "#A08040"} strokeWidth="1" strokeLinecap="round" />
        <Path d="M18 14 L25 14" stroke={active ? "#8B6914" : "#A08040"} strokeWidth="1" strokeLinecap="round" />
        <Path d="M18 17 L23 17" stroke={active ? "#8B6914" : "#A08040"} strokeWidth="1" strokeLinecap="round" />
        <Path d="M15 4 L15 26" stroke={active ? "#8B6914" : "#A08040"} strokeWidth="0.5" />
        {active && <Path d="M21 4 L21 26" stroke="rgba(212,168,75,0.2)" strokeWidth="0.5" />}
      </Svg>
    );
  }

  if (name === "list") {
    return (
      <Svg width={size} height={size} viewBox="0 0 32 32">
        <Defs>
          <LinearGradient id="listGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={active ? "#D4A84B" : "#C8A870"} />
            <Stop offset="1" stopColor={active ? "#8B6914" : "#7A5E30"} />
          </LinearGradient>
          <LinearGradient id="rowGrad1" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={active ? "rgba(212,168,75,0.3)" : "rgba(200,168,112,0.2)"} />
            <Stop offset="1" stopColor="transparent" />
          </LinearGradient>
        </Defs>
        <Rect x="4" y="5" width="24" height="3" rx="1.5" fill="url(#listGrad)" />
        <Rect x="4" y="11" width="24" height="3" rx="1.5" fill="url(#listGrad)" opacity="0.85" />
        <Rect x="4" y="17" width="24" height="3" rx="1.5" fill="url(#listGrad)" opacity="0.7" />
        <Rect x="4" y="23" width="16" height="3" rx="1.5" fill="url(#listGrad)" opacity="0.55" />
        <Circle cx="2" cy="6.5" r="1.5" fill={active ? "#D4A84B" : "#A08040"} />
        <Circle cx="2" cy="12.5" r="1.5" fill={active ? "#D4A84B" : "#A08040"} />
        <Circle cx="2" cy="18.5" r="1.5" fill={active ? "#D4A84B" : "#A08040"} />
        <Circle cx="2" cy="24.5" r="1.5" fill={active ? "#D4A84B" : "#A08040"} opacity="0.6" />
      </Svg>
    );
  }

  if (name === "sliders") {
    return (
      <Svg width={size} height={size} viewBox="0 0 32 32">
        <Defs>
          <LinearGradient id="sliderGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={active ? "#D4A84B" : "#C8A870"} />
            <Stop offset="1" stopColor={active ? "#8B6914" : "#7A5E30"} />
          </LinearGradient>
          <LinearGradient id="knobGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFDF5" />
            <Stop offset="1" stopColor="#C8A870" />
          </LinearGradient>
        </Defs>
        <Rect x="5" y="7" width="22" height="2.5" rx="1.25" fill="url(#sliderGrad)" opacity="0.5" />
        <Rect x="5" y="15" width="22" height="2.5" rx="1.25" fill="url(#sliderGrad)" opacity="0.5" />
        <Rect x="5" y="23" width="22" height="2.5" rx="1.25" fill="url(#sliderGrad)" opacity="0.5" />
        <Circle cx="10" cy="8.25" r="4" fill="url(#sliderGrad)" />
        <Circle cx="10" cy="8.25" r="2.5" fill="url(#knobGrad)" />
        <Circle cx="20" cy="16.25" r="4" fill="url(#sliderGrad)" />
        <Circle cx="20" cy="16.25" r="2.5" fill="url(#knobGrad)" />
        <Circle cx="14" cy="24.25" r="4" fill="url(#sliderGrad)" />
        <Circle cx="14" cy="24.25" r="2.5" fill="url(#knobGrad)" />
      </Svg>
    );
  }

  return null;
}
