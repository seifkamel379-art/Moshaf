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
  Switch,
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
  icon,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  colors: ReturnType<typeof useColors>;
  label: string;
  displayValue: string;
  icon: string;
}) {
  const steps = Math.round((max - min) / step);
  const currentStep = Math.round((value - min) / step);
  const pct = currentStep / steps;

  return (
    <View style={gs.container}>
      <View style={gs.topRow}>
        <Text style={[gs.icon]}>{icon}</Text>
        <Text style={[gs.label, { color: colors.foreground }]}>{label}</Text>
        <View style={[gs.pill, { backgroundColor: colors.primary + "20", borderColor: colors.primary + "40" }]}>
          <Text style={[gs.val, { color: colors.primary }]}>{displayValue}</Text>
        </View>
      </View>
      <View style={gs.trackRow}>
        <TouchableOpacity
          style={[gs.stepBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => { onChange(Math.max(min, value - step)); Haptics.selectionAsync(); }}
        >
          <Text style={{ color: colors.primary, fontSize: 16, fontFamily: "Cairo_700Bold" }}>−</Text>
        </TouchableOpacity>
        <View style={[gs.track, { backgroundColor: colors.border }]}>
          <LinearGradient
            colors={[colors.accent, colors.primary]}
            style={[gs.fill, { width: `${pct * 100}%` }]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          />
          <View style={[gs.thumb, { left: `${pct * 100}%`, backgroundColor: colors.primary, borderColor: colors.primaryForeground }]} />
        </View>
        <TouchableOpacity
          style={[gs.stepBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => { onChange(Math.min(max, value + step)); Haptics.selectionAsync(); }}
        >
          <Text style={{ color: colors.primary, fontSize: 16, fontFamily: "Cairo_700Bold" }}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const gs = StyleSheet.create({
  container: { gap: 10, paddingVertical: 2 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  icon: { fontSize: 18 },
  label: { flex: 1, fontFamily: "Cairo_600SemiBold", fontSize: 14 },
  pill: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  val: { fontFamily: "Cairo_700Bold", fontSize: 13 },
  trackRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  track: { flex: 1, height: 6, borderRadius: 3, position: "relative", overflow: "visible" },
  fill: { position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 3 },
  thumb: { position: "absolute", top: -5, width: 16, height: 16, borderRadius: 8, borderWidth: 2, marginLeft: -8 },
});

export default function SettingsScreen() {
  const {
    isDark, setIsDark,
    fontSize, setFontSize,
    brightness, setBrightness,
    opacity, setOpacity,
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
      "إلغاء خطة الختمة",
      "هل أنت متأكد من إلغاء خطة الختمة؟ سيتم حذف كل التقدم.",
      [
        { text: "لا، رجوع", style: "cancel" },
        {
          text: "نعم، إلغاء الختمة",
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
          <Text style={[styles.pageSub, { color: colors.mutedForeground }]}>مرحباً، {userName}</Text>
        )}
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: tabBarH + insets.bottom + 20, gap: 12 }}
        showsVerticalScrollIndicator={false}
      >
        <SectionLabel label="المظهر والألوان" />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={styles.switchIcon}>🌙</Text>
              <Text style={[styles.switchText, { color: colors.foreground }]}>الوضع الليلي</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={(v) => { setIsDark(v); Haptics.selectionAsync(); }}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isDark ? colors.primaryForeground : "#fff"}
              ios_backgroundColor={colors.border}
            />
          </View>
          <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />
          <View style={styles.previewRow}>
            <View style={[styles.colorSwatch, { backgroundColor: "#F5EDD6", borderColor: isDark ? "transparent" : colors.primary, borderWidth: isDark ? 0 : 2 }]}>
              <Text style={styles.swatchLabel}>فاتح</Text>
            </View>
            <View style={[styles.colorSwatch, { backgroundColor: "#1A1208", borderColor: isDark ? colors.primary : "transparent", borderWidth: isDark ? 2 : 0 }]}>
              <Text style={[styles.swatchLabel, { color: "#E8D5A3" }]}>غامق</Text>
            </View>
          </View>
        </View>

        <SectionLabel label="إعدادات العرض" />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <GradientSlider
            label="حجم الخط"
            icon="Aa"
            value={fontSize}
            min={0.8}
            max={1.6}
            step={0.1}
            onChange={setFontSize}
            colors={colors}
            displayValue={`${Math.round(fontSize * 100)}%`}
          />
          <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />
          <GradientSlider
            label="الإضاءة"
            icon="☀️"
            value={brightness}
            min={0.3}
            max={1.0}
            step={0.1}
            onChange={setBrightness}
            colors={colors}
            displayValue={`${Math.round(brightness * 100)}%`}
          />
          <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />
          <GradientSlider
            label="شفافية التطبيق"
            icon="🔆"
            value={opacity}
            min={0.5}
            max={1.0}
            step={0.1}
            onChange={setOpacity}
            colors={colors}
            displayValue={`${Math.round(opacity * 100)}%`}
          />
        </View>

        <SectionLabel label="خطة الختمة" />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {khatmaPlan ? (
            <View style={styles.khatmaSection}>
              <View style={styles.khatmaStats}>
                <View style={[styles.statBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.statNum, { color: colors.primary }]}>{pagesPerDay}</Text>
                  <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>صفحة / يوم</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.statNum, { color: colors.primary }]}>{khatmaPlan.days}</Text>
                  <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>يوم</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.statNum, { color: colors.primary }]}>{khatmaProgress}%</Text>
                  <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>تقدم</Text>
                </View>
              </View>

              <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                <LinearGradient
                  colors={[colors.accent, colors.primary]}
                  style={[styles.progressFill, { width: `${khatmaProgress}%` }]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                />
              </View>

              <Text style={[styles.khatmaDetail, { color: colors.mutedForeground }]}>
                قرأت {khatmaPagesRead} صفحة من {TOTAL_PAGES} • أنت في الصفحة {currentPage}
              </Text>

              <Animated.View style={{ transform: [{ scale: cancelScale }] }}>
                <TouchableOpacity
                  style={[styles.cancelKhatmaBtn, { borderColor: colors.destructive }]}
                  onPress={handleCancelKhatma}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.cancelKhatmaText, { color: colors.destructive }]}>
                    إلغاء خطة الختمة
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          ) : (
            <View style={styles.noKhatma}>
              <Text style={[styles.noKhatmaText, { color: colors.mutedForeground }]}>
                حدد خطة لختم القرآن الكريم في عدد أيام تختاره
              </Text>
              <TouchableOpacity
                style={styles.setKhatmaBtn}
                onPress={() => setShowKhatmaModal(true)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[colors.accent, colors.primary]}
                  style={styles.setKhatmaBtnGrad}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
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
            <Text style={[styles.aboutTitle, { color: colors.foreground }]}>المصحف المثمن</Text>
            <Text style={[styles.aboutSub, { color: colors.mutedForeground }]}>
              برواية ورش عن نافع • الإصدار 1.0
            </Text>
            <Text style={[styles.aboutDesc, { color: colors.mutedForeground }]}>
              تطبيق للقرآن الكريم يعمل بالكامل دون اتصال بالإنترنت
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
        <View style={[styles.modalOverlay, { backgroundColor: "rgba(0,0,0,0.55)" }]}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <LinearGradient
              colors={[colors.accent + "30", "transparent"]}
              style={styles.modalTopGlow}
            />
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>خطة ختمة القرآن</Text>
            <Text style={[styles.modalSub, { color: colors.mutedForeground }]}>
              كم يوماً تريد لإتمام ختمة القرآن الكريم؟
            </Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
              placeholder="عدد الأيام"
              placeholderTextColor={colors.mutedForeground}
              value={khatmaDays}
              onChangeText={setKhatmaDays}
              keyboardType="number-pad"
              textAlign="center"
            />
            {khatmaDays && !isNaN(parseInt(khatmaDays)) && parseInt(khatmaDays) > 0 && (
              <View style={[styles.calcBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[styles.calcText, { color: colors.primary }]}>
                  ستقرأ {Math.ceil(TOTAL_PAGES / parseInt(khatmaDays))} صفحة يومياً
                </Text>
                <Text style={[styles.calcSub, { color: colors.mutedForeground }]}>
                  {TOTAL_PAGES} صفحة ÷ {parseInt(khatmaDays)} يوم
                </Text>
              </View>
            )}
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalCancel, { borderColor: colors.border }]}
                onPress={() => setShowKhatmaModal(false)}
              >
                <Text style={[styles.modalCancelText, { color: colors.mutedForeground }]}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={handleSetKhatma} activeOpacity={0.85}>
                <LinearGradient
                  colors={[colors.accent, colors.primary]}
                  style={styles.modalConfirmGrad}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                >
                  <Text style={[styles.modalConfirmText, { color: colors.primaryForeground }]}>تأكيد الخطة</Text>
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
    fontSize: 13,
    fontFamily: "Cairo_700Bold",
    textAlign: "right",
    letterSpacing: 0.5,
    marginTop: 4,
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
    marginBottom: 4,
  },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  switchIcon: { fontSize: 20 },
  switchText: {
    fontSize: 15,
    fontFamily: "Cairo_600SemiBold",
  },
  previewRow: {
    flexDirection: "row",
    gap: 10,
  },
  colorSwatch: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  swatchLabel: {
    fontFamily: "Cairo_600SemiBold",
    fontSize: 13,
    color: "#8B6914",
  },
  khatmaSection: { gap: 12 },
  khatmaStats: { flexDirection: "row", gap: 8 },
  statBox: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: "center",
    gap: 2,
  },
  statNum: { fontFamily: "Cairo_700Bold", fontSize: 18 },
  statLbl: { fontFamily: "Cairo_400Regular", fontSize: 11 },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  khatmaDetail: {
    fontFamily: "Cairo_400Regular",
    fontSize: 12,
    textAlign: "right",
  },
  cancelKhatmaBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
  },
  cancelKhatmaText: {
    fontFamily: "Cairo_700Bold",
    fontSize: 14,
  },
  noKhatma: { gap: 12, alignItems: "center" },
  noKhatmaText: {
    fontFamily: "Cairo_400Regular",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 22,
  },
  setKhatmaBtn: { width: "100%", borderRadius: 12, overflow: "hidden" },
  setKhatmaBtnGrad: { paddingVertical: 13, alignItems: "center" },
  setKhatmaBtnText: { fontFamily: "Cairo_700Bold", fontSize: 15 },
  aboutSection: { gap: 8, alignItems: "center" },
  aboutTitle: { fontFamily: "Amiri_700Bold", fontSize: 18, textAlign: "center" },
  aboutSub: { fontFamily: "Cairo_600SemiBold", fontSize: 12, textAlign: "center" },
  aboutDesc: { fontFamily: "Cairo_400Regular", fontSize: 12, textAlign: "center", lineHeight: 20 },
  aboutDivider: { width: 60, height: 1, borderRadius: 1, marginVertical: 4 },
  madeBy: { fontFamily: "Cairo_400Regular", fontSize: 11, textAlign: "center", letterSpacing: 0.5 },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
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
