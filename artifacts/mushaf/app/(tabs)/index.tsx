import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { SURAHS } from "@/data/surahs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
      s.nameAr.includes(search) ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      String(s.number).includes(search)
  );

  const goToSurah = (page: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentPage(page);
    router.push("/(tabs)/mushaf");
  };

  const goToBookmark = () => {
    if (!lastBookmark) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentPage(lastBookmark.page);
    router.push("/(tabs)/mushaf");
  };

  const tabBarHeight = Platform.OS === "web" ? 84 : 60;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
            paddingTop: topPad + 12,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>الفهرس</Text>
          {lastBookmark && (
            <TouchableOpacity
              style={[styles.bookmarkBtn, { backgroundColor: colors.primary }]}
              onPress={goToBookmark}
              activeOpacity={0.8}
            >
              <Feather name="bookmark" size={14} color={colors.primaryForeground} />
              <Text style={[styles.bookmarkBtnText, { color: colors.primaryForeground }]}>
                آخر موضع
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.searchBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="ابحث عن سورة..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
            textAlign="right"
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.number)}
        contentContainerStyle={{ paddingBottom: tabBarHeight + insets.bottom + 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.surahRow,
              {
                backgroundColor: colors.card,
                borderBottomColor: colors.border,
              },
            ]}
            onPress={() => goToSurah(item.page)}
            activeOpacity={0.7}
          >
            <View style={[styles.surahNumber, { backgroundColor: colors.primary }]}>
              <Text style={[styles.surahNumberText, { color: colors.primaryForeground }]}>
                {item.number}
              </Text>
            </View>

            <View style={styles.surahInfo}>
              <View style={styles.surahNameRow}>
                <Text style={[styles.surahNameAr, { color: colors.foreground }]}>
                  {item.nameAr}
                </Text>
                <Text style={[styles.surahNameEn, { color: colors.mutedForeground }]}>
                  {item.name}
                </Text>
              </View>
              <Text style={[styles.surahMeta, { color: colors.mutedForeground }]}>
                {item.verses} آية • {item.type === "meccan" ? "مكية" : "مدنية"} • الجزء {item.juz}
              </Text>
            </View>

            <View style={styles.surahRight}>
              <Text style={[styles.pageNumber, { color: colors.primary }]}>ص {item.page}</Text>
              {isBookmarked(item.page) && (
                <Feather name="bookmark" size={14} color={colors.primary} />
              )}
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  bookmarkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bookmarkBtnText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    padding: 0,
  },
  surahRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  surahNumber: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  surahNumberText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  surahInfo: {
    flex: 1,
    gap: 3,
    alignItems: "flex-end",
  },
  surahNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  surahNameAr: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    textAlign: "right",
  },
  surahNameEn: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  surahMeta: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "right",
  },
  surahRight: {
    alignItems: "center",
    gap: 4,
  },
  pageNumber: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
});
