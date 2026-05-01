import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { getHizbForPage, getJuzForPage, getSurahsForPage, TOTAL_PAGES } from "@/data/surahs";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SW, height: SH } = Dimensions.get("window");

function BookmarkFlag({ colors }: { colors: ReturnType<typeof useColors> }) {
  return (
    <View style={[flagStyles.flag, { backgroundColor: colors.primary }]}>
      <View style={flagStyles.triangle} />
      <View style={[flagStyles.body, { backgroundColor: colors.primary }]}>
        <View style={[flagStyles.ribbon, { backgroundColor: colors.accent }]} />
      </View>
    </View>
  );
}

const flagStyles = StyleSheet.create({
  flag: {
    position: "absolute",
    top: 0,
    right: 20,
    width: 24,
    zIndex: 20,
    alignItems: "center",
  },
  body: {
    width: 24,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  triangle: {
    position: "absolute",
    bottom: -8,
    left: 0,
    right: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 9,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#8B6914",
  },
  ribbon: {
    width: 12,
    height: 2,
    borderRadius: 1,
  },
});

function MushafPage({
  pageNumber,
  isDark,
  colors,
  onDoublePress,
  isBookmarked,
}: {
  pageNumber: number;
  isDark: boolean;
  colors: ReturnType<typeof useColors>;
  onDoublePress: (page: number) => void;
  isBookmarked: boolean;
}) {
  const lastTap = useRef(0);

  const handlePress = () => {
    const now = Date.now();
    if (now - lastTap.current < 380) {
      onDoublePress(pageNumber);
    }
    lastTap.current = now;
  };

  const surahsOnPage = getSurahsForPage(pageNumber);
  const juz = getJuzForPage(pageNumber);
  const hizb = getHizbForPage(pageNumber);

  const bgStart = isDark ? "#1E1508" : "#F7EFDA";
  const bgEnd = isDark ? "#150F04" : "#EFE4C0";

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      style={{ width: SW, height: SH }}
    >
      <LinearGradient colors={[bgStart, bgEnd]} style={StyleSheet.absoluteFill} />

      {isBookmarked && <BookmarkFlag colors={colors} />}

      <View style={[pageStyles.header, { borderBottomColor: colors.border }]}>
        <Text style={[pageStyles.headerMeta, { color: colors.mutedForeground }]}>
          الجزء {juz}
        </Text>
        <View style={[pageStyles.headerDot, { backgroundColor: colors.accent }]} />
        <Text style={[pageStyles.headerMeta, { color: colors.mutedForeground }]}>
          الحزب {hizb}
        </Text>
        <View style={[pageStyles.headerDot, { backgroundColor: colors.accent }]} />
        <Text style={[pageStyles.headerMeta, { color: colors.mutedForeground }]}>
          {surahsOnPage.map((s) => s.nameAr).join(" / ")}
        </Text>
      </View>

      <View style={pageStyles.pageBody}>
        <View style={[pageStyles.outerBorder, { borderColor: colors.border }]}>
          <View style={[pageStyles.innerBorder, { borderColor: colors.accent + "60" }]}>
            <View style={pageStyles.cornerTL} />
            <View style={pageStyles.cornerTR} />
            <View style={pageStyles.cornerBL} />
            <View style={pageStyles.cornerBR} />
            <Text style={[pageStyles.pageNum, { color: colors.primary }]}>
              {pageNumber}
            </Text>
            <Text style={[pageStyles.mainTitle, { color: colors.primary }]}>
              {surahsOnPage.length > 0
                ? `سورة ${surahsOnPage[0].nameAr}`
                : `صفحة ${pageNumber}`}
            </Text>
            {surahsOnPage.length > 0 && pageNumber !== 1 && (
              <Text style={[pageStyles.basmala, { color: colors.foreground }]}>
                بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
              </Text>
            )}
            <Text style={[pageStyles.placeholder, { color: colors.mutedForeground }]}>
              ارفع ملف المصحف لعرض الصفحات
            </Text>
            <Text style={[pageStyles.tapHint, { color: colors.mutedForeground + "80" }]}>
              انقر مرتين لإضافة علامة حفظ
            </Text>
          </View>
        </View>
      </View>

      <View style={[pageStyles.footer, { borderTopColor: colors.border }]}>
        <View style={[pageStyles.footerLine, { backgroundColor: colors.accent + "40" }]} />
        <Text style={[pageStyles.footerNum, { color: colors.mutedForeground }]}>
          {pageNumber}
        </Text>
        <View style={[pageStyles.footerLine, { backgroundColor: colors.accent + "40" }]} />
      </View>
    </TouchableOpacity>
  );
}

const pageStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  headerMeta: {
    fontFamily: "Cairo_400Regular",
    fontSize: 12,
  },
  headerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    opacity: 0.6,
  },
  pageBody: {
    flex: 1,
    padding: 10,
  },
  outerBorder: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 4,
    padding: 6,
  },
  innerBorder: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: 16,
    position: "relative",
  },
  cornerTL: {
    position: "absolute",
    top: 6,
    left: 6,
    width: 14,
    height: 14,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: "#C4A44A",
  },
  cornerTR: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 14,
    height: 14,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: "#C4A44A",
  },
  cornerBL: {
    position: "absolute",
    bottom: 6,
    left: 6,
    width: 14,
    height: 14,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: "#C4A44A",
  },
  cornerBR: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 14,
    height: 14,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: "#C4A44A",
  },
  pageNum: {
    fontFamily: "Amiri_700Bold",
    fontSize: 13,
    opacity: 0.5,
    position: "absolute",
    top: 20,
  },
  mainTitle: {
    fontFamily: "Amiri_700Bold",
    fontSize: 22,
    textAlign: "center",
  },
  basmala: {
    fontFamily: "Amiri_400Regular",
    fontSize: 18,
    textAlign: "center",
  },
  placeholder: {
    fontFamily: "Cairo_400Regular",
    fontSize: 13,
    textAlign: "center",
  },
  tapHint: {
    fontFamily: "Cairo_400Regular",
    fontSize: 11,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  footerLine: {
    flex: 1,
    height: 1,
    borderRadius: 1,
  },
  footerNum: {
    fontFamily: "Amiri_700Bold",
    fontSize: 14,
  },
});

export default function MushafScreen() {
  const {
    currentPage,
    setCurrentPage,
    addBookmark,
    removeBookmark,
    isBookmarked,
    isDark,
    markPageRead,
  } = useApp();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [showGoTo, setShowGoTo] = useState(false);
  const [goToInput, setGoToInput] = useState("");
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const surahsOnPage = getSurahsForPage(currentPage);
  const juz = getJuzForPage(currentPage);
  const hizb = getHizbForPage(currentPage);

  const showFloating = () => {
    Animated.timing(floatingAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      Animated.timing(floatingAnim, { toValue: 0, duration: 600, useNativeDriver: true }).start();
    }, 3500);
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        const page = TOTAL_PAGES - viewableItems[0].index;
        setCurrentPage(page);
        markPageRead(page);
        showFloating();
      }
    },
    [setCurrentPage, markPageRead]
  );

  const handleDoublePress = useCallback(
    (page: number) => {
      if (isBookmarked(page)) {
        removeBookmark(page);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        const arr = getSurahsForPage(page);
        addBookmark({
          page,
          surahName: arr.length > 0 ? arr[0].nameAr : `صفحة ${page}`,
          verseHint: `الجزء ${getJuzForPage(page)}`,
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    [isBookmarked, removeBookmark, addBookmark]
  );

  const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => TOTAL_PAGES - i);
  const tabBarH = Platform.OS === "web" ? 84 : 68;

  const handleGoTo = () => {
    const p = parseInt(goToInput, 10);
    if (p >= 1 && p <= TOTAL_PAGES) {
      const index = TOTAL_PAGES - p;
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setCurrentPage(p);
    }
    setShowGoTo(false);
    setGoToInput("");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        ref={flatListRef}
        data={pages}
        keyExtractor={(item) => String(item)}
        renderItem={({ item }) => (
          <MushafPage
            pageNumber={item}
            isDark={isDark}
            colors={colors}
            onDoublePress={handleDoublePress}
            isBookmarked={isBookmarked(item)}
          />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={0}
        getItemLayout={(_, index) => ({
          length: SW,
          offset: SW * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        windowSize={5}
        maxToRenderPerBatch={3}
        initialNumToRender={2}
        removeClippedSubviews={Platform.OS !== "web"}
      />

      <Animated.View
        style={[
          styles.floatingBar,
          {
            borderColor: colors.border,
            bottom: tabBarH + 10 + insets.bottom,
            opacity: floatingAnim,
            transform: [{ translateY: floatingAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
          },
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={isDark ? ["rgba(34,26,10,0.97)", "rgba(26,18,8,0.95)"] : ["rgba(248,242,224,0.97)", "rgba(240,230,200,0.95)"]}
          style={styles.floatingInner}
        >
          <Text style={[styles.floatingTitle, { color: colors.foreground }]}>
            {surahsOnPage.map((s) => s.nameAr).join("  •  ")}
          </Text>
          <View style={[styles.floatingRow]}>
            <Text style={[styles.floatingMeta, { color: colors.primary }]}>
              الجزء {juz}
            </Text>
            <View style={[styles.floatingDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.floatingMeta, { color: colors.primary }]}>
              الحزب {hizb}
            </Text>
            <View style={[styles.floatingDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.floatingMeta, { color: colors.mutedForeground }]}>
              صفحة {currentPage}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <TouchableOpacity
        style={[styles.goToBtn, { backgroundColor: colors.card, borderColor: colors.border, bottom: tabBarH + 10 + insets.bottom }]}
        onPress={() => setShowGoTo(true)}
      >
        <Text style={[styles.goToBtnText, { color: colors.primary }]}>↗</Text>
      </TouchableOpacity>

      <Modal visible={showGoTo} transparent animationType="fade" onRequestClose={() => setShowGoTo(false)}>
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setShowGoTo(false)}>
          <View style={[styles.goToCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.goToTitle, { color: colors.foreground }]}>الذهاب لصفحة</Text>
            <TextInput
              style={[styles.goToInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
              placeholder={`1 - ${TOTAL_PAGES}`}
              placeholderTextColor={colors.mutedForeground}
              value={goToInput}
              onChangeText={setGoToInput}
              keyboardType="number-pad"
              textAlign="center"
              autoFocus
              onSubmitEditing={handleGoTo}
            />
            <TouchableOpacity style={[styles.goToConfirm, { backgroundColor: colors.primary }]} onPress={handleGoTo}>
              <Text style={[styles.goToConfirmText, { color: colors.primaryForeground }]}>انتقال</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  floatingBar: {
    position: "absolute",
    left: 20,
    right: 64,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  floatingInner: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    gap: 4,
  },
  floatingTitle: {
    fontFamily: "Amiri_700Bold",
    fontSize: 15,
    textAlign: "center",
  },
  floatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  floatingMeta: {
    fontFamily: "Cairo_400Regular",
    fontSize: 12,
  },
  floatingDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    opacity: 0.7,
  },
  goToBtn: {
    position: "absolute",
    right: 14,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  goToBtnText: {
    fontSize: 18,
    fontWeight: "700",
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  goToCard: {
    width: "100%",
    maxWidth: 300,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 12,
    alignItems: "center",
  },
  goToTitle: {
    fontFamily: "Cairo_700Bold",
    fontSize: 18,
  },
  goToInput: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 20,
    fontFamily: "Cairo_400Regular",
  },
  goToConfirm: {
    width: "100%",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  goToConfirmText: {
    fontSize: 15,
    fontFamily: "Cairo_700Bold",
  },
});
