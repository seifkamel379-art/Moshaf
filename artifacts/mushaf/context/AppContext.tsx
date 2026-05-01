import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

const STORAGE_KEYS = {
  USER_NAME: "mushaf_user_name",
  CURRENT_PAGE: "mushaf_current_page",
  BOOKMARKS: "mushaf_bookmarks",
  THEME: "mushaf_theme",
  FONT_SIZE: "mushaf_font_size",
  BRIGHTNESS: "mushaf_brightness",
  KHATMA_PLAN: "mushaf_khatma_plan",
  KHATMA_PAGES_READ: "mushaf_khatma_pages_read",
};

export interface KhatmaPlan {
  days: number;
  pagesPerDay: number;
  startDate: string;
}

export interface Bookmark {
  page: number;
  surahName: string;
  verseHint: string;
  timestamp: number;
}

interface AppContextType {
  userName: string | null;
  setUserName: (name: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, "timestamp">) => void;
  removeBookmark: (page: number) => void;
  isBookmarked: (page: number) => boolean;
  lastBookmark: Bookmark | null;
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  fontSize: number;
  setFontSize: (v: number) => void;
  brightness: number;
  setBrightness: (v: number) => void;
  khatmaPlan: KhatmaPlan | null;
  setKhatmaPlan: (plan: KhatmaPlan | null) => void;
  khatmaPagesRead: number;
  markPageRead: (page: number) => void;
  loaded: boolean;
  mushafFullScreen: boolean;
  setMushafFullScreen: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [userName, setUserNameState] = useState<string | null>(null);
  const [currentPage, setCurrentPageState] = useState(1);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isDark, setIsDarkState] = useState(systemScheme === "dark");
  const [fontSize, setFontSizeState] = useState(1.0);
  const [brightness, setBrightnessState] = useState(1.0);
  const [khatmaPlan, setKhatmaPlanState] = useState<KhatmaPlan | null>(null);
  const [khatmaPagesRead, setKhatmaPagesRead] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [mushafFullScreen, setMushafFullScreen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [name, page, bk, theme, fs, br, kp, kpr] = await AsyncStorage.multiGet([
          STORAGE_KEYS.USER_NAME,
          STORAGE_KEYS.CURRENT_PAGE,
          STORAGE_KEYS.BOOKMARKS,
          STORAGE_KEYS.THEME,
          STORAGE_KEYS.FONT_SIZE,
          STORAGE_KEYS.BRIGHTNESS,
          STORAGE_KEYS.KHATMA_PLAN,
          STORAGE_KEYS.KHATMA_PAGES_READ,
        ]);
        if (name[1]) setUserNameState(name[1]);
        if (page[1]) setCurrentPageState(Number(page[1]));
        if (bk[1]) setBookmarks(JSON.parse(bk[1]));
        if (theme[1]) setIsDarkState(theme[1] === "dark");
        if (fs[1]) setFontSizeState(Number(fs[1]));
        if (br[1]) setBrightnessState(Number(br[1]));
        if (kp[1]) setKhatmaPlanState(JSON.parse(kp[1]));
        if (kpr[1]) setKhatmaPagesRead(Number(kpr[1]));
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const setUserName = useCallback((name: string) => {
    setUserNameState(name);
    AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, name);
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    setCurrentPageState(page);
    AsyncStorage.setItem(STORAGE_KEYS.CURRENT_PAGE, String(page));
  }, []);

  const addBookmark = useCallback((bookmark: Omit<Bookmark, "timestamp">) => {
    setBookmarks((prev) => {
      const filtered = prev.filter((b) => b.page !== bookmark.page);
      const newBookmarks = [{ ...bookmark, timestamp: Date.now() }, ...filtered];
      AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  }, []);

  const removeBookmark = useCallback((page: number) => {
    setBookmarks((prev) => {
      const newBookmarks = prev.filter((b) => b.page !== page);
      AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  }, []);

  const isBookmarked = useCallback((page: number) => bookmarks.some((b) => b.page === page), [bookmarks]);

  const lastBookmark = bookmarks.length > 0 ? bookmarks.sort((a, b) => b.timestamp - a.timestamp)[0] : null;

  const setIsDark = useCallback((v: boolean) => {
    setIsDarkState(v);
    AsyncStorage.setItem(STORAGE_KEYS.THEME, v ? "dark" : "light");
  }, []);

  const setFontSize = useCallback((v: number) => {
    setFontSizeState(v);
    AsyncStorage.setItem(STORAGE_KEYS.FONT_SIZE, String(v));
  }, []);

  const setBrightness = useCallback((v: number) => {
    setBrightnessState(v);
    AsyncStorage.setItem(STORAGE_KEYS.BRIGHTNESS, String(v));
  }, []);

  const setKhatmaPlan = useCallback((plan: KhatmaPlan | null) => {
    setKhatmaPlanState(plan);
    if (plan) {
      AsyncStorage.setItem(STORAGE_KEYS.KHATMA_PLAN, JSON.stringify(plan));
    } else {
      AsyncStorage.removeItem(STORAGE_KEYS.KHATMA_PLAN);
    }
  }, []);

  const markPageRead = useCallback((page: number) => {
    setKhatmaPagesRead((prev) => {
      const next = Math.max(prev, page);
      AsyncStorage.setItem(STORAGE_KEYS.KHATMA_PAGES_READ, String(next));
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        userName,
        setUserName,
        currentPage,
        setCurrentPage,
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        lastBookmark,
        isDark,
        setIsDark,
        fontSize,
        setFontSize,
        brightness,
        setBrightness,
        khatmaPlan,
        setKhatmaPlan,
        khatmaPagesRead,
        markPageRead,
        loaded,
        mushafFullScreen,
        setMushafFullScreen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
