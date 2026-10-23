# Changelog

## 1.5.0 (2026-10-23)

Nothing changes for existing imports: every existing export, CSS file and generated `next/font` call is the same as in 1.4.0.

### Added
- **Ganjnameh** (گنجنامه) by Mohammad Saleh Souzanchi (font-store/GanjnamehFont, v0.0.4), OFL-1.1, monoline modern Naskh, weight 400: `next-persian-fonts/ganjnameh` (`ganjnameh`), plus `css/ganjnameh.css`. Shipped as the author's unmodified WOFF2. Existing exports are unchanged.
- **Shahab** (شهاب) by Mohammad Saleh Souzanchi (font-store/ShahabFont, v0.0.2), OFL-1.1 (Reserved Font Name "Shahab"), display font, weight 400: `next-persian-fonts/shahab` (`shahab`), plus `css/shahab.css`. Shipped as the author's unmodified WOFF2. Existing exports are unchanged.
- **Nahid** (ناهید) by Saber Rastikerdar (rastikerdar/nahid-font, v0.3.0; upstream archived), Bitstream Vera + Public Domain + Apache-2.0 (Latin glyphs), weight 400: `next-persian-fonts/nahid` (`nahid`) and `nahid-fd` (`nahidFD`, Persian digits), plus `css/nahid.css` and `css/nahid-fd.css`. Shipped as the author's unmodified WOFF2. Existing exports are unchanged.
- **Normal Sans** (نرمال سنس) by Azad Qalam (AzadQalam/normal-sans, v1.0.0), OFL-1.1, variable font (wght 100–900): `next-persian-fonts/normal-sans` (`normalSans`), plus `css/normal-sans.css`. Shipped as the author's unmodified variable WOFF2. Existing exports are unchanged.
- **Ario** (آریو) by Mohamad Darvishi (MohamadDarvishi/Ario, v2.0.1), OFL-1.1, headline/display font, weight 400: `next-persian-fonts/ario` (`ario`) and `ario-fd` (`arioFD`, Persian digits), plus `css/ario.css` and `css/ario-fd.css`. Shipped as the author's unmodified WOFF2 (Dots 1 style). Existing exports are unchanged.
- **Rooyin** (رویین) by Mohamad Darvishi (MohamadDarvishi/Rooyin, v1.1), OFL-1.1 (Reserved Font Name "Rooyin"), pixel display font, weights 400 and 700: `next-persian-fonts/rooyin` (`rooyin`) and `rooyin-fd` (`rooyinFD`, Persian digits), plus `css/rooyin.css` and `css/rooyin-fd.css`. Shipped as the author's unmodified WOFF2. Existing exports are unchanged.
- **Noqte** (نقطه) by Mehdi Sadeghi (mehdisadeghi/Noqte, 0.1.0-beta4), OFL-1.1 (Reserved Font Name "Noqte"), pixel display font, weight 500: `next-persian-fonts/noqte` (`noqte`), plus `css/noqte.css`. Shipped as the author's unmodified WOFF2 from the GitHub release. `update-fonts` now accepts a full `https://` URL in a file's `from` (used for release assets). Existing exports are unchanged.
- **Badeen Display** (بدین) by Hani Adnan (haniadnansd/Badeen-Display, v1.000 at commit c1370b6; also on Google Fonts), OFL-1.1, headline/display font, weight 400: `next-persian-fonts/badeen-display` (`badeenDisplay`), plus `css/badeen-display.css`. Shipped as the author's unmodified WOFF2. Existing exports are unchanged.

### Changed
- Demo gallery filters redesigned: "only variable" toggle, "hide deprecated" toggle, source segmented control, category pills with counts, result count, clear-filters button and empty state.
- Demo: the `display` category is labelled «تیتر و نمایشی» (headline & display).
- Demo: cleaner, more accessible design (skip link, landmarks, visible focus, reduced-motion support, better contrast and screen-reader labels) and a note that only the fonts you import are bundled and loaded.
- `scripts/update-fonts.mjs` accepts a full `https://` URL as a file source (used for release assets).

## 1.4.0 (2026-10-21)

Nothing changes for existing imports: every existing export, CSS file and generated `next/font` call is the same as in 1.3.0.

### Added
- **Sepehr** (سپهر) by Saeed Rezaee and Saber Rastikerdar (googlefonts/sepehr-fonts @ 90f5da4, v1.000), OFL-1.1: `next-persian-fonts/sepehr` (`sepehr`), weights 100, 300, 400, 500, 700, plus `css/sepehr.css`. Converted to WOFF2 and subset to Arabic + Latin (no Reserved Font Name). Existing exports are unchanged.
- **Sorena** (سورنا) by Mohamad Darvishi (MDarvishi5124/Sorena, v1.2.0), OFL-1.1, pixel-style display font, weight 400: `next-persian-fonts/sorena` (`sorena`), `sorena-fd` (`sorenaFD`, Persian digits), `sorena-pixel` (`sorenaPixel`, strict pixel-grid master) and `sorena-pixel-fd` (`sorenaPixelFD`), plus matching `css/sorena*.css`. Shipped as the author's unmodified WOFF2. Existing exports are unchanged.

### Changed
- Font request form example now suggests Vazirmatn.

## 1.3.0 (2026-10-20)

Nothing changes for existing imports: every existing export, CSS file and generated `next/font` call is the same as in 1.2.0.

### Added
- **Arad** (آراد) by Mohamad Darvishi, v2.5.1, OFL-1.1: `next-persian-fonts/arad` (`arad`) and `next-persian-fonts/arad-fd` (`aradFD`, Persian digits), variable wght 100–1000, plus `css/arad.css` and `css/arad-fd.css`. Shipped as the authors' unmodified WOFF2 (Reserved Font Name). Existing exports are unchanged.
- **Font request form**: suggest a new font via the GitHub issue form (https://github.com/amiryxe/next-persian-fonts/issues/new?template=font-request.yml), linked from the README and the demo site.

## 1.2.0 (2026-10-09)

Nothing changes for Next.js users: every import path, export, type and generated `next/font` call is byte-for-byte the same as in 1.1.1, and the new CSS files are only bundled if you import them.

### Added
- **Use the fonts without Next.js** (Vite, Gatsby, Astro, plain HTML, …). Every export now has a plain CSS file, `next-persian-fonts/css/<name>.css` (44 files, e.g. `css/vazirmatn-variable.css`, `css/sahel-fd.css`). Each one declares `@font-face` rules for the same bundled font files through relative URLs (no duplicated fonts), with `font-display: swap` and real weight ranges for variable fonts, sets the CSS variable on `:root` (e.g. `--font-vazirmatn-variable`, the same name as the `next/font` variable) and adds a class (e.g. `.font-vazirmatn-variable`). Works with `import` from JS, `@import` from CSS (including Tailwind v4) and `<link>` in plain HTML.
- `exports` entry `./css/*`; `sideEffects` is now `["*.css"]` so bundlers keep imported CSS while JS stays tree-shakeable.
- FONTS.md lists the CSS file and `font-family` name of every export.

### Tooling
- The generator writes the CSS files from `fonts.json`; `npm run verify` checks that every export has one and that its URLs, weights, styles, `font-display`, variable and class match the manifest, and that no JS entry imports CSS.
- New `npm run test:smoke:css` (also in CI): builds a Vite app, a Vite + Tailwind 4 app and a webpack 5 + css-loader app (the Gatsby setup) from the packed tarball and checks that only the imported font files are emitted and referenced; also checks that every `url()` resolves inside `node_modules` for plain HTML.

### Docs & demo
- READMEs: "Using without Next.js" section (Vite/Gatsby/Astro import, Tailwind, plain HTML) and a feature bullet; FAQ entry.
- Demo: a «استفاده در پروژه‌های غیر Next.js» section in «نصب و استفاده», a Next.js / CSS toggle for the gallery snippets, and a mention in the hero and FAQ.

## 1.1.1 (2026-10-02)

### Fixed
- **Variable fonts were downloaded twice with Turbopack.** File names with brackets (e.g. `Vazirmatn[wght].woff2`) were percent-encoded in Next's `<link rel="preload">` but not in the CSS `url()`, so browsers fetched the same file twice. The 18 affected files are renamed (e.g. `Vazirmatn-VF.woff2`); import paths and export names are unchanged. `npm run verify` now rejects such file names.
- **Static families with many weights no longer preload every file.** Exports with more than 3 files (`vazirMatn`, `sahelFD`, `shabnam`, `shabnamFD`, `ibmPlexSansArabic`, `amiri`, `mirza`, `harmattan`, `lateef`, `scheherazadeNew`) use `preload: false`; only the weights a page uses are downloaded (e.g. `vazirMatn` preloaded 9 files / 460 KB before).

### Docs
- **Pages Router / Jest:** document `transpilePackages: ['next-persian-fonts']` (without it the Pages Router build and `next/jest` fail with `ERR_UNSUPPORTED_DIR_IMPORT`; harmless for the App Router). The smoke tests now build a Pages Router page and run a `next/jest` test.
- **create-next-app:** step 3 puts the class on `<body>`, and the docs say to remove the template's Geist `next/font/google` imports and its `body { font-family: Arial… }` rule, which otherwise hides the Persian font. Full examples keep `import './globals.css'`.
- pnpm note: recent pnpm versions hold back fresh releases; use `pnpm add next-persian-fonts@^1.1`.
- Removed the unused `typescript` devDependency from the published `package.json`.

### Demo
- Much lighter page: gallery fonts are no longer preloaded (only the site and code fonts are), and each card loads its font only when it scrolls near the viewport. The Vazirmatn card defaults to `vazirmatnVariable`.
- Better contrast (emerald-700 behind white text), `og:image` / `twitter:image` banner with `summary_large_image`.

## 1.1.0 (2026-10-02)

Nothing that worked in 1.0.x breaks: every 1.0.x import path and export name still works.

### Fixed
- **TypeScript:** type declarations are now included for every export. Before this, `strict` TS projects (the create-next-app default) failed with `TS7016: Could not find a declaration file for module 'next-persian-fonts/…'`.
- **Variable fonts** (`sahel`, `estedad`, `estedadFD`) now declare their weight range in `@font-face` (`font-weight: 400 900` / `100 900`). Browsers no longer synthesize a fake bold.
- **Licenses:** the package now ships each font's upstream license file (`OFL.txt` / `LICENSE.txt`) plus `LICENSE.md` and `FONTS.md`. The `license` field reflects the fonts' licenses.
- `sideEffects: false` lets Turbopack tree-shake the root barrel. `import { sahel } from 'next-persian-fonts'` now preloads 1 font file instead of 11.

### Changed
- **Estedad** updated from 7.3 to **8.5** (`estedad`). Upstream 8.x removed the kashida (KSHD) axis and the Farsi-digits build.
- `estedadFD` is **deprecated**. It stays on the Estedad 7.3 file shipped in 1.0.x so existing sites look the same, and it's no longer preloaded by default.
- `peerDependencies.next` is now `>=13.2.0`, the first version with built-in `next/font`. 13.0 and 13.1 never worked with `next/font/local` imports from this package.
- Every font now sets `display: 'swap'` explicitly. This was already the Next.js default.

### Added
- New font families: **Samim** 4.0.5, **Shabnam** 5.0.1, **Mikhak** 3.4 (variable), **Parastoo** 2.0.1, **Gandom** 0.8, **Tanha** 0.10, **Vazir Code** 1.1.2 (monospace), **Behdad** 1.0.0 and **Nika** 1.0.0.
- **Persian-capable Google Fonts, bundled for offline use** (21 families): **Lalezar**, **Markazi Text**, **Mirza**, **Reem Kufi**, **Noto Naskh Arabic**, **Noto Sans Arabic**, **Noto Kufi Arabic**, **Noto Nastaliq Urdu**, **IBM Plex Sans Arabic**, **Amiri** (with italics), **Harmattan**, **Scheherazade New**, **Lateef**, **Katibeh**, **Aref Ruqaa**, **Rubik** (with italic), **Jomhuria**, **El Messiri**, **Changa**, **Baloo Bhaijaan 2** and **Cairo**. When Iran is cut off from the global internet, `next/font/google` can't download fonts at build time and CDN fonts don't load; these now ship inside the package. Every family was checked for Persian letters (پ چ ژ گ ک ی) and Persian digits. TTF-only families are converted to WOFF2 and subset to Arabic + Latin; fonts with a Reserved Font Name (IBM Plex, SIL fonts) ship the authors' unmodified WOFF2. Changes are listed per file in `FONTS.md`. The packed tarball grows from about 2.3 MB to about 6.4 MB, but an app only downloads the fonts it imports.
- Persian-digit (`…FD`) variants for Sahel, Samim, Shabnam, Mikhak, Parastoo, Gandom, Tanha and Vazir Code.
- Vazirmatn variants: `vazirmatnVariable` (a single 111 KB variable file, Latin digits) and `vazirmatnRoundDots`. `vazirmatnFD` was added as an alias of `vazirMatn`.
- `PersianFont` type, `next-persian-fonts/fonts.json` (machine-readable font list) and `exports` entries with `types` conditions.
- Tooling: `fonts.json` manifest with generator, upstream update/check script, package verification, and a smoke-test matrix (Next 13.5 / 14 / 15 / 16, webpack and Turbopack) with CI on Node 22 and 24.
- Demo/docs site redesigned: Next.js 16, React 19, Tailwind CSS 4, RTL/`lang="fa"`, a live font gallery (custom text, weight and size sliders, Persian/Latin digits toggle, category filter, search, copyable imports, license links), dark mode, a Google Fonts source filter, and beginner-friendly docs (3-step Installation & Usage guide, App Router / Pages Router examples, Tailwind v3/v4, FAQ). The demo sets `agentRules: false` so `next dev` on Next.js 16 doesn't generate `AGENTS.md`/`CLAUDE.md`.
- READMEs rewritten for GitHub and npm: banner and gallery images, badges, Persian first then English, a 3-step Installation & Usage guide, copy-paste examples, the full font table, FAQ, contributing and credits.
- Demo gallery shows one card per font family, with the variants (Persian/Latin digits, round dots, italic) switchable inside the card.

## 1.0.1 (2026-07-18)
- ESM `exports` map for `sahel`, `vazirmatn` and `estedad`.

## 1.0.0 (2024-10-18)
- Sahel, Vazirmatn (Farsi digits) and Estedad fonts via `next/font/local`.
