# next-persian-fonts

[![npm](https://img.shields.io/npm/v/next-persian-fonts)](https://www.npmjs.com/package/next-persian-fonts)
[![CI](https://github.com/amiryxe/next-persian-fonts/actions/workflows/ci.yml/badge.svg)](https://github.com/amiryxe/next-persian-fonts/actions/workflows/ci.yml)

فونت‌های فارسی رایگان برای Next.js، داخل خود پکیج. بدون نیاز به گوگل و CDN، حتی وقتی اینترنت بین‌الملل قطع است.
Free Persian fonts for Next.js, bundled inside the package. No Google, no CDN, works offline.

**[دموی زنده و گالری فونت‌ها · Live demo & gallery](https://amiryxe.github.io/next-persian-fonts/)** · [English](#english)

<div dir="rtl">

## نصب و استفاده در ۳ قدم

**۱. نصب کنید**

```bash
npm install next-persian-fonts
```

**۲. فونت را در `app/layout.tsx` ایمپورت کنید**

```tsx
import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'
```

**۳. کلاس فونت را روی `<html>` بگذارید**

```tsx
<html lang="fa" dir="rtl" className={vazirmatnVariable.className}>
```

تمام! حالا کل سایت با فونت وزیرمتن نمایش داده می‌شود.

## مثال کامل: App Router

این فایل را کپی کنید:

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

## مثال کامل: Pages Router

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app'
import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={vazirmatnVariable.className}>
      <Component {...pageProps} />
    </main>
  )
}
```

برای راست‌چین شدن صفحه، در `pages/_document.tsx` بنویسید: `<Html lang="fa" dir="rtl">`.

## استفاده با Tailwind

به‌جای `className` از `variable` استفاده کنید تا فونت به‌صورت متغیر CSS در دسترس باشد:

```tsx
<html lang="fa" dir="rtl" className={vazirmatnVariable.variable}>
```

**Tailwind نسخهٔ ۴** (در `globals.css`):

```css
@import 'tailwindcss';

@theme inline {
  --font-sans: var(--font-vazirmatn-variable), sans-serif;
}
```

**Tailwind نسخهٔ ۳** (در `tailwind.config.js`):

```js
module.exports = {
  theme: {
    extend: {
      fontFamily: { sans: ['var(--font-vazirmatn-variable)', 'sans-serif'] },
    },
  },
}
```

حالا `font-sans` (پیش‌فرض Tailwind) همان وزیرمتن است. نام متغیر هر فونت `--font-` به‌علاوهٔ مسیر ایمپورتش است؛ مثلاً `next-persian-fonts/estedad` ← `--font-estedad`.

## فهرست فونت‌ها

هر فونت از مسیر خودش ایمپورت می‌شود: `import { نام‌خروجی } from 'next-persian-fonts/مسیر'`

**فونت‌های ایرانی**

| فونت | مسیر ← نام خروجی |
|---|---|
| وزیرمتن · Vazirmatn | `vazirmatn-variable` ← `vazirmatnVariable` · `vazirmatn` ← `vazirMatn` (ارقام فارسی) · `vazirmatn-round-dots` ← `vazirmatnRoundDots` |
| استعداد · Estedad | `estedad` ← `estedad` |
| ساحل · Sahel | `sahel` ← `sahel` · `sahel-fd` ← `sahelFD` |
| صمیم · Samim | `samim` ← `samim` · `samim-fd` ← `samimFD` |
| شبنم · Shabnam | `shabnam` ← `shabnam` · `shabnam-fd` ← `shabnamFD` |
| میخک · Mikhak | `mikhak` ← `mikhak` · `mikhak-fd` ← `mikhakFD` |
| پرستو · Parastoo | `parastoo` ← `parastoo` · `parastoo-fd` ← `parastooFD` |
| گندم · Gandom | `gandom` ← `gandom` · `gandom-fd` ← `gandomFD` |
| تنها · Tanha | `tanha` ← `tanha` · `tanha-fd` ← `tanhaFD` |
| وزیر کد · Vazir Code (مونواسپیس) | `vazir-code` ← `vazirCode` · `vazir-code-fd` ← `vazirCodeFD` |
| بهداد · Behdad | `behdad` ← `behdad` |
| نیکا · Nika | `nika` ← `nika` |

**فونت‌های Google Fonts (آفلاین، داخل پکیج)**

| فونت | مسیر ← نام خروجی |
|---|---|
| لاله‌زار · Lalezar | `lalezar` ← `lalezar` |
| مرکزی · Markazi Text | `markazi-text` ← `markaziText` |
| میرزا · Mirza | `mirza` ← `mirza` |
| ریم کوفی · Reem Kufi | `reem-kufi` ← `reemKufi` |
| نوتو نسخ · Noto Naskh Arabic | `noto-naskh-arabic` ← `notoNaskhArabic` |
| نوتو سنس · Noto Sans Arabic | `noto-sans-arabic` ← `notoSansArabic` |
| نوتو کوفی · Noto Kufi Arabic | `noto-kufi-arabic` ← `notoKufiArabic` |
| نوتو نستعلیق · Noto Nastaliq Urdu | `noto-nastaliq-urdu` ← `notoNastaliqUrdu` |
| آی‌بی‌ام پلکس · IBM Plex Sans Arabic | `ibm-plex-sans-arabic` ← `ibmPlexSansArabic` |
| امیری · Amiri | `amiri` ← `amiri` |
| هرمتان · Harmattan | `harmattan` ← `harmattan` |
| شهرزاد · Scheherazade New | `scheherazade-new` ← `scheherazadeNew` |
| لطیف · Lateef | `lateef` ← `lateef` |
| کتیبه · Katibeh | `katibeh` ← `katibeh` |
| عارف رقعه · Aref Ruqaa | `aref-ruqaa` ← `arefRuqaa` |
| روبیک · Rubik | `rubik` ← `rubik` |
| جمهوریا · Jomhuria | `jomhuria` ← `jomhuria` |
| المسیری · El Messiri | `el-messiri` ← `elMessiri` |
| چنگا · Changa | `changa` ← `changa` |
| بالو بهایجان · Baloo Bhaijaan 2 | `baloo-bhaijaan-2` ← `balooBhaijaan2` |
| قاهره · Cairo | `cairo` ← `cairo` |

وزن‌ها، نسخه‌ها و مجوز هر فونت در **[FONTS.md](./FONTS.md)** آمده است. برای دیدن ظاهر فونت‌ها به [گالری](https://amiryxe.github.io/next-persian-fonts/) سر بزنید.

## پرسش‌های رایج

**چرا فونت‌ها داخل پکیج هستند و از Google Fonts یا CDN استفاده نمی‌کنیم؟**
وقتی اینترنت ایران از اینترنت جهانی قطع می‌شود، `next/font/google` نمی‌تواند هنگام build فونت را دانلود کند و build شکست می‌خورد؛ فونت‌های CDN هم برای کاربران بارگذاری نمی‌شوند. در این پکیج فایل فونت‌ها همراه `npm install` می‌آیند و Next.js آن‌ها را روی سایت خودتان میزبانی می‌کند، پس همیشه کار می‌کنند. (فقط کافی است خود پکیج یک بار از npm یا یک آینهٔ داخلی نصب شده باشد.)

**چطور چند فونت با هم استفاده کنم؟**
`variable` هر فونت را روی `<html>` بگذارید و هر جا لازم است از متغیرش استفاده کنید:

```tsx
import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'
import { lalezar } from 'next-persian-fonts/lalezar'

<html lang="fa" dir="rtl" className={`${vazirmatnVariable.variable} ${lalezar.variable}`}>
```

```css
body { font-family: var(--font-vazirmatn-variable); }
h1   { font-family: var(--font-lalezar); }
```

با Tailwind v4 هم می‌توانید در `@theme` بنویسید `--font-display: var(--font-lalezar);` و از کلاس `font-display` استفاده کنید. یا ساده‌تر: `className={lalezar.className}` را مستقیم روی همان المان بگذارید.

**نسخه‌های FD چه هستند؟**
در نسخه‌های `FD` (مثل `sahelFD` یا `samimFD`) حتی اعداد انگلیسی (123) هم به شکل فارسی (۱۲۳) نمایش داده می‌شوند. اگر متن شما اعداد فارسی دارد، نسخهٔ معمولی هم آن‌ها را درست نشان می‌دهد. `vazirMatn` (مسیر `vazirmatn`) همیشه اعداد فارسی دارد.

**`optimizePackageImports` لازم است؟**
اگر مثل مثال‌های بالا از مسیر هر فونت ایمپورت کنید (`next-persian-fonts/estedad`)، **نه**. فقط اگر از ریشهٔ پکیج ایمپورت می‌کنید (`import { sahel } from 'next-persian-fonts'`، روش قدیمی نسخهٔ ۱.۰) و با webpack می‌سازید (پیش‌فرض Next 13 تا 15)، این را در `next.config` اضافه کنید تا فونت‌های اضافه دانلود نشوند:

```js
experimental: { optimizePackageImports: ['next-persian-fonts'] }
```

**با کدام نسخه‌های Next.js کار می‌کند؟**
Next.js ۱۳.۲ تا ۱۶، هم App Router و هم Pages Router، هم Turbopack و هم webpack، با React ۱۸ و ۱۹. تایپ‌اسکریپت هم پشتیبانی می‌شود.

**`estedadFD` چه شد؟**
استعداد ۸ دیگر نسخهٔ ارقام فارسی ندارد. `estedadFD` برای سازگاری روی نسخهٔ ۷.۳ مانده و منسوخ است؛ برای پروژهٔ جدید از `estedad` استفاده کنید.

**برای پروژهٔ تجاری رایگان است؟**
بله. همهٔ فونت‌ها مجوز آزاد دارند (بیشترشان SIL OFL 1.1) و استفاده در سایت‌های تجاری مجاز است. جزئیات در [LICENSE.md](./LICENSE.md) و [FONTS.md](./FONTS.md).

</div>

---

## English

### Installation & Usage (3 steps)

1. Install: `npm install next-persian-fonts`
2. Import a font in `app/layout.tsx`: `import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'`
3. Put its class on `<html>`: `<html lang="fa" dir="rtl" className={vazirmatnVariable.className}>`

That's it: the whole site now uses Vazirmatn.

### App Router

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

### Pages Router

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app'
import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={vazirmatnVariable.className}>
      <Component {...pageProps} />
    </main>
  )
}
```

For right-to-left pages, use `<Html lang="fa" dir="rtl">` in `pages/_document.tsx`.

### Tailwind

Use `.variable` instead of `.className`: `<html className={vazirmatnVariable.variable}>`.

```css
/* Tailwind v4: globals.css */
@import 'tailwindcss';
@theme inline {
  --font-sans: var(--font-vazirmatn-variable), sans-serif;
}
```

```js
// Tailwind v3: tailwind.config.js
theme: { extend: { fontFamily: { sans: ['var(--font-vazirmatn-variable)', 'sans-serif'] } } }
```

Each font's CSS variable is `--font-` + its import path, e.g. `next-persian-fonts/estedad` → `--font-estedad`.

### Fonts

33 families: Iranian fonts (Vazirmatn, Estedad, Sahel, Samim, Shabnam, Mikhak, Parastoo, Gandom, Tanha, Vazir Code, Behdad, Nika) and Persian-capable Google Fonts bundled for offline use (Lalezar, Markazi Text, Mirza, Reem Kufi, Noto Naskh/Sans/Kufi Arabic, Noto Nastaliq Urdu, IBM Plex Sans Arabic, Amiri, Harmattan, Scheherazade New, Lateef, Katibeh, Aref Ruqaa, Rubik, Jomhuria, El Messiri, Changa, Baloo Bhaijaan 2, Cairo). The import paths and export names are in the table above. Weights, versions and licenses are in **[FONTS.md](./FONTS.md)**.

### FAQ

- **Why bundle fonts instead of using Google Fonts?** When Iran is cut off from the global internet, `next/font/google` can't download fonts at build time and CDN fonts don't load. These font files come with `npm install` and are self-hosted by Next.js, so they always work.
- **Several fonts?** Put each font's `.variable` on `<html>` and use `font-family: var(--font-lalezar)` where you need it, or put `lalezar.className` on a single element.
- **What are the `FD` exports?** They show Latin digits (123) as Persian digits (۱۲۳). `vazirMatn` always uses Persian digits.
- **Do I need `optimizePackageImports`?** Not with subpath imports (`next-persian-fonts/estedad`). Only if you use the legacy root import (`from 'next-persian-fonts'`) with webpack: add `experimental: { optimizePackageImports: ['next-persian-fonts'] }` to `next.config`.
- **Which Next.js versions?** 13.2 to 16, App Router and Pages Router, Turbopack and webpack, React 18/19, with TypeScript types.
- **`estedadFD`?** Deprecated. Estedad 8 has no Persian-digit build, so `estedadFD` stays on 7.3. Use `estedad`.
- **Free for commercial use?** Yes. All fonts are under free licenses (mostly SIL OFL 1.1). See [LICENSE.md](./LICENSE.md) and [FONTS.md](./FONTS.md).

### License

Package code: ISC. Fonts: each under its own license, included in every font folder. Some Google Fonts files were converted to WOFF2 and subset to Arabic + Latin; [FONTS.md](./FONTS.md) lists every change.
