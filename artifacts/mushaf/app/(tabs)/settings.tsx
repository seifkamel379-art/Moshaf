import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { TOTAL_PAGES } from "@/data/surahs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
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

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  colors: ReturnType<typeof useColors>;
  label: string;
  displayValue: string;
}

function SimpleSlider({ value, min, max, step, onChange, colors, label, displayValue }: SliderProps) {
  const steps = Math.round((max - min) / step);
  const currentStep = Math.round((value - min) / step);

  return (
    <View style={sliderStyles.container}>
      <View style={sliderStyles.labelRow}>
        <Text style={[sliderStyles.label, { color: colors.foreground }]}>{label}</Text>
        <Text style={[sliderStyles.value, { color: colors.primary }]}>{displayValue}</Text>
      </View>
      <View style={sliderStyles.track}>
        {Array.from({ length: steps + 1 }, (_, i) => (
          <TouchableOpacity
            key={i}
            style={[
              sliderStyles.dot,
              {
                backgroundColor: i <= currentStep ? colors.primary : colors.border,
                width: i === currentStep ? 16 : 10,
                height: i === currentStep ? 16 : 10,
                borderRadius: 8,
              },
            ]}
            onPress={() => {
              const newVal = min + i * step;
              Haptics.selectionAsync();
              onChange(Math.min(max, Math.max(min, newVal)));
            }}
          />
        ))}
      </View>
      <View style={sliderStyles.minMax}>
        <Text style={[sliderStyles.minMaxText, { color: colors.mutedForeground }]}>{min}</Text>
        <Text style={[sliderStyles.minMaxText, { color: colors.mutedForeground }]}>{max}</Text>
      </View>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  container: { gap: 8 },
  labelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 15, fontFamily: "Inter_500Medium" },
  value: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  track: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  dot: {},
  minMax: { flexDirection: "row", justifyContent: "space-between" },
  minMaxText: { fontSize: 11, fontFamily: "Inter_400Regular" },
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

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const tabBarHeight = Platform.OS === "web" ? 84 : 60;

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
    const ppd = Math.ceil(TOTAL_PAGES / days);
    setKhatmaPlan({
      days,
      pagesPerDay: ppd,
      startDate: new Date().toISOString(),
    });
    setShowKhatmaModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={[styles.sectionHeader, { color: colors.primary }]}>{title}</Text>
  );

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <Text style={[styles.rowLabel, { color: colors.foreground }]}>{label}</Text>
      {children}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, borderBottomColor: colors.border, paddingTop: topPad + 12 },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الخصائص</Text>
        {userName && (
          <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
            أهلاً، {userName}
          </Text>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: tabBarHeight + insets.bottom + 20, gap: 8 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionHeader title="المظهر" />
          <Row label="الوضع الليلي">
            <Switch
              value={isDark}
              onValueChange={(v) => {
                setIsDark(v);
                Haptics.selectionAsync();
              }}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isDark ? colors.primaryForeground : colors.card}
            />
          </Row>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionHeader title="إعدادات العرض" />
          <View style={styles.sliderSection}>
            <SimpleSlider
              label="حجم الخط"
              value={fontSize}
              min={0.8}
              max={1.6}
              step={0.1}
              onChange={setFontSize}
              colors={colors}
              displayValue={`${Math.round(fontSize * 100)}%`}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.sliderSection}>
            <SimpleSlider
              label="الإضاءة"
              value={brightness}
              min={0.3}
              max={1.0}
              step={0.1}
              onChange={setBrightness}
              colors={colors}
              displayValue={`${Math.round(brightness * 100)}%`}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.sliderSection}>
            <SimpleSlider
              label="الشفافية"
              value={opacity}
              min={0.5}
              max={1.0}
              step={0.1}
              onChange={setOpacity}
              colors={colors}
              displayValue={`${Math.round(opacity * 100)}%`}
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionHeader title="خطة الختمة (اختياري)" />
          {khatmaPlan ? (
            <View style={styles.khatmaInfo}>
              <View style={[styles.khatmaBar, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.khatmaProgress,
                    { backgroundColor: colors.primary, width: `${khatmaProgress}%` },
                  ]}
                />
              </View>
              <Text style={[styles.khatmaText, { color: colors.foreground }]}>
                التقدم: {khatmaProgress}% ({khatmaPagesRead} / {TOTAL_PAGES} صفحة)
              </Text>
              <Text style={[styles.khatmaSubtext, { color: colors.mutedForeground }]}>
                {pagesPerDay} صفحة يومياً لإتمام الختمة في {khatmaPlan.days} يوم
              </Text>
              <Text style={[styles.khatmaSubtext, { color: colors.mutedForeground }]}>
                أنت الآن في الصفحة {currentPage}
              </Text>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: colors.destructive }]}
                onPress={() => {
                  Alert.alert("إلغاء الختمة", "هل تريد إلغاء خطة الختمة؟", [
                    { text: "لا", style: "cancel" },
                    { text: "نعم", style: "destructive", onPress: () => setKhatmaPlan(null) },
                  ]);
                }}
              >
                <Text style={[styles.cancelBtnText, { color: colors.destructive }]}>إلغاء الختمة</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.khatmaEmpty}>
              <Text style={[styles.khatmaEmptyText, { color: colors.mutedForeground }]}>
                لم يتم تحديد خطة ختمة بعد
              </Text>
              <TouchableOpacity
                style={[styles.khatmaBtn, { backgroundColor: colors.primary }]}
                onPress={() => setShowKhatmaModal(true)}
                activeOpacity={0.8}
              >
                <Feather name="target" size={16} color={colors.primaryForeground} />
                <Text style={[styles.khatmaBtnText, { color: colors.primaryForeground }]}>
                  حدد خطة ختمة
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionHeader title="عن التطبيق" />
          <View style={styles.aboutSection}>
            <Text style={[styles.aboutText, { color: colors.foreground }]}>المصحف المثمن</Text>
            <Text style={[styles.aboutSub, { color: colors.mutedForeground }]}>
              تطبيق للقرآن الكريم يعمل بالكامل دون إنترنت
            </Text>
            <Text style={[styles.madeBy, { color: colors.mutedForeground }]}>
              made by Seif kamel
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showKhatmaModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowKhatmaModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlayBackground }]}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>خطة الختمة</Text>
            <Text style={[styles.modalSub, { color: colors.mutedForeground }]}>
              كم يوماً تريد لإتمام ختمة القرآن الكريم؟
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground },
              ]}
              placeholder="عدد الأيام (مثال: 30)"
              placeholderTextColor={colors.mutedForeground}
              value={khatmaDays}
              onChangeText={setKhatmaDays}
              keyboardType="number-pad"
              textAlign="center"
            />
            {khatmaDays && !isNaN(parseInt(khatmaDays)) && (
              <Text style={[styles.modalCalc, { color: colors.primary }]}>
                ستقرأ {Math.ceil(TOTAL_PAGES / parseInt(khatmaDays))} صفحة يومياً
              </Text>
            )}
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { borderColor: colors.border }]}
                onPress={() => setShowKhatmaModal(false)}
              >
                <Text style={[styles.modalCancelText, { color: colors.mutedForeground }]}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirmBtn, { backgroundColor: colors.primary }]}
                onPress={handleSetKhatma}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalConfirmText, { color: colors.primaryForeground }]}>تأكيد</Text>
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    textAlign: "right",
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "right",
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    overflow: "hidden",
  },
  sectionHeader: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "right",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  sliderSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
  },
  khatmaInfo: {
    padding: 16,
    gap: 10,
  },
  khatmaBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  khatmaProgress: {
    height: "100%",
    borderRadius: 4,
  },
  khatmaText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    textAlign: "right",
  },
  khatmaSubtext: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "right",
  },
  cancelBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 4,
  },
  cancelBtnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  khatmaEmpty: {
    padding: 16,
    alignItems: "center",
    gap: 12,
  },
  khatmaEmptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  khatmaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  khatmaBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  aboutSection: {
    padding: 16,
    alignItems: "center",
    gap: 6,
  },
  aboutText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  aboutSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  madeBy: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  modalSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  modalCalc: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  modalBtns: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  modalConfirmBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalConfirmText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});
