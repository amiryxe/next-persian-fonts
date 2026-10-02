# Next Persian Fonts · فونت‌های فارسی برای Next.js

[![npm](https://img.shields.io/npm/v/next-persian-fonts)](https://www.npmjs.com/package/next-persian-fonts)
[![CI](https://github.com/amiryxe/next-persian-fonts/actions/workflows/ci.yml/badge.svg)](https://github.com/amiryxe/next-persian-fonts/actions/workflows/ci.yml)
[![Demo](https://img.shields.io/badge/demo-GitHub%20Pages-10b981)](https://amiryxe.github.io/next-persian-fonts/)

Free Persian (Farsi) fonts for Next.js, self-hosted through `next/font/local`, with TypeScript types.
Includes Vazirmatn, Estedad, Sahel, Samim, Shabnam, Mikhak, Parastoo, Gandom, Tanha, Vazir Code, Behdad and Nika.

**👉 Package docs (English + فارسی): [src/next-persian-fonts/README.md](./src/next-persian-fonts/README.md)**
**👉 Live demo & font gallery: https://amiryxe.github.io/next-persian-fonts/**

```bash
npm install next-persian-fonts
```

```tsx
import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'

<html lang="fa" dir="rtl" className={vazirmatnVariable.className}>
```

<div dir="rtl">

مجموعه‌ای از فونت‌های فارسی آزاد برای Next.js که با `next/font/local` روی سایت خودتان میزبانی می‌شوند. راهنمای کامل فارسی در [README پکیج](./src/next-persian-fonts/README.md#فارسی) است.

</div>

## Repository layout

```
src/next-persian-fonts/   ← the npm package (published as-is, no build step)
  fonts.json              ← source of truth: fonts, versions, files, licenses
  <subpath>/              ← one folder per import path: index.js, index.d.ts, *.woff2, OFL.txt/LICENSE.txt
  FONTS.md                ← generated table of fonts, versions and licenses
src/app, src/components   ← demo/docs site (Next.js 16, Tailwind 4, static export to GitHub Pages)
scripts/                  ← generate / update / verify / smoke-test / screenshot scripts
```

The root `package.json` is a private npm workspace that contains the package, so the demo imports
`next-persian-fonts/...` exactly like a real app would. The package itself keeps the same folder
and the same published layout as 1.0.x.

## Development

```bash
npm install                 # installs the demo and links the package workspace
npm run dev                 # demo at http://localhost:3000/next-persian-fonts/
npm run build               # static export into ./out
npm start                   # serves ./out at http://localhost:4173/next-persian-fonts/ (same base path as Pages)

npm run verify              # generated files in sync, fonts valid, pack contents, types (bundler/node16/node10)
npm run test:smoke          # builds a test app with the packed tarball on Next 13.5, 14, 15, 16 (webpack + Turbopack)
npm run lint
```

### Adding or updating a font

1. Edit `src/next-persian-fonts/fonts.json`: bump `version` and `ref` (a tag or commit SHA) or add a new family/variant (only redistributable licenses!).
2. `npm run fonts:update` downloads the font files and license texts from upstream (`--only <id>` for one family).
3. `npm run fonts:generate` regenerates `index.js`, `index.d.ts`, the `exports` map and `FONTS.md`.
4. Add the new export to `src/lib/fonts.ts` (the demo), then `npm run verify && npm run test:smoke`.

`npm run fonts:check-upstream` compares the pinned versions with the latest upstream GitHub releases.

### Releasing

```bash
npm run verify && npm run test:smoke
cd src/next-persian-fonts && npm publish        # publishes the package folder only
git tag v1.1.0 && git push origin main --tags   # pushing main also deploys the demo to Pages
```

## License

Code: ISC. Fonts: their own upstream licenses (mostly SIL OFL 1.1). See [LICENSE.md](./src/next-persian-fonts/LICENSE.md) and [FONTS.md](./src/next-persian-fonts/FONTS.md).
