import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { getHizbForPage, getJuzForPage, getSurahsForPage, TOTAL_PAGES } from "@/data/surahs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const PAGE_HEIGHT = SCREEN_HEIGHT;

function MushafPage({
  pageNumber,
  fontSize,
  opacity,
  brightness,
  isDark,
  colors,
  onDoublePress,
  isBookmarked,
}: {
  pageNumber: number;
  fontSize: number;
  opacity: number;
  brightness: number;
  isDark: boolean;
  colors: ReturnType<typeof useColors>;
  onDoublePress: (page: number) => void;
  isBookmarked: boolean;
}) {
  const lastTap = useRef(0);

  const handlePress = () => {
    const now = Date.now();
    if (now - lastTap.current < 400) {
      onDoublePress(pageNumber);
    }
    lastTap.current = now;
  };

  const bgColor = isDark
    ? `rgba(26,18,8,${opacity})`
    : `rgba(245,237,214,${opacity})`;

  const surahsOnPage = getSurahsForPage(pageNumber);
  const juz = getJuzForPage(pageNumber);
  const hizb = getHizbForPage(pageNumber);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      style={[
        styles.page,
        {
          width: SCREEN_WIDTH,
          height: PAGE_HEIGHT,
          backgroundColor: bgColor,
          opacity: brightness,
        },
      ]}
    >
      {isBookmarked && (
        <View style={[styles.bookmarkFlag, { backgroundColor: colors.primary }]}>
          <Feather name="bookmark" size={14} color={colors.primaryForeground} />
        </View>
      )}

      <View style={[styles.pageHeader, { borderBottomColor: colors.border }]}>
        <Text style={[styles.pageHeaderText, { color: colors.mutedForeground, fontSize: 11 * fontSize }]}>
          الجزء {juz} • الحزب {hizb}
        </Text>
        <Text style={[styles.pageHeaderText, { color: colors.mutedForeground, fontSize: 11 * fontSize }]}>
          {surahsOnPage.map((s) => s.nameAr).join(" • ")}
        </Text>
      </View>

      <View style={styles.pageContent}>
        <View style={[styles.quranFrame, { borderColor: colors.border }]}>
          <View style={[styles.innerFrame, { borderColor: colors.accent }]}>
            <Text style={[styles.pageNumberText, { color: colors.primary, fontSize: 14 * fontSize }]}>
              بسم الله الرحمن الرحيم
            </Text>
            <Text style={[styles.placeholderText, { color: colors.mutedForeground, fontSize: 13 * fontSize }]}>
              الصفحة {pageNumber}
            </Text>
            <Text style={[styles.arabicPlaceholder, { color: colors.foreground, fontSize: 20 * fontSize, lineHeight: 36 * fontSize }]}>
              {getPageSampleText(pageNumber)}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.pageFooter, { borderTopColor: colors.border }]}>
        <Text style={[styles.pageNumberFooter, { color: colors.mutedForeground, fontSize: 12 * fontSize }]}>
          {pageNumber}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function getPageSampleText(page: number): string {
  const surahsOnPage = getSurahsForPage(page);
  if (surahsOnPage.length > 0) {
    return `سورة ${surahsOnPage[0].nameAr}\n\nارفع ملف PDF المصحف\nليتم عرض الصفحات بشكل صحيح`;
  }
  return `صفحة ${page}\n\nارفع ملف PDF المصحف\nليتم عرض محتوى الصفحات`;
}

export default function MushafScreen() {
  const { currentPage, setCurrentPage, addBookmark, removeBookmark, isBookmarked, fontSize, brightness, opacity, isDark, markPageRead } = useApp();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [showPageInput, setShowPageInput] = useState(false);
  const floatingOpacity = useRef(new Animated.Value(1)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const surahsOnPage = getSurahsForPage(currentPage);
  const juz = getJuzForPage(currentPage);
  const hizb = getHizbForPage(currentPage);

  const showFloating = () => {
    Animated.timing(floatingOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      Animated.timing(floatingOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 3000);
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
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
        const surahsArr = getSurahsForPage(page);
        addBookmark({
          page,
          surahName: surahsArr.length > 0 ? surahsArr[0].nameAr : `صفحة ${page}`,
          verseHint: `الجزء ${getJuzForPage(page)}`,
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    [isBookmarked, removeBookmark, addBookmark]
  );

  const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

  const tabBarHeight = Platform.OS === "web" ? 84 : 60;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        ref={flatListRef}
        data={pages}
        keyExtractor={(item) => String(item)}
        renderItem={({ item }) => (
          <MushafPage
            pageNumber={item}
            fontSize={fontSize}
            opacity={opacity}
            brightness={brightness}
            isDark={isDark}
            colors={colors}
            onDoublePress={handleDoublePress}
            isBookmarked={isBookmarked(item)}
          />
        )}
        horizontal
        inverted
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={TOTAL_PAGES - currentPage}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        windowSize={5}
        maxToRenderPerBatch={3}
        initialNumToRender={3}
        removeClippedSubviews={Platform.OS !== "web"}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
      />

      <Animated.View
        style={[
          styles.floatingBar,
          {
            backgroundColor: colors.floatingBar,
            borderColor: colors.border,
            bottom: tabBarHeight + 8 + insets.bottom,
            opacity: floatingOpacity,
          },
        ]}
        pointerEvents="none"
      >
        <Text style={[styles.floatingText, { color: colors.foreground }]}>
          {surahsOnPage.map((s) => s.nameAr).join(" • ")}
        </Text>
        <View style={styles.floatingDivider} />
        <Text style={[styles.floatingSubtext, { color: colors.mutedForeground }]}>
          الجزء {juz} • الحزب {hizb} • ص {currentPage}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  page: {
    flex: 1,
    flexDirection: "column",
  },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pageHeaderText: {
    fontFamily: "Inter_400Regular",
  },
  pageContent: {
    flex: 1,
    padding: 12,
  },
  quranFrame: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 4,
    padding: 8,
  },
  innerFrame: {
    flex: 1,
    borderWidth: 0.5,
    borderRadius: 2,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  pageNumberText: {
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  placeholderText: {
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  arabicPlaceholder: {
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    writingDirection: "rtl",
  },
  pageFooter: {
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  pageNumberFooter: {
    fontFamily: "Inter_400Regular",
  },
  bookmarkFlag: {
    position: "absolute",
    top: 0,
    right: 24,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    zIndex: 10,
  },
  floatingBar: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  floatingText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    textAlign: "center",
  },
  floatingDivider: {
    height: StyleSheet.hairlineWidth,
    width: "80%",
    backgroundColor: "#ccc",
  },
  floatingSubtext: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    textAlign: "center",
  },
});
