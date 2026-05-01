import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Circle,
  Rect,
  G,
  Polygon,
} from "react-native-svg";

interface Icon3DProps {
  name: "book" | "list" | "sliders";
  color: string;
  size?: number;
  active?: boolean;
}

export function Icon3D({ name, color, size = 26, active = false }: Icon3DProps) {
  const g1 = active ? "#E8B84B" : "#B89050";
  const g2 = active ? "#9A6E10" : "#7A5228";
  const pageFill = active ? "#FFFCF0" : "#F5EDD6";

  if (name === "book") {
    return (
      <Svg width={size} height={size} viewBox="0 0 32 32">
        <Defs>
          <LinearGradient id="bk_cover" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={g1} />
            <Stop offset="1" stopColor={g2} />
          </LinearGradient>
          <LinearGradient id="bk_page" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFFDF5" />
            <Stop offset="1" stopColor="#E8D5A3" />
          </LinearGradient>
          <LinearGradient id="bk_spine" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={g1} />
            <Stop offset="1" stopColor={g2} />
          </LinearGradient>
        </Defs>

        {/* Left cover */}
        <Path
          d="M3 5 Q3 4 4.5 4 L14.5 4 Q15 4.5 15 5.5 L15 27 Q15 27.5 14.5 27.5 L4.5 27.5 Q3 27.5 3 26.5 Z"
          fill="url(#bk_cover)"
        />
        {/* Right pages */}
        <Path
          d="M17 4 L27.5 4 Q29 4 29 5.5 L29 26.5 Q29 27.5 27.5 27.5 L17 27.5 Z"
          fill="url(#bk_page)"
        />
        {/* Right page lines */}
        <Path d="M19.5 8 L27 8" stroke={g2} strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
        <Path d="M19.5 11 L27 11" stroke={g2} strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
        <Path d="M19.5 14 L27 14" stroke={g2} strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
        <Path d="M19.5 17 L24 17" stroke={g2} strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />
        {/* Spine */}
        <Rect x="14.5" y="4" width="2.5" height="23.5" fill="url(#bk_spine)" />
        {/* Left cover decorative lines */}
        <Path d="M6 9 L12 9" stroke="#FFFDF5" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
        <Path d="M6 12 L12 12" stroke="#FFFDF5" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
      </Svg>
    );
  }

  if (name === "list") {
    return (
      <Svg width={size} height={size} viewBox="0 0 32 32">
        <Defs>
          <LinearGradient id="ls_line" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={g1} />
            <Stop offset="1" stopColor={g2} />
          </LinearGradient>
          <LinearGradient id="ls_dot" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={g1} />
            <Stop offset="1" stopColor={g2} />
          </LinearGradient>
        </Defs>
        {/* Row 1 */}
        <Rect x="8" y="5.5" width="18" height="3" rx="1.5" fill="url(#ls_line)" />
        <Circle cx="4.5" cy="7" r="2" fill="url(#ls_dot)" />
        {/* Row 2 */}
        <Rect x="8" y="12" width="18" height="3" rx="1.5" fill="url(#ls_line)" opacity="0.85" />
        <Circle cx="4.5" cy="13.5" r="2" fill="url(#ls_dot)" opacity="0.85" />
        {/* Row 3 */}
        <Rect x="8" y="18.5" width="14" height="3" rx="1.5" fill="url(#ls_line)" opacity="0.7" />
        <Circle cx="4.5" cy="20" r="2" fill="url(#ls_dot)" opacity="0.7" />
        {/* Row 4 */}
        <Rect x="8" y="25" width="10" height="3" rx="1.5" fill="url(#ls_line)" opacity="0.45" />
        <Circle cx="4.5" cy="26.5" r="2" fill="url(#ls_dot)" opacity="0.45" />
      </Svg>
    );
  }

  if (name === "sliders") {
    return (
      <Svg width={size} height={size} viewBox="0 0 32 32">
        <Defs>
          <LinearGradient id="gr_gear" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={g1} />
            <Stop offset="1" stopColor={g2} />
          </LinearGradient>
          <LinearGradient id="gr_hole" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={active ? "#F5E8CC" : "#E8D5A3"} />
            <Stop offset="1" stopColor={active ? "#ECD890" : "#C8A870"} />
          </LinearGradient>
        </Defs>
        {/* Gear body: 8-tooth polygon */}
        <Polygon
          points="16,3.5 19.25,8.15 24.84,7.16 23.85,12.75 28.5,16 23.85,19.25 24.84,24.84 19.25,23.85 16,28.5 12.75,23.85 7.16,24.84 8.15,19.25 3.5,16 8.15,12.75 7.16,7.16 12.75,8.15"
          fill="url(#gr_gear)"
        />
        {/* Center circle */}
        <Circle cx="16" cy="16" r="5.5" fill="url(#gr_hole)" />
        {/* Center hole */}
        <Circle cx="16" cy="16" r="2.5" fill={active ? g2 : g2} opacity="0.4" />
      </Svg>
    );
  }

  return null;
}
