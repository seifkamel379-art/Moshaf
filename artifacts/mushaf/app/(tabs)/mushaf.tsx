import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { getHizbForPage, getJuzForPage, getSurahsForPage, TOTAL_PAGES } from "@/data/surahs";
import MUSHAF_PAGES from "@/data/pages";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
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

function BookmarkRibbon({ colors }: { colors: ReturnType<typeof useColors> }) {
  return (
    <View style={[ribbon.wrap, { backgroundColor: colors.primary }]}>
      <View style={[ribbon.inner, { backgroundColor: colors.accent }]} />
      <View style={[ribbon.tip, { borderTopColor: colors.primary }]} />
    </View>
  );
}

const ribbon = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: 0,
    right: 22,
    width: 22,
    alignItems: "center",
    zIndex: 20,
    paddingTop: 2,
    paddingBottom: 0,
  },
  inner: {
    width: 10,
    height: 28,
    borderRadius: 2,
  },
  tip: {
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});

function MushafPage({
  pageNumber,
  isDark,
  colors,
  onDoublePress,
  isBookmarked,
  brightness,
  zoom,
}: {
  pageNumber: number;
  isDark: boolean;
  colors: ReturnType<typeof useColors>;
  onDoublePress: (page: number) => void;
  isBookmarked: boolean;
  brightness: number;
  zoom: number;
}) {
  const lastTap = useRef(0);
  const src = MUSHAF_PAGES[pageNumber];

  const handlePress = () => {
    const now = Date.now();
    if (now - lastTap.current < 380) {
      onDoublePress(pageNumber);
    }
    lastTap.current = now;
  };

  const bgColor = isDark ? "#1A1208" : "#F5EDD6";

  const dynamicImageStyle: any = {
    opacity: brightness,
    transform: [{ scale: zoom }],
    ...(Platform.OS === "web"
      ? isDark
        ? {
            filter: "invert(0.88) sepia(0.15) brightness(0.85)",
            mixBlendMode: "multiply",
          }
        : { mixBlendMode: "multiply" }
      : !isDark
      ? { mixBlendMode: "multiply" }
      : {}),
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      style={[styles.page, { backgroundColor: bgColor }]}
    >
      {isBookmarked && <BookmarkRibbon colors={colors} />}

      <Image
        source={src}
        style={[styles.pageImage, dynamicImageStyle]}
        resizeMode="contain"
        fadeDuration={0}
      />

      {isDark && Platform.OS !== "web" && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(10,6,0,0.30)", pointerEvents: "none" },
          ]}
        />
      )}
    </TouchableOpacity>
  );
}

export default function MushafScreen() {
  const {
    currentPage,
    setCurrentPage,
    addBookmark,
    removeBookmark,
    isBookmarked,
    isDark,
    markPageRead,
    brightness,
  } = useApp();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [showGoTo, setShowGoTo] = useState(false);
  const [goToInput, setGoToInput] = useState("");
  const [zoom, setZoom] = useState(1.0);
  const [showZoom, setShowZoom] = useState(false);
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const zoomAnim = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const zoomHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFocusScrolling = useRef(false);

  const surahsOnPage = getSurahsForPage(currentPage);
  const juz = getJuzForPage(currentPage);
  const hizb = getHizbForPage(currentPage);

  useFocusEffect(
    useCallback(() => {
      if (flatListRef.current) {
        isFocusScrolling.current = true;
        flatListRef.current.scrollToIndex({
          index: currentPage - 1,
          animated: false,
        });
        setTimeout(() => {
          isFocusScrolling.current = false;
        }, 300);
      }
    }, [currentPage])
  );

  const showFloating = () => {
    Animated.timing(floatingAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      Animated.timing(floatingAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }).start();
    }, 3500);
  };

  const showZoomPanel = () => {
    setShowZoom(true);
    Animated.timing(zoomAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
    if (zoomHideTimer.current) clearTimeout(zoomHideTimer.current);
    zoomHideTimer.current = setTimeout(() => {
      Animated.timing(zoomAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setShowZoom(false));
    }, 4000);
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (isFocusScrolling.current) return;
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        const page = viewableItems[0].index + 1;
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

  const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);
  const tabBarH = Platform.OS === "web" ? 84 : 68;

  const handleGoTo = () => {
    const p = parseInt(goToInput, 10);
    if (p >= 1 && p <= TOTAL_PAGES) {
      const index = p - 1;
      flatListRef.current?.scrollToIndex({ index, animated: false });
      setCurrentPage(p);
    }
    setShowGoTo(false);
    setGoToInput("");
  };

  const handleZoomChange = (delta: number) => {
    setZoom((prev) => {
      const next = Math.round(Math.min(2.0, Math.max(0.7, prev + delta)) * 10) / 10;
      return next;
    });
    Haptics.selectionAsync();
    showZoomPanel();
  };

  const resetZoom = () => {
    setZoom(1.0);
    Haptics.selectionAsync();
    showZoomPanel();
  };

  const bottomBase = tabBarH + 12 + insets.bottom;

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
            brightness={brightness}
            zoom={zoom}
          />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={currentPage - 1}
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
            bottom: bottomBase,
            opacity: floatingAnim,
            transform: [
              {
                translateY: floatingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
            ],
          },
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={
            isDark
              ? ["rgba(34,26,10,0.97)", "rgba(22,14,4,0.95)"]
              : ["rgba(250,244,228,0.97)", "rgba(240,230,200,0.95)"]
          }
          style={styles.floatingInner}
        >
          <Text style={[styles.floatingTitle, { color: colors.foreground }]}>
            {surahsOnPage.map((s) => s.nameAr).join("  —  ")}
          </Text>
          <View style={styles.floatingRow}>
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

      {showZoom && (
        <Animated.View
          style={[
            styles.zoomPanel,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              bottom: bottomBase + 110,
              right: 16,
              opacity: zoomAnim,
              transform: [
                {
                  scale: zoomAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.85, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.zoomBtn, { borderColor: colors.border }]}
            onPress={() => handleZoomChange(0.1)}
            activeOpacity={0.75}
          >
            <Text style={[styles.zoomBtnText, { color: colors.primary }]}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={resetZoom} activeOpacity={0.75}>
            <Text style={[styles.zoomValue, { color: colors.foreground }]}>
              {Math.round(zoom * 100)}%
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.zoomBtn, { borderColor: colors.border }]}
            onPress={() => handleZoomChange(-0.1)}
            activeOpacity={0.75}
          >
            <Text style={[styles.zoomBtnText, { color: colors.primary }]}>−</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <TouchableOpacity
        style={[
          styles.zoomToggleBtn,
          {
            backgroundColor: zoom !== 1.0 ? colors.primary : colors.card,
            borderColor: colors.border,
            bottom: bottomBase + 58,
            right: 16,
          },
        ]}
        onPress={() => {
          if (showZoom) {
            if (zoomHideTimer.current) clearTimeout(zoomHideTimer.current);
            Animated.timing(zoomAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => setShowZoom(false));
          } else {
            showZoomPanel();
          }
          Haptics.selectionAsync();
        }}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.zoomToggleIcon,
            { color: zoom !== 1.0 ? colors.primaryForeground : colors.primary },
          ]}
        >
          {zoom !== 1.0 ? `${Math.round(zoom * 100)}%` : "🔍"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.goToBtn,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            bottom: bottomBase,
          },
        ]}
        onPress={() => setShowGoTo(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.goToBtnText, { color: colors.primary }]}>
          {currentPage}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showGoTo}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGoTo(false)}
      >
        <TouchableOpacity
          style={styles.modalBg}
          activeOpacity={1}
          onPress={() => setShowGoTo(false)}
        >
          <View
            style={[
              styles.goToCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.goToTitle, { color: colors.foreground }]}>
              الانتقال لصفحة
            </Text>
            <TextInput
              style={[
                styles.goToInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.foreground,
                },
              ]}
              placeholder={`1 - ${TOTAL_PAGES}`}
              placeholderTextColor={colors.mutedForeground}
              value={goToInput}
              onChangeText={setGoToInput}
              keyboardType="number-pad"
              textAlign="center"
              autoFocus
              onSubmitEditing={handleGoTo}
            />
            <TouchableOpacity
              style={[styles.goToConfirm, { backgroundColor: colors.primary }]}
              onPress={handleGoTo}
            >
              <Text style={[styles.goToConfirmText, { color: colors.primaryForeground }]}>
                انتقال
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  page: {
    width: SW,
    height: SH,
    position: "relative",
    overflow: "hidden",
  },
  pageImage: {
    width: SW,
    height: SH,
  },
  floatingBar: {
    position: "absolute",
    left: 16,
    right: 68,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  floatingInner: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    gap: 5,
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
    opacity: 0.6,
  },
  zoomPanel: {
    position: "absolute",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 30,
  },
  zoomBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  zoomBtnText: {
    fontSize: 22,
    fontFamily: "Cairo_700Bold",
    lineHeight: 26,
  },
  zoomValue: {
    fontSize: 13,
    fontFamily: "Cairo_700Bold",
    textAlign: "center",
    minWidth: 40,
  },
  zoomToggleBtn: {
    position: "absolute",
    right: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  zoomToggleIcon: {
    fontSize: 11,
    fontFamily: "Cairo_700Bold",
    textAlign: "center",
  },
  goToBtn: {
    position: "absolute",
    right: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
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
    fontSize: 12,
    fontFamily: "Cairo_700Bold",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  goToTitle: {
    fontFamily: "Amiri_700Bold",
    fontSize: 18,
  },
  goToInput: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 22,
    fontFamily: "Cairo_700Bold",
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
