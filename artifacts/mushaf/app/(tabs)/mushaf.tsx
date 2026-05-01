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

const MUSHAF_BG = "#F5EDD6";
const TAP_WINDOW = 400;

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

function ZoomIcon({ color }: { color: string }) {
  return (
    <View style={zoomIconStyle.wrap}>
      <View style={[zoomIconStyle.circle, { borderColor: color }]} />
      <View style={[zoomIconStyle.handle, { backgroundColor: color }]} />
    </View>
  );
}

const zoomIconStyle = StyleSheet.create({
  wrap: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
  },
  handle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 8,
    height: 2.5,
    borderRadius: 2,
    transform: [{ rotate: "45deg" }],
    marginBottom: 1,
    marginRight: 1,
  },
});

function MushafPage({
  pageNumber,
  isDark,
  colors,
  onDoublePress,
  onTriplePress,
  isBookmarked,
  brightness,
  zoom,
}: {
  pageNumber: number;
  isDark: boolean;
  colors: ReturnType<typeof useColors>;
  onDoublePress: (page: number) => void;
  onTriplePress: () => void;
  isBookmarked: boolean;
  brightness: number;
  zoom: number;
}) {
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const src = MUSHAF_PAGES[pageNumber];

  const handlePress = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      const count = tapCount.current;
      tapCount.current = 0;
      if (count === 2) {
        onDoublePress(pageNumber);
      } else if (count >= 3) {
        onTriplePress();
      }
    }, TAP_WINDOW);
  };

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
      style={[styles.page, { backgroundColor: MUSHAF_BG }]}
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
    setMushafFullScreen,
  } = useApp();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [showGoTo, setShowGoTo] = useState(false);
  const [goToInput, setGoToInput] = useState("");
  const [zoom, setZoom] = useState(1.0);
  const [showZoom, setShowZoom] = useState(false);
  const [uiVisible, setUiVisible] = useState(false);
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const zoomAnim = useRef(new Animated.Value(0)).current;
  const uiAnim = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const zoomHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFocusScrolling = useRef(false);

  const surahsOnPage = getSurahsForPage(currentPage);
  const juz = getJuzForPage(currentPage);
  const hizb = getHizbForPage(currentPage);

  const animateUi = useCallback((visible: boolean, cb?: () => void) => {
    Animated.timing(uiAnim, {
      toValue: visible ? 1 : 0,
      duration: 280,
      useNativeDriver: true,
    }).start(cb);
  }, [uiAnim]);

  useFocusEffect(
    useCallback(() => {
      setUiVisible(false);
      setMushafFullScreen(true);
      uiAnim.setValue(0);

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

      return () => {
        setMushafFullScreen(false);
        setUiVisible(false);
        uiAnim.setValue(0);
      };
    }, [currentPage, setMushafFullScreen])
  );

  const toggleUi = useCallback(() => {
    const next = !uiVisible;
    setUiVisible(next);
    setMushafFullScreen(!next);
    animateUi(next);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [uiVisible, setMushafFullScreen, animateUi]);

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
        if (uiVisible) showFloating();
      }
    },
    [setCurrentPage, markPageRead, uiVisible]
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

  const handleBookmarkPress = useCallback(() => {
    if (isBookmarked(currentPage)) {
      removeBookmark(currentPage);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      const arr = getSurahsForPage(currentPage);
      addBookmark({
        page: currentPage,
        surahName: arr.length > 0 ? arr[0].nameAr : `صفحة ${currentPage}`,
        verseHint: `الجزء ${getJuzForPage(currentPage)}`,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [currentPage, isBookmarked, removeBookmark, addBookmark]);

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

  const bottomBase = (uiVisible ? tabBarH : 0) + 12 + insets.bottom;
  const topBase = Platform.OS === "web" ? 16 : insets.top + 8;
  const bookmarked = isBookmarked(currentPage);

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
            onTriplePress={toggleUi}
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

      {/* All overlay UI — fades in/out with uiAnim */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: uiAnim }]}
        pointerEvents={uiVisible ? "box-none" : "none"}
      >
        {/* Bookmark button — top right */}
        <TouchableOpacity
          style={[
            styles.bookmarkBtn,
            {
              backgroundColor: bookmarked ? colors.primary : colors.card,
              borderColor: bookmarked ? colors.primary : colors.border,
              top: topBase,
              right: 16,
            },
          ]}
          onPress={handleBookmarkPress}
          activeOpacity={0.8}
        >
          <View style={styles.bookmarkIconWrap}>
            <View
              style={[
                styles.bookmarkIconBody,
                {
                  borderColor: bookmarked ? colors.primaryForeground : colors.primary,
                  backgroundColor: "transparent",
                },
              ]}
            />
            <View
              style={[
                styles.bookmarkIconTip,
                {
                  borderTopColor: bookmarked ? colors.primaryForeground : colors.primary,
                },
              ]}
            />
          </View>
        </TouchableOpacity>

        {/* Page info floating bar */}
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

        {/* Zoom panel */}
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
            <TouchableOpacity onPress={() => handleZoomChange(0.1)} activeOpacity={0.75}>
              <LinearGradient
                colors={[colors.accent, colors.primary]}
                style={styles.zoomBtn3D}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <Text style={[styles.zoomBtnText3D, { color: colors.primaryForeground }]}>＋</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={resetZoom} activeOpacity={0.75}>
              <Text style={[styles.zoomValue, { color: colors.foreground }]}>
                {Math.round(zoom * 100)}%
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleZoomChange(-0.1)} activeOpacity={0.75}>
              <LinearGradient
                colors={[colors.accent, colors.primary]}
                style={styles.zoomBtn3D}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <Text style={[styles.zoomBtnText3D, { color: colors.primaryForeground }]}>－</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Zoom toggle button */}
        <TouchableOpacity
          style={[
            styles.zoomToggleBtn,
            {
              backgroundColor: zoom !== 1.0 ? colors.primary : colors.card,
              borderColor: zoom !== 1.0 ? colors.primary : colors.border,
              bottom: bottomBase + 58,
              right: 16,
              shadowColor: colors.primary,
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
          {zoom !== 1.0 ? (
            <Text style={[styles.zoomToggleIcon, { color: colors.primaryForeground }]}>
              {Math.round(zoom * 100)}%
            </Text>
          ) : (
            <ZoomIcon color={colors.primary} />
          )}
        </TouchableOpacity>

        {/* Go-to page button */}
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
      </Animated.View>

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
  bookmarkBtn: {
    position: "absolute",
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
  },
  bookmarkIconWrap: {
    alignItems: "center",
    width: 14,
    height: 18,
  },
  bookmarkIconBody: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderRadius: 2,
  },
  bookmarkIconTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
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
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 30,
  },
  zoomBtn3D: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  zoomBtnText3D: {
    fontSize: 20,
    fontFamily: "Cairo_700Bold",
    lineHeight: 24,
    textAlign: "center",
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
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
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
    paddingHorizontal: 16,
    fontSize: 18,
    fontFamily: "Cairo_700Bold",
    textAlign: "center",
  },
  goToConfirm: {
    width: "100%",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  goToConfirmText: {
    fontFamily: "Cairo_700Bold",
    fontSize: 16,
  },
});
