import { CodeBlock } from '@/components/CodeBlock'
import { CopyButton } from '@/components/CopyButton'
import { FontGallery } from '@/components/FontGallery'
import { ThemeToggle } from '@/components/ThemeToggle'
import { familyCount, fonts } from '@/lib/fonts'
import pkg from 'next-persian-fonts/package.json'

const GITHUB = 'https://github.com/amiryxe/next-persian-fonts'
const NPM = 'https://www.npmjs.com/package/next-persian-fonts'
const fa = (n: number | string) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

const layoutCode = `// app/layout.tsx
import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatnVariable.className}>
      <body>{children}</body>
    </html>
  )
}`

const variableCode = `// app/layout.tsx — expose several fonts as CSS variables
import { estedad } from 'next-persian-fonts/estedad'
import { vazirCode } from 'next-persian-fonts/vazir-code'

<html lang="fa" dir="rtl" className={\`\${estedad.variable} \${vazirCode.variable}\`}>

/* any CSS file */
body { font-family: var(--font-estedad), system-ui, sans-serif; }
code { font-family: var(--font-vazir-code), monospace; }`

const tailwind4Code = `/* app/globals.css — Tailwind CSS v4 */
@import 'tailwindcss';

@theme inline {
  --font-sans: var(--font-estedad), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-vazir-code), ui-monospace, monospace;
}`

const tailwind3Code = `// tailwind.config.ts — Tailwind CSS v3
import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-estedad)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-vazir-code)', 'monospace'],
      },
    },
  },
} satisfies Config`

const pagesCode = `// pages/_app.tsx — Pages Router
import type { AppProps } from 'next/app'
import { samim } from 'next-persian-fonts/samim'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={samim.className}>
      <Component {...pageProps} />
    </main>
  )
}`

const googleCode = `// Fonts that are on Google Fonts are best loaded with next/font/google
import { Lalezar, Noto_Naskh_Arabic, Markazi_Text } from 'next/font/google'

const lalezar = Lalezar({ weight: '400', subsets: ['arabic'], variable: '--font-lalezar' })
const naskh = Noto_Naskh_Arabic({ subsets: ['arabic'], variable: '--font-naskh' })
const markazi = Markazi_Text({ subsets: ['arabic'], variable: '--font-markazi' })`

const googleFonts = [
  ['Lalezar', 'لاله‌زار', 'Lalezar'],
  ['Noto Naskh Arabic', 'نوتو نسخ', 'Noto+Naskh+Arabic'],
  ['Noto Sans Arabic', 'نوتو سنس', 'Noto+Sans+Arabic'],
  ['Noto Nastaliq Urdu', 'نوتو نستعلیق', 'Noto+Nastaliq+Urdu'],
  ['Markazi Text', 'مرکزی', 'Markazi+Text'],
  ['Vazirmatn', 'وزیرمتن', 'Vazirmatn'],
  ['Reem Kufi', 'ریم کوفی', 'Reem+Kufi'],
  ['IBM Plex Sans Arabic', 'آی‌بی‌ام پلکس', 'IBM+Plex+Sans+Arabic'],
  ['Amiri', 'امیری', 'Amiri'],
  ['Mirza', 'میرزا', 'Mirza'],
]

function Section({ id, title, kicker, children }: { id: string; title: string; kicker?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      {kicker && <p className="mb-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">{kicker}</p>}
      <h2 className="mb-8 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
      {children}
    </section>
  )
}

export default function Home() {
  const variantCount = fonts.filter((f) => !f.deprecated).length
  return (
    <>
      <header className="sticky top-0 z-30 h-16 border-b border-zinc-200/80 bg-white/80 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-full max-w-6xl items-center gap-6 px-4">
          <a href="#top" className="flex items-center gap-2 font-extrabold">
            <span className="grid size-8 place-items-center rounded-lg bg-emerald-600 text-lg text-white">ف</span>
            <span dir="ltr">Next Persian Fonts</span>
          </a>
          <nav className="hidden items-center gap-5 text-sm text-zinc-600 md:flex dark:text-zinc-400">
            <a href="#fonts" className="hover:text-zinc-950 dark:hover:text-white">فونت‌ها</a>
            <a href="#usage" className="hover:text-zinc-950 dark:hover:text-white">استفاده</a>
            <a href="#tailwind" className="hover:text-zinc-950 dark:hover:text-white">Tailwind</a>
            <a href="#google" className="hover:text-zinc-950 dark:hover:text-white">Google Fonts</a>
            <a href="#compat" className="hover:text-zinc-950 dark:hover:text-white">سازگاری</a>
          </nav>
          <div className="ms-auto flex items-center gap-2">
            <a href={GITHUB} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800">GitHub</a>
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
              فونت‌های فارسی، <span className="text-emerald-600 dark:text-emerald-400">آماده برای Next.js</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              {fa(familyCount)} خانوادهٔ فونت فارسی آزاد و {fa(variantCount)} نسخهٔ آماده، بارگذاری‌شده با <code dir="ltr" className="font-mono text-base">next/font/local</code>: میزبانی روی سرور خودتان، بدون CDN، بدون پرش صفحه (CLS) و با پشتیبانی کامل از تایپ‌اسکریپت.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-zinc-300 bg-white py-2 pe-2 ps-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                <code dir="ltr" className="font-mono text-sm">npm install next-persian-fonts</code>
                <CopyButton text="npm install next-persian-fonts" />
              </div>
              <a href="#fonts" className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">مشاهدهٔ فونت‌ها ←</a>
            </div>
            <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-4 text-center">
              {[
                [fa(familyCount), 'خانوادهٔ فونت'],
                [fa(variantCount), 'خروجی آماده'],
                ['OFL', 'مجوز آزاد'],
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
          <Section id="usage" title="نحوهٔ استفاده" kicker="شروع سریع">
            <ol className="mb-8 grid gap-4 md:grid-cols-3">
              {[
                ['نصب', 'پکیج را با npm، pnpm، yarn یا bun نصب کنید.'],
                ['ایمپورت', 'هر فونت از مسیر جداگانهٔ خودش ایمپورت می‌شود تا فقط همان فونت در خروجی بیاید.'],
                ['اعمال', 'className یا متغیر CSS فونت را روی html یا body بگذارید.'],
              ].map(([t, d], i) => (
                <li key={t} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <span className="grid size-8 place-items-center rounded-full bg-emerald-600 text-sm font-bold text-white">{fa(i + 1)}</span>
                  <h3 className="mt-3 font-bold">{t}</h3>
                  <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{d}</p>
                </li>
              ))}
            </ol>
            <div className="grid gap-6 lg:grid-cols-2">
              <CodeBlock title="App Router — className" code={layoutCode} />
              <CodeBlock title="CSS variables" code={variableCode} />
              <CodeBlock title="Pages Router" code={pagesCode} />
              <div className="rounded-2xl border border-amber-300/60 bg-amber-50 p-5 text-sm leading-7 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                <h3 className="mb-2 font-bold">نکته‌های مهم</h3>
                <ul className="list-disc space-y-1 ps-5">
                  <li>از ایمپورت مسیری (مثل <code dir="ltr" className="font-mono">next-persian-fonts/samim</code>) استفاده کنید؛ ایمپورت از ریشهٔ پکیج فقط برای سازگاری با نسخهٔ ۱.۰ است.</li>
                  <li>نسخه‌های <b>FD</b> ارقام انگلیسی را هم فارسی نمایش می‌دهند (مثلاً قیمت‌ها و تاریخ‌ها).</li>
                  <li>فونت‌های متغیر (Variable) همهٔ وزن‌ها را در یک فایل دارند و حجم کمتری دارند.</li>
                  <li><code dir="ltr" className="font-mono">estedadFD</code> منسوخ شده و روی استعداد ۷.۳ مانده است؛ برای پروژه‌های جدید از <code dir="ltr" className="font-mono">estedad</code> استفاده کنید.</li>
                </ul>
              </div>
            </div>
          </Section>
        </div>

        <Section id="tailwind" title="استفاده با Tailwind CSS" kicker="Tailwind v3 و v4">
          <div className="grid gap-6 lg:grid-cols-2">
            <CodeBlock title="Tailwind v4 — globals.css" code={tailwind4Code} />
            <CodeBlock title="Tailwind v3 — tailwind.config.ts" code={tailwind3Code} />
          </div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            در هر دو حالت، کلاس <code dir="ltr" className="font-mono">estedad.variable</code> را روی تگ <code dir="ltr" className="font-mono">html</code> بگذارید تا متغیر CSS تعریف شود.
          </p>
        </Section>

        <div className="border-y border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/30">
          <Section id="google" title="فونت‌های فارسی در Google Fonts" kicker="next/font/google">
            <p className="mb-6 max-w-3xl leading-7 text-zinc-600 dark:text-zinc-400">
              فونت‌هایی که در Google Fonts موجودند در این پکیج قرار نگرفته‌اند، چون Next.js خودش آن‌ها را با <code dir="ltr" className="font-mono">next/font/google</code> هنگام بیلد دانلود و روی سایت شما میزبانی می‌کند.
            </p>
            <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
              <ul className="grid grid-cols-2 gap-2 self-start">
                {googleFonts.map(([en, faName, q]) => (
                  <li key={en}>
                    <a href={`https://fonts.google.com/specimen/${q}`} target="_blank" rel="noreferrer" className="flex flex-col rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/50">
                      <span className="font-semibold">{faName}</span>
                      <span dir="ltr" className="text-left text-xs text-zinc-500">{en}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <CodeBlock title="next/font/google" code={googleCode} />
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
                    <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">✓</td>
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
