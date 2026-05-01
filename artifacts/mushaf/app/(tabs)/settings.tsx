import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { TOTAL_PAGES } from "@/data/surahs";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useRef } from "react";
import {
  Alert,
  Animated,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function GradientSlider({
  value,
  min,
  max,
  step,
  onChange,
  colors,
  label,
  displayValue,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  colors: ReturnType<typeof useColors>;
  label: string;
  displayValue: string;
}) {
  const steps = Math.round((max - min) / step);
  const currentStep = Math.round((value - min) / step);
  const pct = currentStep / steps;

  return (
    <View style={gs.container}>
      <View style={gs.topRow}>
        <Text style={[gs.label, { color: colors.foreground }]}>{label}</Text>
        <View style={[gs.pill, { backgroundColor: colors.primary + "20", borderColor: colors.primary + "40" }]}>
          <Text style={[gs.val, { color: colors.primary }]}>{displayValue}</Text>
        </View>
      </View>
      <View style={gs.trackRow}>
        <TouchableOpacity
          style={[gs.stepBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => { onChange(Math.max(min, parseFloat((value - step).toFixed(2)))); Haptics.selectionAsync(); }}
        >
          <Text style={[gs.stepText, { color: colors.primary }]}>-</Text>
        </TouchableOpacity>
        <View style={[gs.track, { backgroundColor: colors.border }]}>
          <LinearGradient
            colors={[colors.accent, colors.primary]}
            style={[gs.fill, { width: `${pct * 100}%` }]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          />
          <View
            style={[
              gs.thumb,
              {
                left: `${pct * 100}%`,
                backgroundColor: colors.primary,
                borderColor: colors.primaryForeground,
              },
            ]}
          />
        </View>
        <TouchableOpacity
          style={[gs.stepBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => { onChange(Math.min(max, parseFloat((value + step).toFixed(2)))); Haptics.selectionAsync(); }}
        >
          <Text style={[gs.stepText, { color: colors.primary }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const gs = StyleSheet.create({
  container: { gap: 10 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: { fontFamily: "Cairo_600SemiBold", fontSize: 14, flex: 1 },
  pill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  val: { fontFamily: "Cairo_700Bold", fontSize: 13 },
  trackRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: { fontSize: 20, fontFamily: "Cairo_700Bold", lineHeight: 24 },
  track: {
    flex: 1,
    height: 7,
    borderRadius: 3.5,
    position: "relative",
    overflow: "visible",
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 3.5,
  },
  thumb: {
    position: "absolute",
    top: -5,
    width: 17,
    height: 17,
    borderRadius: 8.5,
    borderWidth: 2,
    marginLeft: -8.5,
  },
});

export default function SettingsScreen() {
  const {
    isDark, setIsDark,
    brightness, setBrightness,
    khatmaPlan, setKhatmaPlan,
    khatmaPagesRead, currentPage,
    userName,
  } = useApp();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [showKhatmaModal, setShowKhatmaModal] = useState(false);
  const [khatmaDays, setKhatmaDays] = useState("30");
  const cancelScale = useRef(new Animated.Value(1)).current;

  const topPad = Platform.OS === "web" ? 24 : insets.top;
  const tabBarH = Platform.OS === "web" ? 84 : 68;

  const pagesPerDay = khatmaPlan ? khatmaPlan.pagesPerDay : 0;
  const khatmaProgress = khatmaPlan
    ? Math.min(100, Math.round((khatmaPagesRead / TOTAL_PAGES) * 100))
    : 0;

  const handleSetKhatma = () => {
    const days = parseInt(khatmaDays, 10);
    if (!days || days < 1 || days > 365) {
      Alert.alert("خطأ", "أدخل عدد أيام بين 1 و 365");
      return;
    }
    setKhatmaPlan({
      days,
      pagesPerDay: Math.ceil(TOTAL_PAGES / days),
      startDate: new Date().toISOString(),
    });
    setShowKhatmaModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleCancelKhatma = () => {
    Animated.sequence([
      Animated.timing(cancelScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(cancelScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    Alert.alert(
      "الغاء خطة الختمة",
      "هل انت متاكد من الغاء الختمة؟ سيتم حذف كل التقدم.",
      [
        { text: "رجوع", style: "cancel" },
        {
          text: "نعم، الغاء",
          style: "destructive",
          onPress: () => {
            setKhatmaPlan(null);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  const SectionLabel = ({ label }: { label: string }) => (
    <Text style={[styles.sectionLabel, { color: colors.primary }]}>{label}</Text>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.card, colors.background]}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>الخصائص</Text>
        {userName && (
          <Text style={[styles.pageSub, { color: colors.mutedForeground }]}>
            مرحبا، {userName}
          </Text>
        )}
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: tabBarH + insets.bottom + 24,
          gap: 10,
        }}
        showsVerticalScrollIndicator={false}
      >
        <SectionLabel label="المظهر" />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.swatchRow}>
            <TouchableOpacity
              style={[
                styles.swatch,
                { backgroundColor: "#F5EDD6", borderColor: !isDark ? "#8B6914" : "transparent" },
                !isDark && { borderWidth: 2.5 },
              ]}
              onPress={() => { setIsDark(false); Haptics.selectionAsync(); }}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 18, marginBottom: 4 }}>☀️</Text>
              <Text style={[styles.swatchLabel, { color: "#7A6440" }]}>فاتح</Text>
              {!isDark && (
                <View style={[styles.swatchCheck, { backgroundColor: "#8B6914" }]}>
                  <Text style={styles.swatchCheckText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.swatch,
                { backgroundColor: "#1A1208", borderColor: isDark ? "#D4A84B" : "transparent" },
                isDark && { borderWidth: 2.5 },
              ]}
              onPress={() => { setIsDark(true); Haptics.selectionAsync(); }}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 18, marginBottom: 4 }}>🌙</Text>
              <Text style={[styles.swatchLabel, { color: "#D4A84B" }]}>غامق</Text>
              {isDark && (
                <View style={[styles.swatchCheck, { backgroundColor: "#D4A84B" }]}>
                  <Text style={styles.swatchCheckText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <SectionLabel label="اعدادات العرض" />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <GradientSlider
            label="الاضاءة"
            value={brightness}
            min={0.3}
            max={1.0}
            step={0.1}
            onChange={setBrightness}
            colors={colors}
            displayValue={`${Math.round(brightness * 100)}%`}
          />
        </View>

        <SectionLabel label="خطة الختمة" />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {khatmaPlan ? (
            <View style={styles.khatmaSection}>
              <View style={styles.khatmaStats}>
                <View
                  style={[styles.statBox, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  <Text style={[styles.statNum, { color: colors.primary }]}>{pagesPerDay}</Text>
                  <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>
                    صفحة / يوم
                  </Text>
                </View>
                <View
                  style={[styles.statBox, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  <Text style={[styles.statNum, { color: colors.primary }]}>{khatmaPlan.days}</Text>
                  <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>يوم</Text>
                </View>
                <View
                  style={[styles.statBox, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  <Text style={[styles.statNum, { color: colors.primary }]}>{khatmaProgress}%</Text>
                  <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>تقدم</Text>
                </View>
              </View>

              <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                <LinearGradient
                  colors={[colors.accent, colors.primary]}
                  style={[styles.progressFill, { width: `${khatmaProgress}%` }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>

              <Text style={[styles.khatmaDetail, { color: colors.mutedForeground }]}>
                قرات {khatmaPagesRead} صفحة من {TOTAL_PAGES} — الصفحة الحالية: {currentPage}
              </Text>

              <Animated.View style={{ transform: [{ scale: cancelScale }] }}>
                <TouchableOpacity
                  style={[styles.cancelKhatmaBtn, { borderColor: colors.destructive }]}
                  onPress={handleCancelKhatma}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.cancelKhatmaText, { color: colors.destructive }]}>
                    الغاء خطة الختمة
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          ) : (
            <View style={styles.noKhatma}>
              <Text style={[styles.noKhatmaText, { color: colors.mutedForeground }]}>
                حدد عدد الايام وسيحسب التطبيق كم صفحة تقرا يوميا
              </Text>
              <TouchableOpacity
                style={styles.setKhatmaBtn}
                onPress={() => setShowKhatmaModal(true)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[colors.accent, colors.primary]}
                  style={styles.setKhatmaBtnGrad}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={[styles.setKhatmaBtnText, { color: colors.primaryForeground }]}>
                    تحديد خطة الختمة
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <SectionLabel label="عن التطبيق" />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.aboutSection}>
            <Text style={[styles.aboutTitle, { color: colors.foreground }]}>
              المصحف المثمن
            </Text>
            <Text style={[styles.aboutSub, { color: colors.mutedForeground }]}>
              برواية ورش عن نافع — الاصدار 1.0
            </Text>
            <Text style={[styles.aboutDesc, { color: colors.mutedForeground }]}>
              تطبيق للقران الكريم يعمل بالكامل دون اتصال بالانترنت
            </Text>
            <View style={[styles.aboutDivider, { backgroundColor: colors.border }]} />
            <Text style={[styles.madeBy, { color: colors.mutedForeground }]}>
              made by Seif kamel
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showKhatmaModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowKhatmaModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <LinearGradient
              colors={[colors.accent + "30", "transparent"]}
              style={styles.modalTopGlow}
            />
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              خطة ختمة القران
            </Text>
            <Text style={[styles.modalSub, { color: colors.mutedForeground }]}>
              كم يوما تريد لاتمام ختمة القران الكريم؟
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.foreground,
                },
              ]}
              placeholder="عدد الايام"
              placeholderTextColor={colors.mutedForeground}
              value={khatmaDays}
              onChangeText={setKhatmaDays}
              keyboardType="number-pad"
              textAlign="center"
            />
            {khatmaDays &&
              !isNaN(parseInt(khatmaDays)) &&
              parseInt(khatmaDays) > 0 && (
                <View
                  style={[
                    styles.calcBox,
                    { backgroundColor: colors.background, borderColor: colors.border },
                  ]}
                >
                  <Text style={[styles.calcText, { color: colors.primary }]}>
                    ستقرا {Math.ceil(TOTAL_PAGES / parseInt(khatmaDays))} صفحة يوميا
                  </Text>
                  <Text style={[styles.calcSub, { color: colors.mutedForeground }]}>
                    {TOTAL_PAGES} صفحة على {parseInt(khatmaDays)} يوم
                  </Text>
                </View>
              )}
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalCancel, { borderColor: colors.border }]}
                onPress={() => setShowKhatmaModal(false)}
              >
                <Text style={[styles.modalCancelText, { color: colors.mutedForeground }]}>
                  الغاء
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={handleSetKhatma}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[colors.accent, colors.primary]}
                  style={styles.modalConfirmGrad}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={[styles.modalConfirmText, { color: colors.primaryForeground }]}>
                    تاكيد الخطة
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 4,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: "Amiri_700Bold",
    textAlign: "right",
  },
  pageSub: {
    fontSize: 14,
    fontFamily: "Cairo_400Regular",
    textAlign: "right",
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: "Cairo_700Bold",
    textAlign: "right",
    letterSpacing: 0.8,
    marginTop: 6,
    textTransform: "uppercase",
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardDivider: { height: StyleSheet.hairlineWidth },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchText: { fontSize: 15, fontFamily: "Cairo_600SemiBold" },
  swatchRow: { flexDirection: "row", gap: 10 },
  swatch: {
    flex: 1,
    height: 80,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    position: "relative",
    overflow: "hidden",
  },
  swatchLabel: {
    fontFamily: "Cairo_700Bold",
    fontSize: 13,
  },
  swatchCheck: {
    position: "absolute",
    top: 6,
    left: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  swatchCheckText: {
    fontSize: 11,
    color: "#fff",
    fontFamily: "Cairo_700Bold",
  },
  khatmaSection: { gap: 14 },
  khatmaStats: { flexDirection: "row", gap: 8 },
  statBox: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: "center",
    gap: 3,
  },
  statNum: { fontFamily: "Cairo_700Bold", fontSize: 20 },
  statLbl: { fontFamily: "Cairo_400Regular", fontSize: 11 },
  progressTrack: { height: 10, borderRadius: 5, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 5 },
  khatmaDetail: {
    fontFamily: "Cairo_400Regular",
    fontSize: 12,
    textAlign: "right",
  },
  cancelKhatmaBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelKhatmaText: { fontFamily: "Cairo_700Bold", fontSize: 14 },
  noKhatma: { gap: 12, alignItems: "center" },
  noKhatmaText: {
    fontFamily: "Cairo_400Regular",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 22,
  },
  setKhatmaBtn: { width: "100%", borderRadius: 12, overflow: "hidden" },
  setKhatmaBtnGrad: { paddingVertical: 14, alignItems: "center" },
  setKhatmaBtnText: { fontFamily: "Cairo_700Bold", fontSize: 15 },
  aboutSection: { gap: 8, alignItems: "center" },
  aboutTitle: { fontFamily: "Amiri_700Bold", fontSize: 18, textAlign: "center" },
  aboutSub: { fontFamily: "Cairo_600SemiBold", fontSize: 12, textAlign: "center" },
  aboutDesc: {
    fontFamily: "Cairo_400Regular",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 20,
  },
  aboutDivider: { width: 60, height: 1, borderRadius: 1, marginVertical: 4 },
  madeBy: {
    fontFamily: "Cairo_400Regular",
    fontSize: 11,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 24,
    gap: 14,
    overflow: "hidden",
  },
  modalTopGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  modalTitle: { fontSize: 20, fontFamily: "Amiri_700Bold", textAlign: "center" },
  modalSub: { fontSize: 13, fontFamily: "Cairo_400Regular", textAlign: "center" },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 22,
    fontFamily: "Cairo_700Bold",
  },
  calcBox: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    gap: 4,
  },
  calcText: { fontFamily: "Cairo_700Bold", fontSize: 15 },
  calcSub: { fontFamily: "Cairo_400Regular", fontSize: 12 },
  modalBtns: { flexDirection: "row", gap: 10 },
  modalCancel: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  modalCancelText: { fontFamily: "Cairo_600SemiBold", fontSize: 14 },
  modalConfirm: { flex: 1, borderRadius: 12, overflow: "hidden" },
  modalConfirmGrad: { paddingVertical: 13, alignItems: "center" },
  modalConfirmText: { fontFamily: "Cairo_700Bold", fontSize: 14 },
});
