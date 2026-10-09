import { CodeBlock } from '@/components/CodeBlock'
import { CopyButton } from '@/components/CopyButton'
import { FontGallery } from '@/components/FontGallery'
import { GitHubIcon, GitHubStarButton } from '@/components/GitHubStarButton'
import { ThemeToggle } from '@/components/ThemeToggle'
import { familyCount, fonts } from '@/lib/fonts'
import pkg from 'next-persian-fonts/package.json'

const GITHUB = 'https://github.com/amiryxe/next-persian-fonts'
const NPM = 'https://www.npmjs.com/package/next-persian-fonts'
const fa = (n: number | string) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

const layoutCode = `// app/layout.tsx
import './globals.css'
import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatnVariable.className}>{children}</body>
    </html>
  )
}`

const pagesCode = `// pages/_app.tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={vazirmatnVariable.className}>
      <Component {...pageProps} />
    </main>
  )
}`

const pagesConfigCode = `// next.config.mjs — needed for the Pages Router (and Jest)
export default {
  transpilePackages: ['next-persian-fonts'],
}`

const tailwind4Code = `/* globals.css */
@import 'tailwindcss';

@theme inline {
  --font-sans: var(--font-vazirmatn-variable), sans-serif;
}`

const tailwind3Code = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: { sans: ['var(--font-vazirmatn-variable)', 'sans-serif'] },
    },
  },
}`

const multiCode = `// app/layout.tsx
import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'
import { lalezar } from 'next-persian-fonts/lalezar'

<html lang="fa" dir="rtl" className={\`\${vazirmatnVariable.variable} \${lalezar.variable}\`}>

/* globals.css */
body { font-family: var(--font-vazirmatn-variable); }
h1   { font-family: var(--font-lalezar); }`

const optimizeCode = `// next.config.mjs (only for: import { sahel } from 'next-persian-fonts' + webpack)
export default {
  experimental: { optimizePackageImports: ['next-persian-fonts'] },
}`

const cssImportCode = `// Vite (React، Vue، Svelte، vanilla) · Gatsby · Astro
// main.jsx / gatsby-browser.js / Layout.astro (frontmatter)
import 'next-persian-fonts/css/vazirmatn-variable.css'

<body class="font-vazirmatn-variable">

/* or in your CSS: */
body { font-family: var(--font-vazirmatn-variable); }`

const cssTailwindCode = `/* Tailwind v4 — main.css */
@import 'tailwindcss';
@import 'next-persian-fonts/css/vazirmatn-variable.css';

@theme inline {
  --font-sans: var(--font-vazirmatn-variable);
}`

const cssHtmlCode = `<!-- plain HTML, no bundler -->
<link rel="stylesheet" href="node_modules/next-persian-fonts/css/vazirmatn-variable.css">

<body class="font-vazirmatn-variable">`

const steps: [string, string, string][] = [
  ['نصب کنید', 'با npm، pnpm، yarn یا bun:', 'npm install next-persian-fonts'],
  ['ایمپورت کنید', 'در فایل app/layout.tsx:', "import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'"],
  ['استفاده کنید', 'کلاس فونت را روی body بگذارید:', '<body className={vazirmatnVariable.className}>'],
]

const code = 'font-mono text-[0.9em]'

const faq: [string, React.ReactNode][] = [
  [
    'چرا فونت‌ها داخل پکیج هستند و از Google Fonts یا CDN استفاده نمی‌کنیم؟',
    <>
      وقتی اینترنت ایران از اینترنت جهانی قطع می‌شود، <code dir="ltr" className={code}>next/font/google</code> نمی‌تواند هنگام build فونت را دانلود کند و build شکست می‌خورد؛ فونت‌های CDN هم برای کاربران باز نمی‌شوند. اینجا فایل فونت‌ها همراه <code dir="ltr" className={code}>npm install</code> می‌آیند و Next.js آن‌ها را روی سایت خودتان میزبانی می‌کند، پس همیشه کار می‌کنند. برای همین فونت‌های فارسی Google Fonts (لاله‌زار، نوتو، امیری، مرکزی و…) هم داخل پکیج قرار گرفته‌اند. در گالری با فیلتر «منبع» می‌توانید فقط آن‌ها را ببینید.
    </>,
  ],
  [
    'چطور چند فونت را با هم استفاده کنم؟',
    <>
      <p>
        به‌جای <code dir="ltr" className={code}>className</code> از <code dir="ltr" className={code}>variable</code> هر فونت استفاده کنید و هر جا لازم است متغیر CSS آن را بنویسید. نام متغیر همیشه <code dir="ltr" className={code}>--font-</code> به‌علاوهٔ مسیر ایمپورت است. ساده‌ترین راه هم این است که <code dir="ltr" className={code}>lalezar.className</code> را مستقیم روی همان المان بگذارید.
      </p>
      <div className="mt-4">
        <CodeBlock title="multiple fonts" code={multiCode} />
      </div>
    </>,
  ],
  [
    'نسخه‌های FD چه هستند؟',
    <>
      در نسخه‌های <b>FD</b> (مثل <code dir="ltr" className={code}>sahelFD</code> و <code dir="ltr" className={code}>samimFD</code>) حتی اعداد انگلیسی (123) هم فارسی (۱۲۳) نمایش داده می‌شوند؛ برای قیمت و تاریخ مفید است. اگر متن شما خودش اعداد فارسی دارد، نسخهٔ معمولی هم کافی است. <code dir="ltr" className={code}>vazirMatn</code> همیشه اعداد فارسی دارد.
    </>,
  ],
  [
    'بدون Next.js هم می‌شود استفاده کرد؟',
    <>
      بله. از نسخهٔ ۱.۲ برای هر فونت یک فایل CSS هست، مثلاً <code dir="ltr" className={code}>{"import 'next-persian-fonts/css/estedad.css'"}</code>، که در Vite، Gatsby، Astro یا با تگ <code dir="ltr" className={code}>{'<link>'}</code> در HTML ساده کار می‌کند. <a href="#without-next" className="text-emerald-700 underline underline-offset-4 dark:text-emerald-400">مثال‌ها</a> را ببینید. این فایل‌ها برای کاربران Next.js هیچ هزینه‌ای ندارند، چون فقط وقتی ایمپورتشان کنید وارد خروجی می‌شوند.
    </>,
  ],
  [
    'optimizePackageImports لازم است؟',
    <>
      <p>
        اگر مثل مثال‌های بالا از مسیر هر فونت ایمپورت کنید (<code dir="ltr" className={code}>next-persian-fonts/estedad</code>)، <b>نه</b>. فقط اگر از ریشهٔ پکیج ایمپورت می‌کنید (روش قدیمی نسخهٔ ۱.۰) و با webpack می‌سازید (پیش‌فرض Next ۱۳ تا ۱۵)، این تنظیم را اضافه کنید تا فونت‌های اضافه دانلود نشوند:
      </p>
      <div className="mt-4">
        <CodeBlock title="next.config.mjs" code={optimizeCode} />
      </div>
    </>,
  ],
  [
    'Pages Router یا Jest خطای ERR_UNSUPPORTED_DIR_IMPORT می‌دهد؟',
    <>
      در <code dir="ltr" className={code}>next.config</code> بنویسید <code dir="ltr" className={code}>{"transpilePackages: ['next-persian-fonts']"}</code>. Pages Router و <code dir="ltr" className={code}>next/jest</code> پکیج‌های node_modules را باندل نمی‌کنند، پس <code dir="ltr" className={code}>next/font/local</code> اجرا نمی‌شود. این تنظیم در App Router هم بی‌ضرر است.
    </>,
  ],
  [
    'با pnpm نسخهٔ قدیمی (۱.۰) نصب شد؟',
    <>
      نسخه‌های جدید pnpm بسته‌هایی را که تازه منتشر شده‌اند تا مدتی نصب نمی‌کنند. نسخه را صریح بنویسید: <code dir="ltr" className={code}>pnpm add next-persian-fonts@^1.2</code> (یا <code dir="ltr" className={code}>npm install next-persian-fonts@latest</code>).
    </>,
  ],
  [
    'چرا بعضی فونت‌ها preload نمی‌شوند؟',
    <>
      خروجی‌هایی که بیش از ۳ فایل دارند (مثل <code dir="ltr" className={code}>vazirMatn</code> با ۹ وزن یا <code dir="ltr" className={code}>sahelFD</code>) preload نمی‌شوند تا Next.js همهٔ وزن‌ها را در هر صفحه از قبل دانلود نکند؛ فقط وزن‌هایی که واقعاً استفاده می‌شوند بارگذاری می‌شوند. برای کمترین حجم، نسخه‌های متغیر مثل <code dir="ltr" className={code}>vazirmatnVariable</code> را انتخاب کنید.
    </>,
  ],
  [
    'estedadFD چه شد؟',
    <>
      استعداد ۸ دیگر نسخهٔ ارقام فارسی ندارد. <code dir="ltr" className={code}>estedadFD</code> برای سازگاری روی نسخهٔ ۷.۳ مانده و منسوخ است؛ برای پروژهٔ جدید از <code dir="ltr" className={code}>estedad</code> استفاده کنید.
    </>,
  ],
  [
    'برای پروژهٔ تجاری رایگان است؟',
    <>
      بله. همهٔ فونت‌ها مجوز آزاد دارند (بیشترشان SIL OFL 1.1) و استفاده در سایت‌های تجاری مجاز است. مجوز هر فونت روی کارت آن در گالری لینک شده است.
    </>,
  ],
]

function Section({ id, title, kicker, children }: { id: string; title: string; kicker?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      {kicker && <p className="mb-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">{kicker}</p>}
      <h2 className="mb-8 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
      {children}
    </section>
  )
}

export default function Home() {
  const variantCount = fonts.filter((f) => !f.deprecated).length
  const googleCount = new Set(fonts.filter((f) => f.googleFonts).map((f) => f.familyId)).size
  return (
    <>
      <header className="sticky top-0 z-30 h-16 border-b border-zinc-200/80 bg-white/80 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-full max-w-6xl items-center gap-6 px-4">
          <a href="#top" className="flex items-center gap-2 font-extrabold">
            <span className="grid size-8 place-items-center rounded-lg bg-emerald-700 text-lg text-white">ف</span>
            <span dir="ltr">Next Persian Fonts</span>
          </a>
          <nav className="hidden items-center gap-5 text-sm text-zinc-600 md:flex dark:text-zinc-400">
            <a href="#fonts" className="hover:text-zinc-950 dark:hover:text-white">فونت‌ها</a>
            <a href="#usage" className="hover:text-zinc-950 dark:hover:text-white">نصب و استفاده</a>
            <a href="#tailwind" className="hover:text-zinc-950 dark:hover:text-white">Tailwind</a>
            <a href="#faq" className="hover:text-zinc-950 dark:hover:text-white">پرسش‌ها</a>
            <a href="#compat" className="hover:text-zinc-950 dark:hover:text-white">سازگاری</a>
          </nav>
          <div className="ms-auto flex items-center gap-2">
            <GitHubStarButton compact />
            <a href={NPM} target="_blank" rel="noreferrer" className="hidden rounded-lg border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-100 sm:inline-block dark:border-zinc-800 dark:hover:bg-zinc-800">npm</a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="top">
        <div className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_80%_-10%,rgb(16_185_129/0.15),transparent),radial-gradient(40rem_20rem_at_0%_0%,rgb(14_165_233/0.12),transparent)]" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <span dir="ltr">v{pkg.version}</span> · سازگار با Next.js ۱۳.۲ تا ۱۶
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              فونت‌های فارسی، <span className="text-emerald-700 dark:text-emerald-400">آماده برای Next.js</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              {fa(familyCount)} خانوادهٔ فونت فارسی رایگان، داخل خود پکیج: وزیرمتن، استعداد، ساحل و فونت‌های فارسی Google Fonts مثل لاله‌زار و نوتو. بدون گوگل و CDN، پس حتی وقتی اینترنت بین‌الملل قطع است هم سایت و build شما کار می‌کند. برای Vite، Gatsby، Astro و HTML ساده هم <a href="#without-next" className="font-medium text-emerald-700 underline underline-offset-4 hover:text-emerald-800 dark:text-emerald-400">فایل CSS آماده</a> دارد.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-zinc-300 bg-white py-2 pe-2 ps-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                <code dir="ltr" className="font-mono text-sm">npm install next-persian-fonts</code>
                <CopyButton text="npm install next-persian-fonts" />
              </div>
              <a href="#fonts" className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">مشاهدهٔ فونت‌ها ←</a>
              <GitHubStarButton className="w-full justify-center rounded-xl sm:w-auto" />
            </div>
            <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-4 text-center">
              {[
                [fa(familyCount), 'خانوادهٔ فونت'],
                [fa(variantCount), 'نسخه (FD، متغیر و…)'],
                [fa(googleCount), 'فونت Google، آفلاین'],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl border border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <dt className="text-xs text-zinc-500 dark:text-zinc-400">{l}</dt>
                  <dd className="mt-1 text-2xl font-extrabold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <Section id="fonts" title="گالری فونت‌ها" kicker="پیش‌نمایش زنده">
          <FontGallery fonts={fonts} />
        </Section>

        <div className="border-y border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/30">
          <Section id="usage" title="نصب و استفاده در ۳ قدم" kicker="راهنما">
            <ol className="mb-10 grid gap-4 md:grid-cols-3">
              {steps.map(([t, d, c], i) => (
                <li key={t} className="flex min-w-0 flex-col rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-700 text-sm font-bold text-white">{fa(i + 1)}</span>
                    <h3 className="font-bold">{t}</h3>
                  </div>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{d}</p>
                  <div className="mt-2 flex items-start gap-2 rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800/70">
                    <code dir="ltr" className="min-w-0 flex-1 break-all text-left font-mono text-xs leading-5">{c}</code>
                    <CopyButton text={c} />
                  </div>
                </li>
              ))}
            </ol>
            <div className="mb-8 rounded-2xl border border-amber-300/60 bg-amber-50 p-5 text-sm leading-7 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              <b>پروژهٔ تازهٔ create-next-app دارید؟</b> در <code dir="ltr" className={code}>app/layout.tsx</code> ایمپورت فونت‌های Geist از <code dir="ltr" className={code}>next/font/google</code> را حذف کنید (به اینترنت جهانی نیاز دارند) و در <code dir="ltr" className={code}>globals.css</code> خط <code dir="ltr" className={code}>font-family: Arial, Helvetica, sans-serif;</code> را از قانون <code dir="ltr" className={code}>body</code> پاک کنید تا جلوی فونت فارسی را نگیرد.
            </div>
            <h3 className="mb-4 text-lg font-bold">مثال کامل برای کپی</h3>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <CodeBlock title="App Router — app/layout.tsx" code={layoutCode} />
              <div className="space-y-4">
                <CodeBlock title="Pages Router — pages/_app.tsx" code={pagesCode} />
                <CodeBlock title="Pages Router — next.config.mjs" code={pagesConfigCode} />
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              فونت دیگری می‌خواهید؟ در گالری بالا روی «کپی» کارت آن فونت بزنید و خط ایمپورت را جایگزین کنید. در Pages Router تنظیم <code dir="ltr" className={code}>transpilePackages</code> لازم است (Next.js پکیج‌های node_modules را در Pages Router باندل نمی‌کند و بدون آن build خطا می‌دهد)؛ در App Router بی‌ضرر است. برای راست‌چین شدن، در <code dir="ltr" className={code}>pages/_document.tsx</code> بنویسید <code dir="ltr" className={code}>{'<Html lang="fa" dir="rtl">'}</code>.
            </p>
            <div id="without-next" className="mt-10 scroll-mt-20">
              <h3 className="mb-2 text-lg font-bold">استفاده در پروژه‌های غیر Next.js (Vite، Gatsby، Astro، HTML ساده)</h3>
              <p className="mb-4 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                برای هر فونت یک فایل CSS آماده هم هست: <code dir="ltr" className={`${code} whitespace-nowrap`}>next-persian-fonts/css/&lt;name&gt;.css</code>. این فایل <code dir="ltr" className={`${code} whitespace-nowrap`}>@font-face</code> را با همان فایل‌های فونت داخل پکیج تعریف می‌کند و یک متغیر CSS (مثل <code dir="ltr" className={`${code} whitespace-nowrap`}>--font-vazirmatn-variable</code>) و یک کلاس (مثل <code dir="ltr" className={`${code} whitespace-nowrap`}>.font-vazirmatn-variable</code>) می‌سازد. به‌جای name همان مسیر ایمپورت فونت را بنویسید؛ در گالری بالا با دکمهٔ «CSS» کد هر فونت را ببینید. اگر از Next.js استفاده می‌کنید، این فایل‌ها هیچ چیزی به سایت شما اضافه نمی‌کنند.
              </p>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <CodeBlock title="Vite / Gatsby / Astro" code={cssImportCode} />
                <div className="space-y-4">
                  <CodeBlock title="Tailwind v4" code={cssTailwindCode} />
                  <CodeBlock title="index.html" code={cssHtmlCode} />
                </div>
              </div>
            </div>
            <aside aria-label="حمایت از پروژه" className="mt-8 flex flex-col gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between dark:bg-emerald-500/10">
              <p className="leading-7 text-emerald-950 dark:text-emerald-100">
                <span aria-hidden="true">⭐ </span>
                <b>این پکیج به کارتان آمد؟</b> با یک ستاره در گیت‌هاب از پروژه حمایت کنید؛ همین ستاره‌ها کمک می‌کنند توسعه‌دهنده‌های بیشتری آن را پیدا کنند و انگیزهٔ ادامهٔ کار هستند.
              </p>
              <a href={GITHUB} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:self-auto">
                <GitHubIcon />
                ستاره بدهید
              </a>
            </aside>
          </Section>
        </div>

        <Section id="tailwind" title="استفاده با Tailwind CSS" kicker="Tailwind v4 و v3">
          <p className="mb-6 max-w-3xl leading-7 text-zinc-600 dark:text-zinc-400">
            روی <code dir="ltr" className={code}>html</code> به‌جای <code dir="ltr" className={code}>className</code> از <code dir="ltr" className={code}>vazirmatnVariable.variable</code> استفاده کنید و فونت را به Tailwind معرفی کنید. بعد از آن کلاس <code dir="ltr" className={code}>font-sans</code> (پیش‌فرض Tailwind) همان فونت فارسی است.
          </p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CodeBlock title="Tailwind v4 — globals.css" code={tailwind4Code} />
            <CodeBlock title="Tailwind v3 — tailwind.config.js" code={tailwind3Code} />
          </div>
        </Section>

        <div className="border-y border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/30">
          <Section id="faq" title="پرسش‌های رایج" kicker="سؤال دارید؟">
            <div className="space-y-3">
              {faq.map(([q, a], i) => (
                <details key={q} open={i === 0} className="group rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold [&::-webkit-details-marker]:hidden">
                    {q}
                    <span aria-hidden className="text-zinc-400 transition group-open:rotate-45">+</span>
                  </summary>
                  <div className="mt-3 leading-8 text-zinc-600 dark:text-zinc-300">{a}</div>
                </details>
              ))}
            </div>
          </Section>
        </div>

        <Section id="compat" title="سازگاری" kicker="تست‌شده در CI">
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full min-w-[36rem] text-sm">
              <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                <tr>
                  <th className="p-3 text-start font-medium">Next.js</th>
                  <th className="p-3 text-start font-medium">React</th>
                  <th className="p-3 text-start font-medium">باندلر</th>
                  <th className="p-3 text-start font-medium">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800" dir="ltr">
                {[
                  ['16.x', '19', 'Turbopack + webpack'],
                  ['15.x', '19', 'webpack + Turbopack'],
                  ['14.x', '18', 'webpack'],
                  ['13.5', '18', 'webpack'],
                ].map(([n, r, b]) => (
                  <tr key={n}>
                    <td className="p-3 text-right font-mono">{n}</td>
                    <td className="p-3 text-right font-mono">{r}</td>
                    <td className="p-3 text-right">{b}</td>
                    <td className="p-3 text-right text-emerald-700 dark:text-emerald-400">✓</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            حداقل نسخهٔ پشتیبانی‌شده Next.js ۱۳.۲ است (نسخه‌ای که <code dir="ltr" className="font-mono">next/font</code> در خود Next.js قرار گرفت). App Router و Pages Router هر دو پشتیبانی می‌شوند.
          </p>
        </Section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between dark:text-zinc-400">
          <p>
            ساخته‌شده توسط <a className="font-medium text-zinc-800 hover:text-emerald-600 dark:text-zinc-200" href="https://github.com/amiryxe" target="_blank" rel="noreferrer">امیر صالحی</a>. کد پکیج با مجوز ISC؛ هر فونت با مجوز سازندهٔ خودش (<a className="underline hover:text-emerald-600" href={`${GITHUB}/blob/main/src/next-persian-fonts/FONTS.md`} target="_blank" rel="noreferrer">فهرست مجوزها</a>).
          </p>
          <p className="flex gap-4">
            <a href={GITHUB} target="_blank" rel="noreferrer" className="hover:text-emerald-600">GitHub</a>
            <a href={NPM} target="_blank" rel="noreferrer" className="hover:text-emerald-600">npm</a>
            <a href={`${GITHUB}/blob/main/CHANGELOG.md`} target="_blank" rel="noreferrer" className="hover:text-emerald-600">تغییرات</a>
          </p>
        </div>
      </footer>
    </>
  )
}
