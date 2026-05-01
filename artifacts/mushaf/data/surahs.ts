export interface Surah {
  number: number;
  name: string;
  nameAr: string;
  verses: number;
  page: number;
  juz: number;
  hizb: number;
  type: "meccan" | "medinan";
}

export const SURAHS: Surah[] = [
  { number: 1, name: "Al-Fatihah", nameAr: "الفاتحة", verses: 7, page: 1, juz: 1, hizb: 1, type: "meccan" },
  { number: 2, name: "Al-Baqarah", nameAr: "البقرة", verses: 286, page: 2, juz: 1, hizb: 1, type: "medinan" },
  { number: 3, name: "Ali 'Imran", nameAr: "آل عمران", verses: 200, page: 50, juz: 3, hizb: 6, type: "medinan" },
  { number: 4, name: "An-Nisa", nameAr: "النساء", verses: 176, page: 77, juz: 4, hizb: 8, type: "medinan" },
  { number: 5, name: "Al-Ma'idah", nameAr: "المائدة", verses: 120, page: 106, juz: 6, hizb: 11, type: "medinan" },
  { number: 6, name: "Al-An'am", nameAr: "الأنعام", verses: 165, page: 128, juz: 7, hizb: 14, type: "meccan" },
  { number: 7, name: "Al-A'raf", nameAr: "الأعراف", verses: 206, page: 151, juz: 8, hizb: 16, type: "meccan" },
  { number: 8, name: "Al-Anfal", nameAr: "الأنفال", verses: 75, page: 177, juz: 9, hizb: 18, type: "medinan" },
  { number: 9, name: "At-Tawbah", nameAr: "التوبة", verses: 129, page: 187, juz: 10, hizb: 19, type: "medinan" },
  { number: 10, name: "Yunus", nameAr: "يونس", verses: 109, page: 208, juz: 11, hizb: 21, type: "meccan" },
  { number: 11, name: "Hud", nameAr: "هود", verses: 123, page: 221, juz: 11, hizb: 22, type: "meccan" },
  { number: 12, name: "Yusuf", nameAr: "يوسف", verses: 111, page: 235, juz: 12, hizb: 24, type: "meccan" },
  { number: 13, name: "Ar-Ra'd", nameAr: "الرعد", verses: 43, page: 249, juz: 13, hizb: 25, type: "medinan" },
  { number: 14, name: "Ibrahim", nameAr: "إبراهيم", verses: 52, page: 255, juz: 13, hizb: 26, type: "meccan" },
  { number: 15, name: "Al-Hijr", nameAr: "الحجر", verses: 99, page: 262, juz: 14, hizb: 27, type: "meccan" },
  { number: 16, name: "An-Nahl", nameAr: "النحل", verses: 128, page: 267, juz: 14, hizb: 27, type: "meccan" },
  { number: 17, name: "Al-Isra", nameAr: "الإسراء", verses: 111, page: 282, juz: 15, hizb: 29, type: "meccan" },
  { number: 18, name: "Al-Kahf", nameAr: "الكهف", verses: 110, page: 293, juz: 15, hizb: 30, type: "meccan" },
  { number: 19, name: "Maryam", nameAr: "مريم", verses: 98, page: 305, juz: 16, hizb: 31, type: "meccan" },
  { number: 20, name: "Ta-Ha", nameAr: "طه", verses: 135, page: 312, juz: 16, hizb: 32, type: "meccan" },
  { number: 21, name: "Al-Anbiya", nameAr: "الأنبياء", verses: 112, page: 322, juz: 17, hizb: 33, type: "meccan" },
  { number: 22, name: "Al-Hajj", nameAr: "الحج", verses: 78, page: 332, juz: 17, hizb: 34, type: "medinan" },
  { number: 23, name: "Al-Mu'minun", nameAr: "المؤمنون", verses: 118, page: 342, juz: 18, hizb: 35, type: "meccan" },
  { number: 24, name: "An-Nur", nameAr: "النور", verses: 64, page: 350, juz: 18, hizb: 36, type: "medinan" },
  { number: 25, name: "Al-Furqan", nameAr: "الفرقان", verses: 77, page: 359, juz: 18, hizb: 36, type: "meccan" },
  { number: 26, name: "Ash-Shu'ara", nameAr: "الشعراء", verses: 227, page: 367, juz: 19, hizb: 37, type: "meccan" },
  { number: 27, name: "An-Naml", nameAr: "النمل", verses: 93, page: 377, juz: 19, hizb: 38, type: "meccan" },
  { number: 28, name: "Al-Qasas", nameAr: "القصص", verses: 88, page: 385, juz: 20, hizb: 39, type: "meccan" },
  { number: 29, name: "Al-'Ankabut", nameAr: "العنكبوت", verses: 69, page: 396, juz: 20, hizb: 40, type: "meccan" },
  { number: 30, name: "Ar-Rum", nameAr: "الروم", verses: 60, page: 404, juz: 21, hizb: 41, type: "meccan" },
  { number: 31, name: "Luqman", nameAr: "لقمان", verses: 34, page: 411, juz: 21, hizb: 42, type: "meccan" },
  { number: 32, name: "As-Sajdah", nameAr: "السجدة", verses: 30, page: 415, juz: 21, hizb: 42, type: "meccan" },
  { number: 33, name: "Al-Ahzab", nameAr: "الأحزاب", verses: 73, page: 418, juz: 21, hizb: 42, type: "medinan" },
  { number: 34, name: "Saba", nameAr: "سبأ", verses: 54, page: 428, juz: 22, hizb: 43, type: "meccan" },
  { number: 35, name: "Fatir", nameAr: "فاطر", verses: 45, page: 434, juz: 22, hizb: 44, type: "meccan" },
  { number: 36, name: "Ya-Sin", nameAr: "يس", verses: 83, page: 440, juz: 22, hizb: 44, type: "meccan" },
  { number: 37, name: "As-Saffat", nameAr: "الصافات", verses: 182, page: 446, juz: 23, hizb: 45, type: "meccan" },
  { number: 38, name: "Sad", nameAr: "ص", verses: 88, page: 453, juz: 23, hizb: 46, type: "meccan" },
  { number: 39, name: "Az-Zumar", nameAr: "الزمر", verses: 75, page: 458, juz: 23, hizb: 46, type: "meccan" },
  { number: 40, name: "Ghafir", nameAr: "غافر", verses: 85, page: 467, juz: 24, hizb: 47, type: "meccan" },
  { number: 41, name: "Fussilat", nameAr: "فصلت", verses: 54, page: 477, juz: 24, hizb: 48, type: "meccan" },
  { number: 42, name: "Ash-Shura", nameAr: "الشورى", verses: 53, page: 483, juz: 25, hizb: 49, type: "meccan" },
  { number: 43, name: "Az-Zukhruf", nameAr: "الزخرف", verses: 89, page: 489, juz: 25, hizb: 49, type: "meccan" },
  { number: 44, name: "Ad-Dukhan", nameAr: "الدخان", verses: 59, page: 496, juz: 25, hizb: 50, type: "meccan" },
  { number: 45, name: "Al-Jathiyah", nameAr: "الجاثية", verses: 37, page: 499, juz: 25, hizb: 50, type: "meccan" },
  { number: 46, name: "Al-Ahqaf", nameAr: "الأحقاف", verses: 35, page: 502, juz: 26, hizb: 51, type: "meccan" },
  { number: 47, name: "Muhammad", nameAr: "محمد", verses: 38, page: 507, juz: 26, hizb: 51, type: "medinan" },
  { number: 48, name: "Al-Fath", nameAr: "الفتح", verses: 29, page: 511, juz: 26, hizb: 52, type: "medinan" },
  { number: 49, name: "Al-Hujurat", nameAr: "الحجرات", verses: 18, page: 515, juz: 26, hizb: 52, type: "medinan" },
  { number: 50, name: "Qaf", nameAr: "ق", verses: 45, page: 518, juz: 26, hizb: 52, type: "meccan" },
  { number: 51, name: "Adh-Dhariyat", nameAr: "الذاريات", verses: 60, page: 520, juz: 26, hizb: 52, type: "meccan" },
  { number: 52, name: "At-Tur", nameAr: "الطور", verses: 49, page: 523, juz: 27, hizb: 53, type: "meccan" },
  { number: 53, name: "An-Najm", nameAr: "النجم", verses: 62, page: 526, juz: 27, hizb: 53, type: "meccan" },
  { number: 54, name: "Al-Qamar", nameAr: "القمر", verses: 55, page: 528, juz: 27, hizb: 54, type: "meccan" },
  { number: 55, name: "Ar-Rahman", nameAr: "الرحمن", verses: 78, page: 531, juz: 27, hizb: 54, type: "medinan" },
  { number: 56, name: "Al-Waqi'ah", nameAr: "الواقعة", verses: 96, page: 534, juz: 27, hizb: 54, type: "meccan" },
  { number: 57, name: "Al-Hadid", nameAr: "الحديد", verses: 29, page: 537, juz: 27, hizb: 54, type: "medinan" },
  { number: 58, name: "Al-Mujadila", nameAr: "المجادلة", verses: 22, page: 542, juz: 28, hizb: 55, type: "medinan" },
  { number: 59, name: "Al-Hashr", nameAr: "الحشر", verses: 24, page: 545, juz: 28, hizb: 55, type: "medinan" },
  { number: 60, name: "Al-Mumtahanah", nameAr: "الممتحنة", verses: 13, page: 549, juz: 28, hizb: 56, type: "medinan" },
  { number: 61, name: "As-Saf", nameAr: "الصف", verses: 14, page: 551, juz: 28, hizb: 56, type: "medinan" },
  { number: 62, name: "Al-Jumu'ah", nameAr: "الجمعة", verses: 11, page: 553, juz: 28, hizb: 56, type: "medinan" },
  { number: 63, name: "Al-Munafiqun", nameAr: "المنافقون", verses: 11, page: 554, juz: 28, hizb: 56, type: "medinan" },
  { number: 64, name: "At-Taghabun", nameAr: "التغابن", verses: 18, page: 556, juz: 28, hizb: 56, type: "medinan" },
  { number: 65, name: "At-Talaq", nameAr: "الطلاق", verses: 12, page: 558, juz: 28, hizb: 56, type: "medinan" },
  { number: 66, name: "At-Tahrim", nameAr: "التحريم", verses: 12, page: 560, juz: 28, hizb: 56, type: "medinan" },
  { number: 67, name: "Al-Mulk", nameAr: "الملك", verses: 30, page: 562, juz: 29, hizb: 57, type: "meccan" },
  { number: 68, name: "Al-Qalam", nameAr: "القلم", verses: 52, page: 564, juz: 29, hizb: 57, type: "meccan" },
  { number: 69, name: "Al-Haqqah", nameAr: "الحاقة", verses: 52, page: 566, juz: 29, hizb: 58, type: "meccan" },
  { number: 70, name: "Al-Ma'arij", nameAr: "المعارج", verses: 44, page: 568, juz: 29, hizb: 58, type: "meccan" },
  { number: 71, name: "Nuh", nameAr: "نوح", verses: 28, page: 570, juz: 29, hizb: 58, type: "meccan" },
  { number: 72, name: "Al-Jinn", nameAr: "الجن", verses: 28, page: 572, juz: 29, hizb: 58, type: "meccan" },
  { number: 73, name: "Al-Muzzammil", nameAr: "المزمل", verses: 20, page: 574, juz: 29, hizb: 58, type: "meccan" },
  { number: 74, name: "Al-Muddaththir", nameAr: "المدثر", verses: 56, page: 575, juz: 29, hizb: 58, type: "meccan" },
  { number: 75, name: "Al-Qiyamah", nameAr: "القيامة", verses: 40, page: 577, juz: 29, hizb: 58, type: "meccan" },
  { number: 76, name: "Al-Insan", nameAr: "الإنسان", verses: 31, page: 578, juz: 29, hizb: 58, type: "medinan" },
  { number: 77, name: "Al-Mursalat", nameAr: "المرسلات", verses: 50, page: 580, juz: 29, hizb: 58, type: "meccan" },
  { number: 78, name: "An-Naba", nameAr: "النبأ", verses: 40, page: 582, juz: 30, hizb: 59, type: "meccan" },
  { number: 79, name: "An-Nazi'at", nameAr: "النازعات", verses: 46, page: 583, juz: 30, hizb: 59, type: "meccan" },
  { number: 80, name: "'Abasa", nameAr: "عبس", verses: 42, page: 585, juz: 30, hizb: 60, type: "meccan" },
  { number: 81, name: "At-Takwir", nameAr: "التكوير", verses: 29, page: 586, juz: 30, hizb: 60, type: "meccan" },
  { number: 82, name: "Al-Infitar", nameAr: "الانفطار", verses: 19, page: 587, juz: 30, hizb: 60, type: "meccan" },
  { number: 83, name: "Al-Mutaffifin", nameAr: "المطففين", verses: 36, page: 587, juz: 30, hizb: 60, type: "meccan" },
  { number: 84, name: "Al-Inshiqaq", nameAr: "الانشقاق", verses: 25, page: 589, juz: 30, hizb: 60, type: "meccan" },
  { number: 85, name: "Al-Buruj", nameAr: "البروج", verses: 22, page: 590, juz: 30, hizb: 60, type: "meccan" },
  { number: 86, name: "At-Tariq", nameAr: "الطارق", verses: 17, page: 591, juz: 30, hizb: 60, type: "meccan" },
  { number: 87, name: "Al-A'la", nameAr: "الأعلى", verses: 19, page: 591, juz: 30, hizb: 60, type: "meccan" },
  { number: 88, name: "Al-Ghashiyah", nameAr: "الغاشية", verses: 26, page: 592, juz: 30, hizb: 60, type: "meccan" },
  { number: 89, name: "Al-Fajr", nameAr: "الفجر", verses: 30, page: 593, juz: 30, hizb: 60, type: "meccan" },
  { number: 90, name: "Al-Balad", nameAr: "البلد", verses: 20, page: 594, juz: 30, hizb: 60, type: "meccan" },
  { number: 91, name: "Ash-Shams", nameAr: "الشمس", verses: 15, page: 595, juz: 30, hizb: 60, type: "meccan" },
  { number: 92, name: "Al-Layl", nameAr: "الليل", verses: 21, page: 595, juz: 30, hizb: 60, type: "meccan" },
  { number: 93, name: "Ad-Duha", nameAr: "الضحى", verses: 11, page: 596, juz: 30, hizb: 60, type: "meccan" },
  { number: 94, name: "Ash-Sharh", nameAr: "الشرح", verses: 8, page: 596, juz: 30, hizb: 60, type: "meccan" },
  { number: 95, name: "At-Tin", nameAr: "التين", verses: 8, page: 597, juz: 30, hizb: 60, type: "meccan" },
  { number: 96, name: "Al-'Alaq", nameAr: "العلق", verses: 19, page: 597, juz: 30, hizb: 60, type: "meccan" },
  { number: 97, name: "Al-Qadr", nameAr: "القدر", verses: 5, page: 598, juz: 30, hizb: 60, type: "meccan" },
  { number: 98, name: "Al-Bayyinah", nameAr: "البينة", verses: 8, page: 598, juz: 30, hizb: 60, type: "medinan" },
  { number: 99, name: "Az-Zalzalah", nameAr: "الزلزلة", verses: 8, page: 599, juz: 30, hizb: 60, type: "medinan" },
  { number: 100, name: "Al-'Adiyat", nameAr: "العاديات", verses: 11, page: 599, juz: 30, hizb: 60, type: "meccan" },
  { number: 101, name: "Al-Qari'ah", nameAr: "القارعة", verses: 11, page: 600, juz: 30, hizb: 60, type: "meccan" },
  { number: 102, name: "At-Takathur", nameAr: "التكاثر", verses: 8, page: 600, juz: 30, hizb: 60, type: "meccan" },
  { number: 103, name: "Al-'Asr", nameAr: "العصر", verses: 3, page: 601, juz: 30, hizb: 60, type: "meccan" },
  { number: 104, name: "Al-Humazah", nameAr: "الهمزة", verses: 9, page: 601, juz: 30, hizb: 60, type: "meccan" },
  { number: 105, name: "Al-Fil", nameAr: "الفيل", verses: 5, page: 601, juz: 30, hizb: 60, type: "meccan" },
  { number: 106, name: "Quraysh", nameAr: "قريش", verses: 4, page: 602, juz: 30, hizb: 60, type: "meccan" },
  { number: 107, name: "Al-Ma'un", nameAr: "الماعون", verses: 7, page: 602, juz: 30, hizb: 60, type: "meccan" },
  { number: 108, name: "Al-Kawthar", nameAr: "الكوثر", verses: 3, page: 602, juz: 30, hizb: 60, type: "meccan" },
  { number: 109, name: "Al-Kafirun", nameAr: "الكافرون", verses: 6, page: 603, juz: 30, hizb: 60, type: "meccan" },
  { number: 110, name: "An-Nasr", nameAr: "النصر", verses: 3, page: 603, juz: 30, hizb: 60, type: "medinan" },
  { number: 111, name: "Al-Masad", nameAr: "المسد", verses: 5, page: 603, juz: 30, hizb: 60, type: "meccan" },
  { number: 112, name: "Al-Ikhlas", nameAr: "الإخلاص", verses: 4, page: 604, juz: 30, hizb: 60, type: "meccan" },
  { number: 113, name: "Al-Falaq", nameAr: "الفلق", verses: 5, page: 604, juz: 30, hizb: 60, type: "meccan" },
  { number: 114, name: "An-Nas", nameAr: "الناس", verses: 6, page: 604, juz: 30, hizb: 60, type: "meccan" },
];

export function getSurahsForPage(page: number): Surah[] {
  const result: Surah[] = [];
  for (let i = 0; i < SURAHS.length; i++) {
    const s = SURAHS[i];
    const nextPage = i + 1 < SURAHS.length ? SURAHS[i + 1].page : 605;
    if (s.page <= page && page < nextPage) {
      result.push(s);
    } else if (s.page === page) {
      if (!result.find((r) => r.number === s.number)) result.push(s);
    }
  }
  if (result.length === 0) {
    for (let i = SURAHS.length - 1; i >= 0; i--) {
      if (SURAHS[i].page <= page) {
        result.push(SURAHS[i]);
        break;
      }
    }
  }
  return result;
}

export function getJuzForPage(page: number): number {
  const juzPages = [1,22,42,62,82,102,122,142,162,182,202,222,242,262,282,302,322,342,362,382,402,422,442,462,482,502,522,542,562,582,602];
  let juz = 1;
  for (let i = 0; i < juzPages.length; i++) {
    if (page >= juzPages[i]) juz = i + 1;
  }
  return juz;
}

export function getHizbForPage(page: number): number {
  return Math.ceil(page / 10.05);
}

export const TOTAL_PAGES = 604;
