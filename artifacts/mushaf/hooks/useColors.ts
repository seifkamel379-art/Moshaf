import { useApp } from "@/context/AppContext";
import colors from "@/constants/colors";

type ColorScheme = typeof colors.light;

export function useColors(): ColorScheme & { radius: number } {
  let isDark = false;
  try {
    const app = useApp();
    isDark = app.isDark;
  } catch {
    isDark = false;
  }
  const darkColors = "dark" in colors ? (colors as typeof colors & { dark: typeof colors.light }).dark : colors.light;
  const scheme = isDark ? darkColors : colors.light;
  return { ...scheme, radius: colors.radius };
}
