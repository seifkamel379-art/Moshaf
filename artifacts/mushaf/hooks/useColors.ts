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
  const scheme = isDark ? colors.dark : colors.light;
  return { ...scheme, radius: colors.radius };
}
