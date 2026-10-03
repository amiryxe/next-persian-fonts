<p align="center">
  <a href="https://amiryxe.github.io/next-persian-fonts/"><img src="https://raw.githubusercontent.com/amiryxe/next-persian-fonts/main/.github/assets/banner.png" alt="next-persian-fonts: فونت‌های فارسی برای Next.js" width="100%"></a>
</p>

<h1 align="center">next-persian-fonts</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/next-persian-fonts"><img src="https://img.shields.io/npm/v/next-persian-fonts?color=10b981&label=npm" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/next-persian-fonts"><img src="https://img.shields.io/npm/dm/next-persian-fonts?color=0ea5e9" alt="npm downloads"></a>
  <a href="https://github.com/amiryxe/next-persian-fonts"><img src="https://img.shields.io/github/stars/amiryxe/next-persian-fonts?style=flat&logo=github&color=f59e0b" alt="GitHub stars"></a>
  <a href="https://github.com/amiryxe/next-persian-fonts/blob/main/src/next-persian-fonts/LICENSE.md"><img src="https://img.shields.io/badge/license-ISC%20%2B%20OFL--1.1-blue" alt="License: ISC + OFL-1.1"></a>
  <img src="https://img.shields.io/badge/Next.js-13.2%20%E2%86%92%2016-000000?logo=nextdotjs" alt="Next.js 13.2 to 16">
  <img src="https://img.shields.io/badge/types-included-3178c6?logo=typescript&logoColor=white" alt="TypeScript types included">
  <a href="https://github.com/amiryxe/next-persian-fonts/actions/workflows/ci.yml"><img src="https://github.com/amiryxe/next-persian-fonts/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
</p>

<p align="center" dir="rtl"><b>فونت‌های فارسی رایگان برای Next.js، داخل خود پکیج. بدون گوگل و CDN، حتی وقتی اینترنت بین‌الملل قطع است.</b></p>
<p align="center" dir="ltr">Free Persian (Farsi) fonts for Next.js, bundled in the package. No Google, no CDN, works offline.</p>

<p align="center">
  <a href="https://amiryxe.github.io/next-persian-fonts/"><b>🎨 دموی زنده و گالری · Live demo</b></a> ·
  <a href="#فارسی">فارسی</a> ·
  <a href="#english">English</a> ·
  <a href="#fonts">فهرست فونت‌ها · Fonts</a>
</p>

<p align="center" dir="rtl">⭐ اگر این پکیج به کارتان آمد، با یک <a href="https://github.com/amiryxe/next-persian-fonts">ستاره در گیت‌هاب</a> حمایتش کنید.</p>
<p align="center" dir="ltr">⭐ If this package helped you, please <a href="https://github.com/amiryxe/next-persian-fonts">give it a star on GitHub</a>.</p>

<div dir="rtl">

## فارسی

### ویژگی‌ها

- **۳۳ خانوادهٔ فونت فارسی** و ۴۳ نسخهٔ آماده: وزیرمتن، استعداد، ساحل، صمیم، شبنم، میخک، پرستو، گندم، تنها، وزیر کد، بهداد، نیکا و ۲۱ فونت فارسی Google Fonts مثل لاله‌زار، نوتو نسخ، نوتو نستعلیق، امیری و وزیرمتن.
- **کاملاً آفلاین:** فایل فونت‌ها داخل پکیج است؛ build و سایت شما به گوگل یا CDN وابسته نیست.
- **بدون پرش صفحه (CLS):** بارگذاری با `next/font/local`، پیش‌بارگذاری خودکار و `font-display: swap`.
- **فقط همان فونتی که ایمپورت می‌کنید** در خروجی می‌آید (هر فونت مسیر جداگانه دارد).
- **نسخه‌های ارقام فارسی (FD)** برای فونت‌های ایرانی.
- **تایپ‌اسکریپت** و سازگار با **Next.js ۱۳.۲ تا ۱۶**، App Router و Pages Router، Turbopack و webpack.
- **مجوز آزاد** (بیشتر SIL OFL 1.1)؛ استفاده در پروژه‌های تجاری مجاز است.

### نصب و استفاده در ۳ قدم

**۱. نصب کنید**

```bash
npm install next-persian-fonts
```

با pnpm یا yarn: `pnpm add next-persian-fonts@^1.1` (نسخه را صریح بنویسید؛ pnpm بسته‌های تازه‌منتشرشده را تا مدتی نصب نمی‌کند).

**۲. فونت را در `app/layout.tsx` ایمپورت کنید**

```tsx
import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'
```

**۳. کلاس فونت را روی `<body>` بگذارید**

```tsx
<body className={vazirmatnVariable.className}>
```

تمام! حالا کل سایت با فونت وزیرمتن نمایش داده می‌شود.

> **پروژهٔ تازهٔ create-next-app؟** در `app/layout.tsx` ایمپورت فونت‌های Geist از `next/font/google` را حذف کنید (به اینترنت جهانی نیاز دارند) و در `globals.css` خط `font-family: Arial, Helvetica, sans-serif;` را از قانون `body` پاک کنید تا جلوی فونت فارسی را نگیرد.

### مثال کامل: App Router

```tsx
// app/layout.tsx
import './globals.css'
import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatnVariable.className}>{children}</body>
    </html>
  )
}
```

### مثال کامل: Pages Router

```tsx
// pages/_app.tsx
import '@/styles/globals.css'
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

و در `next.config` این را اضافه کنید (در Pages Router لازم است، چون Next.js پکیج‌های node_modules را در Pages Router باندل نمی‌کند و بدون آن build با خطای `ERR_UNSUPPORTED_DIR_IMPORT` متوقف می‌شود؛ برای Jest هم لازم است و در App Router بی‌ضرر است):

```js
// next.config.mjs
export default {
  transpilePackages: ['next-persian-fonts'],
}
```

برای راست‌چین شدن صفحه، در `pages/_document.tsx` بنویسید: `<Html lang="fa" dir="rtl">`.

### استفاده با Tailwind

به‌جای `className` از `variable` استفاده کنید:

```tsx
<html lang="fa" dir="rtl" className={vazirmatnVariable.variable}>
```

**Tailwind نسخهٔ ۴** (`globals.css`):

```css
@import 'tailwindcss';

@theme inline {
  --font-sans: var(--font-vazirmatn-variable), sans-serif;
}
```

**Tailwind نسخهٔ ۳** (`tailwind.config.js`):

```js
module.exports = {
  theme: {
    extend: {
      fontFamily: { sans: ['var(--font-vazirmatn-variable)', 'sans-serif'] },
    },
  },
}
```

حالا `font-sans` همان وزیرمتن است. نام متغیر CSS هر فونت `--font-` به‌علاوهٔ مسیر ایمپورت آن است؛ مثلاً `next-persian-fonts/estedad` ← `--font-estedad`.

### چرا آفلاین؟ (برای توسعه‌دهنده‌های ایرانی)

وقتی اینترنت ایران از اینترنت جهانی قطع می‌شود، `next/font/google` نمی‌تواند هنگام build فونت را دانلود کند و build شکست می‌خورد؛ فونت‌های CDN هم برای کاربران باز نمی‌شوند. در این پکیج فایل فونت‌ها همراه `npm install` می‌آیند و Next.js آن‌ها را روی سایت خودتان میزبانی می‌کند. کافی است پکیج یک بار از npm یا یک آینهٔ داخلی نصب شده باشد.

### پرسش‌های رایج

<details>
<summary><b>چطور چند فونت را با هم استفاده کنم؟</b></summary>

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

با Tailwind v4 هم می‌توانید در `@theme` بنویسید `--font-display: var(--font-lalezar);` و از کلاس `font-display` استفاده کنید. یا ساده‌تر: `lalezar.className` را مستقیم روی همان المان بگذارید.
</details>

<details>
<summary><b>نسخه‌های FD چه هستند؟</b></summary>

در نسخه‌های `FD` (مثل `sahelFD`) حتی اعداد انگلیسی (123) هم فارسی (۱۲۳) نمایش داده می‌شوند؛ برای قیمت و تاریخ مفید است. اگر متن شما خودش اعداد فارسی دارد، نسخهٔ معمولی هم کافی است. `vazirMatn` همیشه اعداد فارسی دارد.
</details>

<details>
<summary><b>optimizePackageImports لازم است؟</b></summary>

اگر از مسیر هر فونت ایمپورت کنید (`next-persian-fonts/estedad`)، **نه**. فقط اگر از ریشهٔ پکیج ایمپورت می‌کنید (`import { sahel } from 'next-persian-fonts'`، روش قدیمی نسخهٔ ۱.۰) و با webpack می‌سازید، این را در `next.config` اضافه کنید:

```js
experimental: { optimizePackageImports: ['next-persian-fonts'] }
```
</details>

<details>
<summary><b>Pages Router یا Jest خطای ERR_UNSUPPORTED_DIR_IMPORT می‌دهد؟</b></summary>

در `next.config` بنویسید `transpilePackages: ['next-persian-fonts']`. Pages Router و `next/jest` پکیج‌های node_modules را باندل نمی‌کنند، پس `next/font/local` اجرا نمی‌شود. این تنظیم در App Router هم بی‌ضرر است.
</details>

<details>
<summary><b>چرا بعضی فونت‌ها preload نمی‌شوند؟</b></summary>

خروجی‌هایی که بیش از ۳ فایل دارند (مثل `vazirMatn` با ۹ وزن، `sahelFD`، `shabnam`، `ibmPlexSansArabic`) preload نمی‌شوند تا Next.js همهٔ وزن‌ها را در هر صفحه از قبل دانلود نکند؛ فقط وزن‌هایی که استفاده می‌کنید بارگذاری می‌شوند. برای کمترین حجم، نسخه‌های متغیر مثل `vazirmatnVariable` را انتخاب کنید (یک فایل برای همهٔ وزن‌ها).
</details>

<details>
<summary><b>با pnpm نسخهٔ قدیمی (۱.۰) نصب شد؟</b></summary>

نسخه‌های جدید pnpm بسته‌هایی را که تازه منتشر شده‌اند تا مدتی نصب نمی‌کنند. نسخه را صریح بنویسید: `pnpm add next-persian-fonts@^1.1`.
</details>

<details>
<summary><b>با کدام نسخه‌های Next.js کار می‌کند؟</b></summary>

Next.js ۱۳.۲ تا ۱۶، App Router و Pages Router، Turbopack و webpack، React ۱۸ و ۱۹. همهٔ این ترکیب‌ها در CI تست می‌شوند.
</details>

<details>
<summary><b>از نسخهٔ ۱.۰ ارتقا می‌دهم؛ چیزی خراب می‌شود؟</b></summary>

نه. همهٔ مسیرها و نام‌های نسخهٔ ۱.۰ هنوز کار می‌کنند. فقط `estedadFD` منسوخ شده (روی استعداد ۷.۳ مانده)؛ برای پروژهٔ جدید از `estedad` استفاده کنید. جزئیات در [CHANGELOG](https://github.com/amiryxe/next-persian-fonts/blob/main/CHANGELOG.md).
</details>

<details>
<summary><b>برای پروژهٔ تجاری رایگان است؟</b></summary>

بله. همهٔ فونت‌ها مجوز آزاد دارند (بیشترشان SIL OFL 1.1). جزئیات در [LICENSE.md](https://github.com/amiryxe/next-persian-fonts/blob/main/src/next-persian-fonts/LICENSE.md).
</details>

### مشارکت

⭐ اگر این پکیج به کارتان آمد، لطفاً در [گیت‌هاب](https://github.com/amiryxe/next-persian-fonts) به آن ستاره بدهید؛ ستاره‌ها کمک می‌کنند توسعه‌دهنده‌های بیشتری آن را پیدا کنند.

پیشنهاد فونت جدید، گزارش باگ یا Pull Request در [GitHub](https://github.com/amiryxe/next-persian-fonts/issues) خوشحالمان می‌کند. فقط فونت‌هایی با مجوز آزاد (مثل OFL) اضافه می‌شوند. راهنمای افزودن فونت در بخش [Development](https://github.com/amiryxe/next-persian-fonts#development) آمده است.

### اعتبار و مجوز

کد پکیج با مجوز ISC منتشر می‌شود. هر فونت متعلق به طراح خودش است و با مجوز خودش (بیشتر SIL OFL 1.1) بازتوزیع می‌شود؛ فایل مجوز داخل پوشهٔ هر فونت است. از همهٔ طراحان، به‌ویژه صابر راستی‌کردار و امین عابدی، سپاسگزاریم.

</div>

---

<a id="fonts"></a>

## فهرست فونت‌ها · Fonts

<p align="center"><a href="https://amiryxe.github.io/next-persian-fonts/"><img src="https://raw.githubusercontent.com/amiryxe/next-persian-fonts/main/.github/assets/showcase.png" alt="Font gallery screenshot" width="820"></a></p>

Usage · استفاده: `import { <Export> } from 'next-persian-fonts/<import>'`

<!-- Font tables generated from fonts.json -->

### Iranian fonts · فونت‌های ایرانی

| Font · فونت | Designer · طراح | Import `next-persian-fonts/…` | Export | Weights | License |
|---|---|---|---|---|---|
| **Vazirmatn**<br>وزیرمتن | Saber Rastikerdar | `vazirmatn`<br>`vazirmatn-variable`<br>`vazirmatn-round-dots` | `vazirMatn` ¹<br>`vazirmatnVariable`<br>`vazirmatnRoundDots` | 100–900 (9) | OFL-1.1 |
| **Sahel**<br>ساحل | Saber Rastikerdar | `sahel`<br>`sahel-fd` | `sahel`<br>`sahelFD` ¹ | 400–900 variable | OFL-1.1 |
| **Estedad**<br>استعداد | Amin Abedi | `estedad` | `estedad` | 100–900 variable | OFL-1.1 |
| **Samim**<br>صمیم | Saber Rastikerdar | `samim`<br>`samim-fd` | `samim`<br>`samimFD` ¹ | 400, 500, 700 | OFL-1.1 + Vera |
| **Shabnam**<br>شبنم | Saber Rastikerdar | `shabnam`<br>`shabnam-fd` | `shabnam`<br>`shabnamFD` ¹ | 100–700 (5) | OFL-1.1 + Vera |
| **Tanha**<br>تنها | Saber Rastikerdar | `tanha`<br>`tanha-fd` | `tanha`<br>`tanhaFD` ¹ | 400 | Vera + PD |
| **Parastoo**<br>پرستو | Saber Rastikerdar | `parastoo`<br>`parastoo-fd` | `parastoo`<br>`parastooFD` ¹ | 400, 700 | OFL-1.1 |
| **Gandom**<br>گندم | Saber Rastikerdar | `gandom`<br>`gandom-fd` | `gandom`<br>`gandomFD` ¹ | 400 | OFL-1.1 + Vera |
| **Mikhak**<br>میخک | Amin Abedi | `mikhak`<br>`mikhak-fd` | `mikhak`<br>`mikhakFD` ¹ | 100–900 variable | OFL-1.1 |
| **Vazir Code**<br>وزیر کد | Saber Rastikerdar | `vazir-code`<br>`vazir-code-fd` | `vazirCode`<br>`vazirCodeFD` ¹ | 400 | Vera + PD |
| **Behdad**<br>بهداد | Mohammad Saleh Souzanchi (Font Store) | `behdad` | `behdad` | 400 | OFL-1.1 |
| **Nika**<br>نیکا | Mohammad Saleh Souzanchi (Font Store) | `nika` | `nika` | 400 | OFL-1.1 |

### Google Fonts, bundled offline · فونت‌های Google Fonts (آفلاین)

| Font · فونت | Designer · طراح | Import `next-persian-fonts/…` | Export | Weights | License |
|---|---|---|---|---|---|
| **Lalezar**<br>لاله‌زار | Borna Izadpanah | `lalezar` | `lalezar` | 400 | OFL-1.1 |
| **Markazi Text**<br>مرکزی | Borna Izadpanah | `markazi-text` | `markaziText` | 400–700 variable | OFL-1.1 |
| **Mirza**<br>میرزا | KB-Studio (Kourosh Beigpour) | `mirza` | `mirza` | 400–700 (4) | OFL-1.1 |
| **Reem Kufi**<br>ریم کوفی | Khaled Hosny (Alif Type) | `reem-kufi` | `reemKufi` | 400–700 variable | OFL-1.1 |
| **Noto Naskh Arabic**<br>نوتو نسخ | Google (Noto project) | `noto-naskh-arabic` | `notoNaskhArabic` | 400–700 variable | OFL-1.1 |
| **Noto Sans Arabic**<br>نوتو سنس عربی | Google (Noto project) | `noto-sans-arabic` | `notoSansArabic` | 100–900 variable | OFL-1.1 |
| **Noto Kufi Arabic**<br>نوتو کوفی | Google (Noto project) | `noto-kufi-arabic` | `notoKufiArabic` | 100–900 variable | OFL-1.1 |
| **Noto Nastaliq Urdu**<br>نوتو نستعلیق | Google (Noto project) | `noto-nastaliq-urdu` | `notoNastaliqUrdu` | 400–700 variable | OFL-1.1 |
| **IBM Plex Sans Arabic**<br>آی‌بی‌ام پلکس عربی | IBM (Mike Abbink, Bold Monday) | `ibm-plex-sans-arabic` | `ibmPlexSansArabic` | 100–700 (7) | OFL-1.1 |
| **Amiri**<br>امیری | Khaled Hosny (Alif Type) | `amiri` | `amiri` | 400, 700 + italic | OFL-1.1 |
| **Harmattan**<br>هرمتان | SIL Global | `harmattan` | `harmattan` | 400–700 (4) | OFL-1.1 |
| **Scheherazade New**<br>شهرزاد | SIL Global | `scheherazade-new` | `scheherazadeNew` | 400–700 (4) | OFL-1.1 |
| **Lateef**<br>لطیف | SIL Global | `lateef` | `lateef` | 400–700 (4) | OFL-1.1 |
| **Katibeh**<br>کتیبه | KB-Studio (Kourosh Beigpour) | `katibeh` | `katibeh` | 400 | OFL-1.1 |
| **Aref Ruqaa**<br>عارف رقعه | Abdullah Aref, Khaled Hosny | `aref-ruqaa` | `arefRuqaa` | 400, 700 | OFL-1.1 |
| **Rubik**<br>روبیک | Hubert & Fischer, Meir Sadan, Cyreal, Daniel Grumer | `rubik` | `rubik` | 300–900 variable + italic | OFL-1.1 |
| **Jomhuria**<br>جمهوریا | KB-Studio (Kourosh Beigpour) | `jomhuria` | `jomhuria` | 400 | OFL-1.1 |
| **El Messiri**<br>المسیری | Mohamed Gaber, Jovanny Lemonad | `el-messiri` | `elMessiri` | 400–700 variable | OFL-1.1 |
| **Changa**<br>چنگا | Eduardo Tunni | `changa` | `changa` | 200–800 variable | OFL-1.1 |
| **Baloo Bhaijaan 2**<br>بالو بهایجان | Ek Type | `baloo-bhaijaan-2` | `balooBhaijaan2` | 400–800 variable | OFL-1.1 |
| **Cairo**<br>قاهره | Mohamed Gaber | `cairo` | `cairo` | 200–1000 variable | OFL-1.1 |

¹ Persian digits (FD): Latin digits are shown as Persian digits.

<p dir="rtl">¹ نسخهٔ ارقام فارسی (FD): ارقام لاتین هم فارسی نمایش داده می‌شوند.</p>

Vera = Bitstream Vera license (Latin glyphs), PD = public domain changes. Versions, sources and file changes: **[FONTS.md](https://github.com/amiryxe/next-persian-fonts/blob/main/src/next-persian-fonts/FONTS.md)**.

---

## English

### Features

- **33 Persian font families**, 43 ready-to-use exports: Vazirmatn, Estedad, Sahel, Samim, Shabnam, Mikhak, Parastoo, Gandom, Tanha, Vazir Code, Behdad, Nika, plus 21 Persian-capable Google Fonts (Lalezar, Noto Naskh/Sans/Kufi Arabic, Noto Nastaliq Urdu, Amiri, IBM Plex Sans Arabic, …).
- **Fully offline:** font files ship inside the package; your build and site never depend on Google or a CDN.
- **No layout shift:** loaded with `next/font/local`, preloaded automatically, `font-display: swap`.
- **Only what you import** ends up in your build (one subpath per font).
- **Persian-digit (FD) variants** for the Iranian fonts.
- **TypeScript types**; works with **Next.js 13.2 → 16**, App Router and Pages Router, Turbopack and webpack, React 18/19.
- **Free licenses** (mostly SIL OFL 1.1), fine for commercial projects.

### Installation & Usage (3 steps)

1. Install: `npm install next-persian-fonts` (with pnpm/yarn: `pnpm add next-persian-fonts@^1.1`; recent pnpm versions hold back freshly published releases for a while)
2. Import a font in `app/layout.tsx`: `import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'`
3. Put its class on `<body>`: `<body className={vazirmatnVariable.className}>`

> **Fresh create-next-app project?** Remove the Geist `next/font/google` imports from `app/layout.tsx` (they need the global internet) and delete the `font-family: Arial, Helvetica, sans-serif;` line from the `body` rule in `globals.css`, otherwise it overrides the Persian font.

**App Router**

```tsx
// app/layout.tsx
import './globals.css'
import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatnVariable.className}>{children}</body>
    </html>
  )
}
```

**Pages Router**

```tsx
// pages/_app.tsx
import '@/styles/globals.css'
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

The Pages Router also needs this in `next.config` (Next.js doesn't bundle `node_modules` packages for the Pages Router, so without it the build fails with `ERR_UNSUPPORTED_DIR_IMPORT`; Jest via `next/jest` needs it too, and it's harmless for the App Router):

```js
// next.config.mjs
export default {
  transpilePackages: ['next-persian-fonts'],
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

### Why offline?

When Iran is cut off from the global internet, `next/font/google` can't download fonts at build time (the build fails) and CDN fonts don't load. Here the font files come with `npm install` and are self-hosted by Next.js, so they always work.

### FAQ

- **Several fonts?** Put each font's `.variable` on `<html>` and use `font-family: var(--font-lalezar)` where needed, or put `lalezar.className` on a single element.
- **What are the `FD` exports?** They render Latin digits (123) as Persian digits (۱۲۳). `vazirMatn` always uses Persian digits.
- **Do I need `optimizePackageImports`?** Not with subpath imports. Only for the legacy root import (`from 'next-persian-fonts'`) with webpack: `experimental: { optimizePackageImports: ['next-persian-fonts'] }`.
- **Pages Router or Jest fails with `ERR_UNSUPPORTED_DIR_IMPORT`?** Add `transpilePackages: ['next-persian-fonts']` to `next.config`. Harmless for the App Router.
- **Why are some fonts not preloaded?** Exports with more than 3 files (e.g. `vazirMatn` with 9 weights, `sahelFD`, `shabnam`, `ibmPlexSansArabic`) aren't preloaded, so Next.js doesn't download every weight on every page; only the weights you use load. Variable exports such as `vazirmatnVariable` are the lightest (one file for all weights).
- **pnpm installed 1.0?** Recent pnpm versions hold back freshly published releases for a while. Use `pnpm add next-persian-fonts@^1.1`.
- **Upgrading from 1.0?** Nothing breaks: every 1.0 import path and export still works. `estedadFD` is deprecated (kept on Estedad 7.3); use `estedad`. See the [CHANGELOG](https://github.com/amiryxe/next-persian-fonts/blob/main/CHANGELOG.md).
- **Commercial use?** Yes. All fonts use free licenses (mostly SIL OFL 1.1).

### Contributing

⭐ If this package saved you time, a [star on GitHub](https://github.com/amiryxe/next-persian-fonts) helps other developers find it.

Font suggestions, bug reports and pull requests are welcome on [GitHub](https://github.com/amiryxe/next-persian-fonts/issues). Only fonts with a redistributable license (e.g. OFL) can be added. See [Development](https://github.com/amiryxe/next-persian-fonts#development) for how fonts are added and tested.

### Credits & license

Package code: ISC. Every font belongs to its designer and is redistributed under its own license (mostly SIL OFL 1.1); each font folder contains its license file. Some Google Fonts files were converted to WOFF2 and subset to Arabic + Latin; [FONTS.md](https://github.com/amiryxe/next-persian-fonts/blob/main/src/next-persian-fonts/FONTS.md) lists every change. Thanks to all the type designers, especially Saber Rastikerdar and Amin Abedi.
