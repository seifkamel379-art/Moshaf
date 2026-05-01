export interface Surah {
  number: number;
  nameAr: string;
  nameEn: string;
  verses: number;
  page: number;
  juz: number;
  hizb: number;
  type: "meccan" | "medinan";
}

// Page numbers calibrated to this specific mushaf:
// مصحف الشاذلي رحمه الله برواية ورش عن نافع — 482 pages
// Calibrated from visual inspection of: Al-Baqarah p1, Al-Imran p43,
// Al-Araf p120, Yunus p168, As-Saf p440, Al-Inshiqaq p470, Al-Fajr p474, An-Nas p482
export const SURAHS: Surah[] = [
  { number: 1,   nameAr: "الفاتحة",      nameEn: "Al-Fatihah",      verses: 7,   page: 1,   juz: 1,  hizb: 1,  type: "meccan" },
  { number: 2,   nameAr: "البقرة",        nameEn: "Al-Baqarah",      verses: 286, page: 1,   juz: 1,  hizb: 1,  type: "medinan" },
  { number: 3,   nameAr: "آل عمران",      nameEn: "Ali Imran",       verses: 200, page: 43,  juz: 3,  hizb: 6,  type: "medinan" },
  { number: 4,   nameAr: "النساء",        nameEn: "An-Nisa",         verses: 176, page: 64,  juz: 4,  hizb: 8,  type: "medinan" },
  { number: 5,   nameAr: "المائدة",       nameEn: "Al-Maidah",       verses: 120, page: 86,  juz: 6,  hizb: 11, type: "medinan" },
  { number: 6,   nameAr: "الأنعام",       nameEn: "Al-Anam",         verses: 165, page: 102, juz: 7,  hizb: 14, type: "meccan" },
  { number: 7,   nameAr: "الأعراف",       nameEn: "Al-Araf",         verses: 206, page: 120, juz: 8,  hizb: 15, type: "meccan" },
  { number: 8,   nameAr: "الأنفال",       nameEn: "Al-Anfal",        verses: 75,  page: 142, juz: 9,  hizb: 18, type: "medinan" },
  { number: 9,   nameAr: "التوبة",        nameEn: "At-Tawbah",       verses: 129, page: 150, juz: 10, hizb: 19, type: "medinan" },
  { number: 10,  nameAr: "يونس",          nameEn: "Yunus",           verses: 109, page: 168, juz: 11, hizb: 21, type: "meccan" },
  { number: 11,  nameAr: "هود",           nameEn: "Hud",             verses: 123, page: 178, juz: 11, hizb: 22, type: "meccan" },
  { number: 12,  nameAr: "يوسف",          nameEn: "Yusuf",           verses: 111, page: 189, juz: 12, hizb: 24, type: "meccan" },
  { number: 13,  nameAr: "الرعد",         nameEn: "Ar-Rad",          verses: 43,  page: 201, juz: 13, hizb: 25, type: "medinan" },
  { number: 14,  nameAr: "إبراهيم",       nameEn: "Ibrahim",         verses: 52,  page: 205, juz: 13, hizb: 26, type: "meccan" },
  { number: 15,  nameAr: "الحجر",         nameEn: "Al-Hijr",         verses: 99,  page: 211, juz: 14, hizb: 27, type: "meccan" },
  { number: 16,  nameAr: "النحل",         nameEn: "An-Nahl",         verses: 128, page: 215, juz: 14, hizb: 27, type: "meccan" },
  { number: 17,  nameAr: "الإسراء",       nameEn: "Al-Isra",         verses: 111, page: 227, juz: 15, hizb: 29, type: "meccan" },
  { number: 18,  nameAr: "الكهف",         nameEn: "Al-Kahf",         verses: 110, page: 235, juz: 15, hizb: 30, type: "meccan" },
  { number: 19,  nameAr: "مريم",          nameEn: "Maryam",          verses: 98,  page: 245, juz: 16, hizb: 31, type: "meccan" },
  { number: 20,  nameAr: "طه",            nameEn: "Ta-Ha",           verses: 135, page: 250, juz: 16, hizb: 32, type: "meccan" },
  { number: 21,  nameAr: "الأنبياء",      nameEn: "Al-Anbiya",       verses: 112, page: 258, juz: 17, hizb: 33, type: "meccan" },
  { number: 22,  nameAr: "الحج",          nameEn: "Al-Hajj",         verses: 78,  page: 266, juz: 17, hizb: 34, type: "medinan" },
  { number: 23,  nameAr: "المؤمنون",      nameEn: "Al-Muminun",      verses: 118, page: 274, juz: 18, hizb: 35, type: "meccan" },
  { number: 24,  nameAr: "النور",         nameEn: "An-Nur",          verses: 64,  page: 281, juz: 18, hizb: 36, type: "medinan" },
  { number: 25,  nameAr: "الفرقان",       nameEn: "Al-Furqan",       verses: 77,  page: 288, juz: 18, hizb: 36, type: "meccan" },
  { number: 26,  nameAr: "الشعراء",       nameEn: "Ash-Shuara",      verses: 227, page: 294, juz: 19, hizb: 37, type: "meccan" },
  { number: 27,  nameAr: "النمل",         nameEn: "An-Naml",         verses: 93,  page: 302, juz: 19, hizb: 38, type: "meccan" },
  { number: 28,  nameAr: "القصص",         nameEn: "Al-Qasas",        verses: 88,  page: 308, juz: 20, hizb: 39, type: "meccan" },
  { number: 29,  nameAr: "العنكبوت",      nameEn: "Al-Ankabut",      verses: 69,  page: 317, juz: 20, hizb: 40, type: "meccan" },
  { number: 30,  nameAr: "الروم",         nameEn: "Ar-Rum",          verses: 60,  page: 323, juz: 21, hizb: 41, type: "meccan" },
  { number: 31,  nameAr: "لقمان",         nameEn: "Luqman",          verses: 34,  page: 329, juz: 21, hizb: 42, type: "meccan" },
  { number: 32,  nameAr: "السجدة",        nameEn: "As-Sajdah",       verses: 30,  page: 332, juz: 21, hizb: 42, type: "meccan" },
  { number: 33,  nameAr: "الأحزاب",       nameEn: "Al-Ahzab",        verses: 73,  page: 335, juz: 21, hizb: 42, type: "medinan" },
  { number: 34,  nameAr: "سبأ",           nameEn: "Saba",            verses: 54,  page: 342, juz: 22, hizb: 43, type: "meccan" },
  { number: 35,  nameAr: "فاطر",          nameEn: "Fatir",           verses: 45,  page: 347, juz: 22, hizb: 44, type: "meccan" },
  { number: 36,  nameAr: "يس",            nameEn: "Ya-Sin",          verses: 83,  page: 352, juz: 22, hizb: 44, type: "meccan" },
  { number: 37,  nameAr: "الصافات",       nameEn: "As-Saffat",       verses: 182, page: 357, juz: 23, hizb: 45, type: "meccan" },
  { number: 38,  nameAr: "ص",             nameEn: "Sad",             verses: 88,  page: 362, juz: 23, hizb: 46, type: "meccan" },
  { number: 39,  nameAr: "الزمر",         nameEn: "Az-Zumar",        verses: 75,  page: 366, juz: 23, hizb: 46, type: "meccan" },
  { number: 40,  nameAr: "غافر",          nameEn: "Ghafir",          verses: 85,  page: 373, juz: 24, hizb: 47, type: "meccan" },
  { number: 41,  nameAr: "فصلت",          nameEn: "Fussilat",        verses: 54,  page: 381, juz: 24, hizb: 48, type: "meccan" },
  { number: 42,  nameAr: "الشورى",        nameEn: "Ash-Shura",       verses: 53,  page: 386, juz: 25, hizb: 49, type: "meccan" },
  { number: 43,  nameAr: "الزخرف",        nameEn: "Az-Zukhruf",      verses: 89,  page: 391, juz: 25, hizb: 49, type: "meccan" },
  { number: 44,  nameAr: "الدخان",        nameEn: "Ad-Dukhan",       verses: 59,  page: 396, juz: 25, hizb: 50, type: "meccan" },
  { number: 45,  nameAr: "الجاثية",       nameEn: "Al-Jathiyah",     verses: 37,  page: 399, juz: 25, hizb: 50, type: "meccan" },
  { number: 46,  nameAr: "الأحقاف",       nameEn: "Al-Ahqaf",        verses: 35,  page: 401, juz: 26, hizb: 51, type: "meccan" },
  { number: 47,  nameAr: "محمد",          nameEn: "Muhammad",        verses: 38,  page: 405, juz: 26, hizb: 51, type: "medinan" },
  { number: 48,  nameAr: "الفتح",         nameEn: "Al-Fath",         verses: 29,  page: 408, juz: 26, hizb: 52, type: "medinan" },
  { number: 49,  nameAr: "الحجرات",       nameEn: "Al-Hujurat",      verses: 18,  page: 411, juz: 26, hizb: 52, type: "medinan" },
  { number: 50,  nameAr: "ق",             nameEn: "Qaf",             verses: 45,  page: 414, juz: 26, hizb: 52, type: "meccan" },
  { number: 51,  nameAr: "الذاريات",      nameEn: "Adh-Dhariyat",    verses: 60,  page: 415, juz: 26, hizb: 52, type: "meccan" },
  { number: 52,  nameAr: "الطور",         nameEn: "At-Tur",          verses: 49,  page: 418, juz: 27, hizb: 53, type: "meccan" },
  { number: 53,  nameAr: "النجم",         nameEn: "An-Najm",         verses: 62,  page: 420, juz: 27, hizb: 53, type: "meccan" },
  { number: 54,  nameAr: "القمر",         nameEn: "Al-Qamar",        verses: 55,  page: 422, juz: 27, hizb: 54, type: "meccan" },
  { number: 55,  nameAr: "الرحمن",        nameEn: "Ar-Rahman",       verses: 78,  page: 424, juz: 27, hizb: 54, type: "medinan" },
  { number: 56,  nameAr: "الواقعة",       nameEn: "Al-Waqiah",       verses: 96,  page: 427, juz: 27, hizb: 54, type: "meccan" },
  { number: 57,  nameAr: "الحديد",        nameEn: "Al-Hadid",        verses: 29,  page: 429, juz: 27, hizb: 54, type: "medinan" },
  { number: 58,  nameAr: "المجادلة",      nameEn: "Al-Mujadila",     verses: 22,  page: 433, juz: 28, hizb: 55, type: "medinan" },
  { number: 59,  nameAr: "الحشر",         nameEn: "Al-Hashr",        verses: 24,  page: 435, juz: 28, hizb: 55, type: "medinan" },
  { number: 60,  nameAr: "الممتحنة",      nameEn: "Al-Mumtahanah",   verses: 13,  page: 438, juz: 28, hizb: 56, type: "medinan" },
  { number: 61,  nameAr: "الصف",          nameEn: "As-Saf",          verses: 14,  page: 440, juz: 28, hizb: 56, type: "medinan" },
  { number: 62,  nameAr: "الجمعة",        nameEn: "Al-Jumuah",       verses: 11,  page: 442, juz: 28, hizb: 56, type: "medinan" },
  { number: 63,  nameAr: "المنافقون",     nameEn: "Al-Munafiqun",    verses: 11,  page: 442, juz: 28, hizb: 56, type: "medinan" },
  { number: 64,  nameAr: "التغابن",       nameEn: "At-Taghabun",     verses: 18,  page: 444, juz: 28, hizb: 56, type: "medinan" },
  { number: 65,  nameAr: "الطلاق",        nameEn: "At-Talaq",        verses: 12,  page: 446, juz: 28, hizb: 56, type: "medinan" },
  { number: 66,  nameAr: "التحريم",       nameEn: "At-Tahrim",       verses: 12,  page: 447, juz: 28, hizb: 56, type: "medinan" },
  { number: 67,  nameAr: "الملك",         nameEn: "Al-Mulk",         verses: 30,  page: 449, juz: 29, hizb: 57, type: "meccan" },
  { number: 68,  nameAr: "القلم",         nameEn: "Al-Qalam",        verses: 52,  page: 450, juz: 29, hizb: 57, type: "meccan" },
  { number: 69,  nameAr: "الحاقة",        nameEn: "Al-Haqqah",       verses: 52,  page: 452, juz: 29, hizb: 58, type: "meccan" },
  { number: 70,  nameAr: "المعارج",       nameEn: "Al-Maarij",       verses: 44,  page: 453, juz: 29, hizb: 58, type: "meccan" },
  { number: 71,  nameAr: "نوح",           nameEn: "Nuh",             verses: 28,  page: 455, juz: 29, hizb: 58, type: "meccan" },
  { number: 72,  nameAr: "الجن",          nameEn: "Al-Jinn",         verses: 28,  page: 457, juz: 29, hizb: 58, type: "meccan" },
  { number: 73,  nameAr: "المزمل",        nameEn: "Al-Muzzammil",    verses: 20,  page: 458, juz: 29, hizb: 58, type: "meccan" },
  { number: 74,  nameAr: "المدثر",        nameEn: "Al-Muddaththir",  verses: 56,  page: 459, juz: 29, hizb: 58, type: "meccan" },
  { number: 75,  nameAr: "القيامة",       nameEn: "Al-Qiyamah",      verses: 40,  page: 461, juz: 29, hizb: 58, type: "meccan" },
  { number: 76,  nameAr: "الإنسان",       nameEn: "Al-Insan",        verses: 31,  page: 461, juz: 29, hizb: 58, type: "medinan" },
  { number: 77,  nameAr: "المرسلات",      nameEn: "Al-Mursalat",     verses: 50,  page: 463, juz: 29, hizb: 58, type: "meccan" },
  { number: 78,  nameAr: "النبأ",         nameEn: "An-Naba",         verses: 40,  page: 464, juz: 30, hizb: 59, type: "meccan" },
  { number: 79,  nameAr: "النازعات",      nameEn: "An-Naziat",       verses: 46,  page: 465, juz: 30, hizb: 59, type: "meccan" },
  { number: 80,  nameAr: "عبس",           nameEn: "Abasa",           verses: 42,  page: 467, juz: 30, hizb: 60, type: "meccan" },
  { number: 81,  nameAr: "التكوير",       nameEn: "At-Takwir",       verses: 29,  page: 468, juz: 30, hizb: 60, type: "meccan" },
  { number: 82,  nameAr: "الانفطار",      nameEn: "Al-Infitar",      verses: 19,  page: 468, juz: 30, hizb: 60, type: "meccan" },
  { number: 83,  nameAr: "المطففين",      nameEn: "Al-Mutaffifin",   verses: 36,  page: 468, juz: 30, hizb: 60, type: "meccan" },
  { number: 84,  nameAr: "الانشقاق",      nameEn: "Al-Inshiqaq",     verses: 25,  page: 470, juz: 30, hizb: 60, type: "meccan" },
  { number: 85,  nameAr: "البروج",        nameEn: "Al-Buruj",        verses: 22,  page: 471, juz: 30, hizb: 60, type: "meccan" },
  { number: 86,  nameAr: "الطارق",        nameEn: "At-Tariq",        verses: 17,  page: 472, juz: 30, hizb: 60, type: "meccan" },
  { number: 87,  nameAr: "الأعلى",        nameEn: "Al-Ala",          verses: 19,  page: 472, juz: 30, hizb: 60, type: "meccan" },
  { number: 88,  nameAr: "الغاشية",       nameEn: "Al-Ghashiyah",    verses: 26,  page: 473, juz: 30, hizb: 60, type: "meccan" },
  { number: 89,  nameAr: "الفجر",         nameEn: "Al-Fajr",         verses: 30,  page: 474, juz: 30, hizb: 60, type: "meccan" },
  { number: 90,  nameAr: "البلد",         nameEn: "Al-Balad",        verses: 20,  page: 475, juz: 30, hizb: 60, type: "meccan" },
  { number: 91,  nameAr: "الشمس",         nameEn: "Ash-Shams",       verses: 15,  page: 475, juz: 30, hizb: 60, type: "meccan" },
  { number: 92,  nameAr: "الليل",         nameEn: "Al-Layl",         verses: 21,  page: 475, juz: 30, hizb: 60, type: "meccan" },
  { number: 93,  nameAr: "الضحى",         nameEn: "Ad-Duha",         verses: 11,  page: 476, juz: 30, hizb: 60, type: "meccan" },
  { number: 94,  nameAr: "الشرح",         nameEn: "Ash-Sharh",       verses: 8,   page: 476, juz: 30, hizb: 60, type: "meccan" },
  { number: 95,  nameAr: "التين",         nameEn: "At-Tin",          verses: 8,   page: 477, juz: 30, hizb: 60, type: "meccan" },
  { number: 96,  nameAr: "العلق",         nameEn: "Al-Alaq",         verses: 19,  page: 477, juz: 30, hizb: 60, type: "meccan" },
  { number: 97,  nameAr: "القدر",         nameEn: "Al-Qadr",         verses: 5,   page: 478, juz: 30, hizb: 60, type: "meccan" },
  { number: 98,  nameAr: "البينة",        nameEn: "Al-Bayyinah",     verses: 8,   page: 478, juz: 30, hizb: 60, type: "medinan" },
  { number: 99,  nameAr: "الزلزلة",      nameEn: "Az-Zalzalah",     verses: 8,   page: 478, juz: 30, hizb: 60, type: "medinan" },
  { number: 100, nameAr: "العاديات",      nameEn: "Al-Adiyat",       verses: 11,  page: 478, juz: 30, hizb: 60, type: "meccan" },
  { number: 101, nameAr: "القارعة",       nameEn: "Al-Qariah",       verses: 11,  page: 479, juz: 30, hizb: 60, type: "meccan" },
  { number: 102, nameAr: "التكاثر",       nameEn: "At-Takathur",     verses: 8,   page: 479, juz: 30, hizb: 60, type: "meccan" },
  { number: 103, nameAr: "العصر",         nameEn: "Al-Asr",          verses: 3,   page: 480, juz: 30, hizb: 60, type: "meccan" },
  { number: 104, nameAr: "الهمزة",        nameEn: "Al-Humazah",      verses: 9,   page: 480, juz: 30, hizb: 60, type: "meccan" },
  { number: 105, nameAr: "الفيل",         nameEn: "Al-Fil",          verses: 5,   page: 480, juz: 30, hizb: 60, type: "meccan" },
  { number: 106, nameAr: "قريش",          nameEn: "Quraysh",         verses: 4,   page: 481, juz: 30, hizb: 60, type: "meccan" },
  { number: 107, nameAr: "الماعون",       nameEn: "Al-Maun",         verses: 7,   page: 481, juz: 30, hizb: 60, type: "meccan" },
  { number: 108, nameAr: "الكوثر",        nameEn: "Al-Kawthar",      verses: 3,   page: 481, juz: 30, hizb: 60, type: "meccan" },
  { number: 109, nameAr: "الكافرون",      nameEn: "Al-Kafirun",      verses: 6,   page: 481, juz: 30, hizb: 60, type: "meccan" },
  { number: 110, nameAr: "النصر",         nameEn: "An-Nasr",         verses: 3,   page: 482, juz: 30, hizb: 60, type: "medinan" },
  { number: 111, nameAr: "المسد",         nameEn: "Al-Masad",        verses: 5,   page: 482, juz: 30, hizb: 60, type: "meccan" },
  { number: 112, nameAr: "الإخلاص",       nameEn: "Al-Ikhlas",       verses: 4,   page: 482, juz: 30, hizb: 60, type: "meccan" },
  { number: 113, nameAr: "الفلق",         nameEn: "Al-Falaq",        verses: 5,   page: 482, juz: 30, hizb: 60, type: "meccan" },
  { number: 114, nameAr: "الناس",         nameEn: "An-Nas",          verses: 6,   page: 482, juz: 30, hizb: 60, type: "meccan" },
];

export function getSurahsForPage(page: number): Surah[] {
  let result: Surah | undefined;
  for (let i = SURAHS.length - 1; i >= 0; i--) {
    if (SURAHS[i].page <= page) {
      result = SURAHS[i];
      break;
    }
  }
  if (!result) return [SURAHS[0]];
  const same: Surah[] = SURAHS.filter((s) => s.page === page);
  if (same.length > 0) return same;
  return [result];
}

export function getJuzForPage(page: number): number {
  // Juz boundaries for this 482-page Warsh mushaf (calibrated)
  const JUZ_PAGES = [
    1,  18,  36,  52,  64,  79,  94, 108, 122, 136,
    150, 162, 173, 184, 196, 206, 218, 228, 240, 250,
    260, 271, 281, 292, 302, 312, 323, 334, 344, 355,
    420
  ];
  let juz = 1;
  for (let i = 0; i < JUZ_PAGES.length; i++) {
    if (page >= JUZ_PAGES[i]) juz = i + 1;
  }
  return Math.min(30, juz);
}

export function getHizbForPage(page: number): number {
  return Math.min(60, Math.max(1, Math.ceil(page / (TOTAL_PAGES / 60))));
}

export const TOTAL_PAGES = 482;
