# Changelog

## 1.1.0 (unreleased)

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
- Demo/docs site redesigned: Next.js 16, React 19, Tailwind CSS 4, RTL/`lang="fa"`, a live font gallery (custom text, weight and size sliders, Persian/Latin digits toggle, category filter, search, copyable imports, license links), dark mode, a Google Fonts source filter, and beginner-friendly docs (3-step quick start, App Router / Pages Router examples, Tailwind v3/v4, FAQ). The demo sets `agentRules: false` so `next dev` on Next.js 16 doesn't generate `AGENTS.md`/`CLAUDE.md`.
- READMEs rewritten: Persian first, then English, with a 3-step quick start, copy-paste examples and an FAQ.

## 1.0.1 (2026-07-18)
- ESM `exports` map for `sahel`, `vazirmatn` and `estedad`.

## 1.0.0 (2024-10-18)
- Sahel, Vazirmatn (Farsi digits) and Estedad fonts via `next/font/local`.
