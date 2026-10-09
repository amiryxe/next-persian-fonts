'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { cssFonts } from '@/lib/css-fonts.generated'
import type { FontEntry } from '@/lib/fonts'
import { CopyButton } from './CopyButton'

const SAMPLES = [
  'زندگی صحنهٔ یکتای هنرمندی ماست؛ هر کسی نغمهٔ خود خواند و از صحنه رود.',
  'ابجد هوز حطی کلمن سعفص قرشت ثخذ ضظغ — پژوهش، گچ، ژاله، چتر',
  'Next.js 16 و فونت‌های فارسی: سرعت بالا، بدون CLS، با 0123456789',
]

const CATEGORIES: Record<string, string> = {
  all: 'همه',
  'sans-serif': 'بدون گیره',
  serif: 'گیره‌دار',
  display: 'نمایشی',
  calligraphy: 'خوشنویسی',
  monospace: 'تک‌فاصله',
}

const toPersianDigits = (s: string) => s.replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])
const toLatinDigits = (s: string) => s.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
const faNum = (n: number | string) => toPersianDigits(String(n))

function weightLabel(f: FontEntry) {
  if (f.isVariable) return `متغیر ${faNum(f.weights[0])}–${faNum(f.weights[f.weights.length - 1])}`
  return f.weights.length === 1 ? `وزن ${faNum(f.weights[0])}` : `${faNum(f.weights.length)} وزن`
}

function nearestWeight(f: FontEntry, w: number) {
  if (f.isVariable) return Math.min(Math.max(w, f.weights[0]), f.weights[f.weights.length - 1])
  return f.weights.reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a))
}

/** A dimension along which the variants of one family differ. */
type Axis = { key: string; label: string; value: (f: FontEntry) => string; names: Record<string, string> }

const AXES: Axis[] = [
  { key: 'digits', label: 'ارقام', value: (f) => f.digits, names: { persian: '۱۲۳ فارسی', latin: '123 لاتین', none: 'بدون رقم لاتین' } },
  { key: 'kind', label: 'نوع', value: (f) => (f.isVariable ? 'variable' : 'static'), names: { static: 'ثابت', variable: 'متغیر' } },
  { key: 'dots', label: 'نقطه‌ها', value: (f) => (f.subpath.includes('round-dots') ? 'round' : 'standard'), names: { standard: 'معمولی', round: 'گرد' } },
]

export type Family = {
  id: string
  name: string
  nameFa: string
  designer: string
  category: string
  googleFonts: boolean
  hasItalic: boolean
  variants: FontEntry[]
}

export function groupFamilies(fonts: FontEntry[]): Family[] {
  const map = new Map<string, Family>()
  for (const f of fonts) {
    const fam = map.get(f.familyId) ?? { id: f.familyId, name: f.name, nameFa: f.nameFa, designer: f.designer, category: f.category, googleFonts: f.googleFonts, hasItalic: false, variants: [] }
    fam.variants.push(f)
    fam.hasItalic ||= f.hasItalic
    map.set(f.familyId, fam)
  }
  return [...map.values()]
}

/** Axes that have more than one value and are not just a mirror of an axis already shown. */
function axesFor(variants: FontEntry[]) {
  const sig = (ax: Axis) => {
    const seen: string[] = []
    return variants.map((v) => { const x = ax.value(v); if (!seen.includes(x)) seen.push(x); return seen.indexOf(x) }).join()
  }
  const shown: { axis: Axis; sig: string }[] = []
  for (const axis of AXES) {
    const values = new Set(variants.map(axis.value))
    if (values.size < 2) continue
    const s = sig(axis)
    if (shown.some((x) => x.sig === s)) continue
    shown.push({ axis, sig: s })
  }
  return shown.map((x) => x.axis)
}

/** Static exports with many files (e.g. vazirMatn: 9 weights) are heavy; prefer a variable sibling. */
const HEAVY_FILES = 6

function defaultVariant(variants: FontEntry[], persianDigits: boolean) {
  const want = persianDigits ? 'persian' : 'latin'
  const score = (f: FontEntry) =>
    (f.deprecated ? 0 : 8) + (f.fileCount > HEAVY_FILES ? 0 : 4) + (f.digits === want ? 2 : 0) + (f.subpath.includes('round-dots') ? 0 : 1)
  return variants.reduce((best, f) => (score(f) > score(best) ? f : best))
}

/** Pick the variant with `axis = value` that keeps as many of the current variant's other properties as possible. */
function switchVariant(variants: FontEntry[], current: FontEntry, axis: Axis, value: string) {
  const candidates = variants.filter((v) => axis.value(v) === value)
  const score = (f: FontEntry) => AXES.filter((a) => a.value(f) === a.value(current)).length + (f.deprecated ? 0 : 0.5)
  return candidates.reduce((best, f) => (score(f) > score(best) ? f : best))
}

type CodeMode = 'next' | 'css'

const chip = 'cursor-pointer select-none rounded-md px-2.5 py-1 text-xs transition peer-checked:bg-emerald-700 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500 peer-focus-visible:ring-offset-1 dark:peer-focus-visible:ring-offset-zinc-900 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'

function FamilyCard({
  family,
  selected,
  onSelect,
  persianDigits,
  hideDeprecated,
  preview,
  weight,
  setWeight,
  size,
  codeMode,
}: {
  family: Family
  selected: string | undefined
  onSelect: (exportName: string) => void
  persianDigits: boolean
  hideDeprecated: boolean
  preview: string
  weight: number
  setWeight: (w: number) => void
  size: number
  codeMode: CodeMode
}) {
  const [italic, setItalic] = useState(false)
  // Only apply the font (and so download it) once the card is close to the viewport.
  const ref = useRef<HTMLLIElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || visible) return
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setVisible(true)
        io.disconnect()
      }
    }, { rootMargin: '400px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [visible])
  const variants = hideDeprecated ? family.variants.filter((v) => !v.deprecated) : family.variants
  const f = variants.find((v) => v.exportName === selected) ?? defaultVariant(variants, persianDigits)
  const axes = axesFor(variants)
  const css = cssFonts[f.exportName]
  const snippet = codeMode === 'css' ? `import 'next-persian-fonts/css/${css.file}'` : `import { ${f.exportName} } from 'next-persian-fonts/${f.subpath}'`
  const w = nearestWeight(f, weight)
  const canItalic = f.hasItalic
  const headingId = `family-${family.id}`

  return (
    <li
      ref={ref}
      data-family={family.id}
      data-variant={f.exportName}
      aria-labelledby={headingId}
      className="group flex min-w-0 flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-emerald-400/70 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-emerald-500/50"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 id={headingId} className="text-lg font-bold">
            {family.nameFa} <span className="font-normal text-zinc-500 dark:text-zinc-400" dir="ltr">{family.name}</span>
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{family.designer}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 text-[11px]" aria-live="polite">
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{weightLabel(f)}</span>
          {f.digits === 'persian' && <span className="rounded-full bg-sky-50 px-2 py-0.5 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">ارقام فارسی (FD)</span>}
          {f.digits === 'none' && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">فقط فارسی</span>}
          {family.googleFonts && <span className="rounded-full bg-violet-50 px-2 py-0.5 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300" title="در Google Fonts هم هست؛ اینجا به‌صورت محلی و آفلاین">Google Fonts · آفلاین</span>}
          {f.deprecated && <span className="rounded-full bg-rose-50 px-2 py-0.5 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">منسوخ</span>}
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300" dir="ltr">v{f.version}</span>
        </div>
      </div>

      {(axes.length > 0 || canItalic) && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          {axes.map((axis) => {
            const values = [...new Set(variants.map(axis.value))]
            return (
              <fieldset key={axis.key} className="flex min-w-0 items-center gap-2">
                <legend className="sr-only">{axis.label} — {family.nameFa}</legend>
                <span aria-hidden className="text-xs text-zinc-500 dark:text-zinc-400">{axis.label}</span>
                <div className="inline-flex flex-wrap rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-700">
                  {values.map((value) => {
                    const onlyDeprecated = variants.filter((v) => axis.value(v) === value).every((v) => v.deprecated)
                    return (
                      <label key={value} className="relative">
                        <input
                          type="radio"
                          className="peer sr-only"
                          name={`${family.id}-${axis.key}`}
                          value={value}
                          checked={axis.value(f) === value}
                          onChange={() => onSelect(switchVariant(variants, f, axis, value).exportName)}
                        />
                        <span className={chip}>
                          {axis.names[value] ?? value}
                          {onlyDeprecated && <span className="opacity-75"> (منسوخ)</span>}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            )
          })}
          {canItalic && (
            <label className="relative">
              <input type="checkbox" className="peer sr-only" checked={italic} onChange={(e) => setItalic(e.target.checked)} />
              <span className={`${chip} inline-block border border-zinc-200 dark:border-zinc-700`}>
                <i>ایتالیک</i>
              </span>
            </label>
          )}
        </div>
      )}

      <p
        className="my-5 min-h-24 [overflow-wrap:anywhere] leading-[1.7] text-zinc-900 dark:text-zinc-50"
        style={{ fontFamily: visible ? f.fontFamily : undefined, fontWeight: w, fontSize: size, fontStyle: canItalic && italic ? 'italic' : undefined, lineHeight: f.category === 'calligraphy' ? 2.4 : undefined }}
      >
        {preview || 'متن نمونه'}
      </p>

      <div className="mt-auto space-y-3">
        {!f.isVariable && f.weights.length > 1 && (
          <div className="flex flex-wrap gap-1" role="group" aria-label={`وزن‌های موجود ${family.nameFa}`}>
            {f.weights.map((x) => (
              <button
                key={x}
                type="button"
                aria-pressed={x === w}
                onClick={() => setWeight(x)}
                className={`rounded px-1.5 py-0.5 text-[11px] ${x === w ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}
              >
                {faNum(x)}
              </button>
            ))}
          </div>
        )}
        {f.deprecated && (
          <p className="text-xs leading-5 text-rose-700 dark:text-rose-300">
            این نسخه منسوخ است و فقط برای سازگاری با نسخه‌های قبلی (نسخهٔ <span dir="ltr">{f.version}</span>) باقی مانده؛ برای پروژهٔ جدید نسخهٔ دیگر را انتخاب کنید.
          </p>
        )}
        <div className="flex items-center gap-2 rounded-lg bg-zinc-50 p-2 dark:bg-zinc-950/60">
          <code data-snippet dir="ltr" className="min-w-0 flex-1 truncate text-left font-mono text-xs text-zinc-700 dark:text-zinc-300" title={snippet}>{snippet}</code>
          <CopyButton text={snippet} />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
          <span dir="ltr" className="font-mono">{codeMode === 'css' ? `.${css.className} · ${f.cssVariable}` : f.cssVariable}</span>
          <a className="hover:text-emerald-600 dark:hover:text-emerald-400" href={f.licenseUrl} target="_blank" rel="noreferrer">مجوز: <span dir="ltr">{f.license.split(' ')[0]}</span></a>
          <a className="hover:text-emerald-600 dark:hover:text-emerald-400" href={f.sourceUrl} target="_blank" rel="noreferrer">منبع ↗</a>
        </div>
      </div>
    </li>
  )
}

export function FontGallery({ fonts }: { fonts: FontEntry[] }) {
  const [text, setText] = useState(SAMPLES[0])
  const [weight, setWeight] = useState(400)
  const [size, setSize] = useState(28)
  const [persianDigits, setPersianDigits] = useState(true)
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [hideDeprecated, setHideDeprecated] = useState(true)
  const [source, setSource] = useState<'all' | 'iranian' | 'google'>('all')
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [codeMode, setCodeMode] = useState<CodeMode>('next')
  const families = useMemo(() => groupFamilies(fonts), [fonts])

  // The global digits toggle resets every card to its default variant for that digit style.
  const changeDigits = (fa: boolean) => {
    setPersianDigits(fa)
    setSelected({})
  }

  const preview = persianDigits ? toPersianDigits(text) : toLatinDigits(text)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return families.filter(
      (fam) =>
        (category === 'all' || fam.category === category) &&
        (source === 'all' || (source === 'google') === fam.googleFonts) &&
        (!q || [fam.name, fam.nameFa, fam.id, ...fam.variants.flatMap((v) => [v.exportName, v.subpath])].some((s) => s.toLowerCase().includes(q))),
    )
  }, [families, category, query, source])

  return (
    <div>
      <div className="z-20 -mx-4 lg:sticky lg:top-16 mb-6 border-y border-zinc-200 bg-white/85 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border dark:border-zinc-800 dark:bg-zinc-950/85">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-2">
            <label htmlFor="sample" className="text-xs font-medium text-zinc-500 dark:text-zinc-400">متن نمونه</label>
            <input
              id="sample"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="متن دلخواه خود را بنویسید…"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base outline-none ring-emerald-500/30 focus:border-emerald-500 focus:ring-4 dark:border-zinc-700 dark:bg-zinc-900"
            />
            <div className="flex flex-wrap gap-1.5">
              {SAMPLES.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setText(s)}
                  className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-600 hover:border-emerald-500 hover:text-emerald-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-emerald-300"
                >
                  نمونهٔ {faNum(i + 1)}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-[repeat(3,minmax(0,11rem))]">
            <label className="flex flex-col gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span>وزن: <b className="text-zinc-900 dark:text-zinc-100">{faNum(weight)}</b></span>
              <input type="range" min={100} max={900} step={100} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="accent-emerald-600" aria-label="وزن فونت" />
            </label>
            <label className="flex flex-col gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span>اندازه: <b className="text-zinc-900 dark:text-zinc-100">{faNum(size)}px</b></span>
              <input type="range" min={14} max={72} step={2} value={size} onChange={(e) => setSize(Number(e.target.value))} className="accent-emerald-600" aria-label="اندازهٔ فونت" />
            </label>
            <div className="col-span-2 flex flex-col gap-2 text-xs font-medium text-zinc-500 sm:col-span-1 dark:text-zinc-400">
              <span>ارقام</span>
              <div className="inline-flex rounded-lg border border-zinc-300 p-0.5 dark:border-zinc-700" role="group" aria-label="نوع ارقام">
                {[true, false].map((fa) => (
                  <button
                    key={String(fa)}
                    type="button"
                    aria-pressed={persianDigits === fa}
                    onClick={() => changeDigits(fa)}
                    className={`flex-1 rounded-md px-3 py-1 text-sm transition ${persianDigits === fa ? 'bg-emerald-700 text-white' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'}`}
                  >
                    {fa ? '۱۲۳ فارسی' : '123 لاتین'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={category === key}
              onClick={() => setCategory(key)}
              className={`rounded-full px-3 py-1 text-sm transition ${category === key ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'}`}
            >
              {label}
            </button>
          ))}
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as typeof source)}
            aria-label="منبع فونت"
            className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="all">همهٔ منابع</option>
            <option value="iranian">فقط غیرِ گوگل</option>
            <option value="google">فقط فونت‌های Google Fonts</option>
          </select>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو: samim، شبنم…"
            aria-label="جستجوی فونت"
            className="ms-auto w-44 rounded-full border border-zinc-300 bg-white px-3 py-1 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <label className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <input type="checkbox" checked={hideDeprecated} onChange={(e) => setHideDeprecated(e.target.checked)} className="accent-emerald-600" />
            پنهان کردن نسخه‌های منسوخ
          </label>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400" aria-live="polite">
          {faNum(visible.length)} خانوادهٔ فونت نمایش داده می‌شود. هر کارت یک خانواده است؛ نسخه‌ها (ارقام فارسی FD، متغیر، نقطهٔ گرد، ایتالیک) را داخل کارت انتخاب کنید. دکمهٔ «۱۲۳ فارسی» بالا نسخهٔ ارقام فارسی را در همهٔ کارت‌ها پیش‌فرض می‌کند.
        </p>
        <div className="flex shrink-0 items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span id="code-mode-label">کد برای</span>
          <div className="inline-flex rounded-lg border border-zinc-300 p-0.5 dark:border-zinc-700" role="group" aria-labelledby="code-mode-label">
            {([['next', 'Next.js'], ['css', 'CSS (بدون Next)']] as const).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                aria-pressed={codeMode === mode}
                onClick={() => setCodeMode(mode)}
                className={`rounded-md px-3 py-1 text-sm transition ${codeMode === mode ? 'bg-emerald-700 text-white' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {visible.map((fam) => (
          <FamilyCard
            key={fam.id}
            family={fam}
            selected={selected[fam.id]}
            onSelect={(exportName) => setSelected((s) => ({ ...s, [fam.id]: exportName }))}
            persianDigits={persianDigits}
            hideDeprecated={hideDeprecated}
            preview={preview}
            weight={weight}
            setWeight={setWeight}
            size={size}
            codeMode={codeMode}
          />
        ))}
      </ul>
      {visible.length === 0 && <p className="py-16 text-center text-zinc-500">فونتی پیدا نشد.</p>}
    </div>
  )
}
