# next-persian-fonts

[![npm](https://img.shields.io/npm/v/next-persian-fonts)](https://www.npmjs.com/package/next-persian-fonts)
[![CI](https://github.com/amiryxe/next-persian-fonts/actions/workflows/ci.yml/badge.svg)](https://github.com/amiryxe/next-persian-fonts/actions/workflows/ci.yml)

Self-hosted, free Persian (Farsi) fonts for **Next.js**, loaded with `next/font/local`, so there's no CDN and no layout shift. TypeScript types are included.
Works with Next.js 13.2 → 16 (App Router and Pages Router, Turbopack and webpack) and React 18/19.

**[Live demo & font gallery →](https://amiryxe.github.io/next-persian-fonts/)** · [فارسی](#فارسی)

## Install

```bash
npm install next-persian-fonts   # or: pnpm add / yarn add / bun add
```

## Usage

Import each font from its own subpath. Only fonts you import end up in your CSS.

```tsx
// app/layout.tsx
import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatnVariable.className}>
      <body>{children}</body>
    </html>
  )
}
```

Every export is a Next.js font object: `{ className, variable, style }`.

### CSS variables & Tailwind

```tsx
import { estedad } from 'next-persian-fonts/estedad'
import { vazirCode } from 'next-persian-fonts/vazir-code'

<html className={`${estedad.variable} ${vazirCode.variable}`}>
```

```css
/* Tailwind v4 (globals.css) */
@import 'tailwindcss';
@theme inline {
  --font-sans: var(--font-estedad), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-vazir-code), ui-monospace, monospace;
}
```

```ts
// Tailwind v3 (tailwind.config.ts)
theme: { extend: { fontFamily: { sans: ['var(--font-estedad)', 'system-ui'] } } }
```

## Fonts

`FD` variants use Persian digits (۱۲۳) even for Latin digits in your text.

| Font | Import from | Export(s) | Weights |
|---|---|---|---|
| Vazirmatn (وزیرمتن) | `next-persian-fonts/vazirmatn` | `vazirMatn` (= `vazirmatnFD`, Persian digits) | 100–900 (9 static files) |
| | `next-persian-fonts/vazirmatn-variable` | `vazirmatnVariable` | 100–900 variable |
| | `next-persian-fonts/vazirmatn-round-dots` | `vazirmatnRoundDots` | 100–900 variable |
| Estedad (استعداد) | `next-persian-fonts/estedad` | `estedad` (v8.5), `estedadFD` (v7.3, deprecated) | 100–900 variable |
| Sahel (ساحل) | `next-persian-fonts/sahel` · `/sahel-fd` | `sahel` · `sahelFD` | 400–900 variable · 300–900 static |
| Samim (صمیم) | `next-persian-fonts/samim` · `/samim-fd` | `samim` · `samimFD` | 400, 500, 700 |
| Shabnam (شبنم) | `next-persian-fonts/shabnam` · `/shabnam-fd` | `shabnam` · `shabnamFD` | 100, 300, 400, 500, 700 |
| Mikhak (میخک) | `next-persian-fonts/mikhak` · `/mikhak-fd` | `mikhak` · `mikhakFD` | 100–900 variable |
| Parastoo (پرستو) | `next-persian-fonts/parastoo` · `/parastoo-fd` | `parastoo` · `parastooFD` | 400, 700 |
| Gandom (گندم) | `next-persian-fonts/gandom` · `/gandom-fd` | `gandom` · `gandomFD` | 400 |
| Tanha (تنها) | `next-persian-fonts/tanha` · `/tanha-fd` | `tanha` · `tanhaFD` | 400 |
| Vazir Code (وزیر کد) | `next-persian-fonts/vazir-code` · `/vazir-code-fd` | `vazirCode` · `vazirCodeFD` | 400 (monospace) |
| Behdad (بهداد) | `next-persian-fonts/behdad` | `behdad` | 400 (Arabic script only) |
| Nika (نیکا) | `next-persian-fonts/nika` | `nika` | 400 (Arabic script only) |

Versions, licenses and upstream sources: **[FONTS.md](./FONTS.md)**. Machine-readable list: `next-persian-fonts/fonts.json`.

### Fonts on Google Fonts

Persian fonts that are available on Google Fonts (Lalezar, Noto Naskh Arabic, Noto Sans Arabic, Noto Nastaliq Urdu, Markazi Text, Reem Kufi, IBM Plex Sans Arabic, Amiri, Mirza, …) are not bundled. Use `next/font/google` for those:

```ts
import { Lalezar } from 'next/font/google'
const lalezar = Lalezar({ weight: '400', subsets: ['arabic'], variable: '--font-lalezar' })
```

## Notes

- **Root import.** `import { sahel } from 'next-persian-fonts'` still works for 1.0.x compatibility and only re-exports `sahel`, `vazirMatn` and `estedad`/`estedadFD`. Turbopack tree-shakes it. With webpack, every font in that barrel ends up in your CSS and preloads unless you add `experimental: { optimizePackageImports: ['next-persian-fonts'] }` to `next.config`. Subpath imports avoid this altogether.
- **`estedadFD` is deprecated.** Estedad 8 dropped its Farsi-digits build, so `estedadFD` stays on Estedad 7.3 and is no longer preloaded. Use `estedad` (8.5).
- Variable fonts declare their weight range (e.g. `font-weight: 100 900`), so every `font-weight` uses the real weight instead of a browser-synthesized bold.
- Requires Next.js ≥ 13.2 (when `next/font` became built in).

## License

Package code: ISC. Fonts are redistributed unmodified under their own licenses (mostly SIL OFL 1.1; see [LICENSE.md](./LICENSE.md) and [FONTS.md](./FONTS.md)). Each font folder contains its license file.

---

<div dir="rtl">

## فارسی

مجموعه‌ای از فونت‌های فارسی آزاد برای **Next.js** که با `next/font/local` بارگذاری می‌شوند: میزبانی روی سرور خودتان، بدون CDN، بدون پرش صفحه (CLS) و با تایپ‌اسکریپت. سازگار با Next.js ۱۳.۲ تا ۱۶، App Router و Pages Router، Turbopack و webpack و React ۱۸ و ۱۹.

**[دموی زنده و گالری فونت‌ها ←](https://amiryxe.github.io/next-persian-fonts/)**

### نصب

```bash
npm install next-persian-fonts
```

### استفاده

هر فونت را از مسیر جداگانهٔ خودش ایمپورت کنید تا فقط همان فونت در خروجی بیاید:

```tsx
import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'

<html lang="fa" dir="rtl" className={vazirmatnVariable.className}>
```

برای استفاده به‌صورت متغیر CSS (مثلاً در Tailwind) کلاس `font.variable` را روی `html` بگذارید و از `var(--font-estedad)` استفاده کنید.

### فونت‌ها

وزیرمتن، استعداد، ساحل، صمیم، شبنم، میخک، پرستو، گندم، تنها، وزیر کد، بهداد و نیکا. نسخه‌های **FD** ارقام لاتین را هم به شکل فارسی نشان می‌دهند. جدول کامل نسخه‌ها و مجوزها در [FONTS.md](./FONTS.md) است.

فونت‌هایی که در Google Fonts هستند (لاله‌زار، نوتو نسخ، مرکزی و…) در این پکیج نیستند. آن‌ها را با `next/font/google` بارگذاری کنید.

### نکته‌ها

- ایمپورت از ریشهٔ پکیج (`'next-persian-fonts'`) فقط برای سازگاری با نسخهٔ ۱.۰ است. اگر از webpack استفاده می‌کنید، یا ایمپورت مسیری بنویسید یا `optimizePackageImports` را فعال کنید.
- `estedadFD` منسوخ شده و روی استعداد ۷.۳ مانده است. برای پروژه‌های جدید از `estedad` (نسخهٔ ۸.۵) استفاده کنید.

### مجوز

کد پکیج با مجوز ISC منتشر می‌شود و هر فونت با مجوز سازندهٔ خودش (عمدتاً SIL OFL 1.1).

</div>
