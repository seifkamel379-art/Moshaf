# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## المصحف المثمن — Expo Mobile App

**artifact dir**: `artifacts/mushaf`  
**package**: `@workspace/mushaf`

### App Description
Full offline Quran app: مصحف الشاذلي رحمه الله برواية ورش عن نافع, 482 pages.

### Key Files
- `artifacts/mushaf/app/(tabs)/mushaf.tsx` — Main Mushaf viewer with PDF page images, bookmarking, floating bar
- `artifacts/mushaf/app/(tabs)/index.tsx` — Fihrist (surah index) screen
- `artifacts/mushaf/app/(tabs)/settings.tsx` — Settings (fontSize, brightness, Khatma)
- `artifacts/mushaf/data/surahs.ts` — 114 surahs with calibrated page numbers for this mushaf
- `artifacts/mushaf/data/pages.ts` — Static require() map for 482 PDF page images (p001-p482.png)
- `artifacts/mushaf/assets/pages/` — 482 PNG images (transparent background, no JPG files)
- `artifacts/mushaf/context/AppContext.tsx` — Global state (brightness, fontSize, isDark, bookmarks, khatmaPlan)
- `artifacts/mushaf/components/AppOverlay.tsx` — Brightness dim overlay

### Architecture Notes
- **Page images**: All 482 pages extracted from PDF at 1.8x JPEG 88% (~124MB total)
- **Surah page numbers**: Verified via Python/PIL pixel-level separator detection + visual inspection. Confirmed corrections: المائدة 86→84, الصافات 357→356, الفتح 408→407. Mid-page starts confirmed: آل عمران p39, الأنفال p140, المائدة p84, الصافات p356, الفتح p407.
- **Page order in FlatList**: [1, 2, ..., 482] with initialScrollIndex=currentPage-1
- **White background removal**: `mixBlendMode: 'multiply'` on Image for light mode (web+native); web dark mode uses CSS `filter: invert(0.88) sepia(0.15) brightness(0.85)` + multiply
- **Fihris navigation**: `useFocusEffect` in mushaf.tsx scrolls FlatList to currentPage when screen gets focus; `isFocusScrolling` ref prevents double-update
- **Al-Fatiha excluded** from fihris display (surah.number !== 1)
- **Font size removed** from settings UI (slider deleted; context still has fontSize for compatibility)
- **Zoom control**: floating 🔍 button at right side of mushaf; tapping reveals +/%/- panel above it; zoom range 70%-200%
- **Fonts**: Cairo + Amiri from @expo-google-fonts
- **APK build**: `cd artifacts/mushaf && eas build --platform android --profile preview`
