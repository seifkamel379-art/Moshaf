import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { SURAHS } from "@/data/surahs";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function IndexScreen() {
  const { setCurrentPage, lastBookmark, isBookmarked } = useApp();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  const filtered = SURAHS.filter(
    (s) =>
      s.number !== 1 &&
      (s.nameAr.includes(search) ||
        s.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        String(s.number).includes(search))
  );

  const goToSurah = (page: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentPage(page);
    router.navigate("/(tabs)/mushaf");
  };

  const goToBookmark = () => {
    if (!lastBookmark) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentPage(lastBookmark.page);
    router.navigate("/(tabs)/mushaf");
  };

  const tabBarH = Platform.OS === "web" ? 84 : 68;
  const topPad = Platform.OS === "web" ? 24 : insets.top;

  const getJuzLabel = (juz: number) => `جزء ${juz}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.card, colors.background]}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.foreground }]}>فهرس السور</Text>
          {lastBookmark && (
            <TouchableOpacity
              style={[styles.bookmarkChip, { backgroundColor: colors.primary }]}
              onPress={goToBookmark}
              activeOpacity={0.85}
            >
              <Text style={[styles.bookmarkChipText, { color: colors.primaryForeground }]}>
                آخر موضع • ص {lastBookmark.page}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View
          style={[
            styles.searchContainer,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.searchIcon, { color: colors.mutedForeground }]}>بحث</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="ابحث عن سورة..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
            textAlign="right"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text style={[styles.clearBtn, { color: colors.mutedForeground }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <FlatList
        data={filtered}
        keyExtractor={(s) => String(s.number)}
        contentContainerStyle={{ paddingBottom: tabBarH + insets.bottom + 8, paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.row,
              {
                backgroundColor: index % 2 === 0 ? colors.card : colors.background,
                borderBottomColor: colors.border,
              },
            ]}
            onPress={() => goToSurah(item.page)}
            activeOpacity={0.75}
          >
            <View style={styles.rowLeft}>
              <LinearGradient
                colors={[colors.accent, colors.primary]}
                style={styles.numberBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={[styles.numberText, { color: colors.primaryForeground }]}>
                  {item.number}
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.rowCenter}>
              <Text style={[styles.surahName, { color: colors.foreground }]}>
                {item.nameAr}
              </Text>
              <View style={styles.metaRow}>
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                  {item.verses} آية
                </Text>
                <View style={[styles.metaDot, { backgroundColor: colors.accent }]} />
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                  {item.type === "meccan" ? "مكية" : "مدنية"}
                </Text>
                <View style={[styles.metaDot, { backgroundColor: colors.accent }]} />
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                  {getJuzLabel(item.juz)}
                </Text>
              </View>
            </View>

            <View style={styles.rowRight}>
              <View style={[styles.pageBadge, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <Text style={[styles.pageNum, { color: colors.primary }]}>
                  {item.page}
                </Text>
              </View>
              {isBookmarked(item.page) && (
                <View style={[styles.bmDot, { backgroundColor: colors.primary }]} />
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: "Amiri_700Bold",
  },
  bookmarkChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bookmarkChipText: {
    fontSize: 12,
    fontFamily: "Cairo_600SemiBold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
  },
  searchIcon: { fontSize: 14 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Cairo_400Regular",
    padding: 0,
  },
  clearBtn: { fontSize: 14, paddingHorizontal: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  rowLeft: {},
  numberBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontFamily: "Cairo_700Bold",
    fontSize: 13,
  },
  rowCenter: { flex: 1, alignItems: "flex-end", gap: 3 },
  surahName: {
    fontFamily: "Amiri_700Bold",
    fontSize: 18,
    textAlign: "right",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
  },
  metaText: {
    fontFamily: "Cairo_400Regular",
    fontSize: 11,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    opacity: 0.5,
  },
  rowRight: { alignItems: "center", gap: 4 },
  pageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 36,
    alignItems: "center",
  },
  pageNum: {
    fontFamily: "Cairo_600SemiBold",
    fontSize: 12,
  },
  bmDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
