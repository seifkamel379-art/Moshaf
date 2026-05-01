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
- `artifacts/mushaf/data/pages.ts` — Static require() map for 482 PDF page images (p001-p482.jpg)
- `artifacts/mushaf/assets/pages/` — 482 JPEG images extracted from PDF at 1.8x zoom
- `artifacts/mushaf/context/AppContext.tsx` — Global state (brightness, fontSize, isDark, bookmarks, khatmaPlan)
- `artifacts/mushaf/components/AppOverlay.tsx` — Brightness dim overlay

### Architecture Notes
- **Page images**: All 482 pages extracted from PDF at 1.8x JPEG 88% (~124MB total)
- **Surah page numbers**: Calibrated by visual inspection of key pages (p1, p43, p120, p168, p440, p470, p474, p482) + piecewise linear interpolation
- **Page order in FlatList**: [1, 2, ..., 482] with initialScrollIndex=currentPage-1
- **No emojis, no stars** anywhere in the app
- **Fonts**: Cairo + Amiri from @expo-google-fonts
- **No opacity slider** — brightness only controls AppOverlay dim amount
