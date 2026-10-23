'use client'

import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
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

const KIND_AXIS = AXES.find((a) => a.key === 'kind')!

export const hasVariable = (fam: Family) => fam.variants.some((v) => v.isVariable && !v.deprecated)

type CodeMode = 'next' | 'css'

const chip = 'cursor-pointer select-none rounded-md px-2.5 py-1 text-xs transition peer-checked:bg-emerald-700 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500 peer-focus-visible:ring-offset-1 dark:peer-focus-visible:ring-offset-zinc-900 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'

function FamilyCard({
  family,
  selected,
  onSelect,
  persianDigits,
  hideDeprecated,
  onlyVariable,
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
  onlyVariable: boolean
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
  const base = hideDeprecated ? family.variants.filter((v) => !v.deprecated) : family.variants
  // "Only variable" narrows the card to its (non-deprecated) variable variants, keeping the other axes of the current pick.
  const variants = onlyVariable ? family.variants.filter((v) => v.isVariable && !v.deprecated) : base
  const picked = family.variants.find((v) => v.exportName === selected)
  const f = (picked && variants.includes(picked) ? picked : undefined)
    ?? (picked && onlyVariable ? switchVariant(variants, picked, KIND_AXIS, 'variable') : undefined)
    ?? defaultVariant(variants, persianDigits)
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

const SOURCES = [['all', 'همه'], ['iranian', 'غیرِ گوگل'], ['google', 'Google Fonts']] as const
type Source = (typeof SOURCES)[number][0]

const segWrap = 'inline-flex shrink-0 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/80'
const seg = (on: boolean) =>
  `whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${on ? 'bg-white font-medium text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-white' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'}`
const label = 'text-[11px] font-semibold tracking-wide text-zinc-500 dark:text-zinc-400'

function Toggle({ on, onChange, children, filter }: { on: boolean; onChange: (v: boolean) => void; children: ReactNode; filter?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      data-filter={filter}
      onClick={() => onChange(!on)}
      className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border px-3 py-1.5 text-sm transition outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${on ? 'border-emerald-600/40 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200' : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-100'}`}
    >
      <span aria-hidden className={`relative h-4 w-7 rounded-full transition ${on ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-600'}`}>
        <span className={`absolute top-0.5 size-3 rounded-full bg-white shadow transition-all ${on ? 'start-3.5' : 'start-0.5'}`} />
      </span>
      {children}
    </button>
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
  const [onlyVariable, setOnlyVariable] = useState(false)
  const [source, setSource] = useState<Source>('all')
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [codeMode, setCodeMode] = useState<CodeMode>('next')
  const families = useMemo(() => groupFamilies(fonts), [fonts])

  // The global digits toggle resets every card to its default variant for that digit style.
  const changeDigits = (fa: boolean) => {
    setPersianDigits(fa)
    setSelected({})
  }

  const preview = persianDigits ? toPersianDigits(text) : toLatinDigits(text)

  // Families matching everything except the category, so each category pill can show its own count.
  const matching = useMemo(() => {
    const q = query.trim().toLowerCase()
    return families.filter(
      (fam) =>
        (source === 'all' || (source === 'google') === fam.googleFonts) &&
        (!onlyVariable || hasVariable(fam)) &&
        (!q || [fam.name, fam.nameFa, fam.id, ...fam.variants.flatMap((v) => [v.exportName, v.subpath])].some((s) => s.toLowerCase().includes(q))),
    )
  }, [families, query, source, onlyVariable])
  const visible = category === 'all' ? matching : matching.filter((fam) => fam.category === category)

  const filtersActive = category !== 'all' || source !== 'all' || query.trim() !== '' || onlyVariable || !hideDeprecated
  const clearFilters = () => {
    setCategory('all')
    setSource('all')
    setQuery('')
    setOnlyVariable(false)
    setHideDeprecated(true)
  }

  return (
    <div>
      <section
        aria-label="فیلتر و تنظیمات پیش‌نمایش"
        className="z-20 -mx-4 mb-4 border-y border-zinc-200 bg-white/90 shadow-sm backdrop-blur sm:mx-0 sm:rounded-2xl sm:border lg:sticky lg:top-16 dark:border-zinc-800 dark:bg-zinc-950/90"
      >
        {/* Filters */}
        <div className="flex flex-col gap-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-48 flex-1">
              <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="9" r="6" /><path d="m17 17-3.5-3.5" strokeLinecap="round" /></svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجوی فونت: samim، شبنم…"
                aria-label="جستجوی فونت"
                className="w-full rounded-xl border border-zinc-200 bg-white py-2 pe-3 ps-9 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <div className="-mx-1 flex max-w-full items-center gap-2 overflow-x-auto px-1 py-0.5 [scrollbar-width:none]">
              <div className={segWrap} role="group" aria-label="منبع فونت">
                {SOURCES.map(([key, text]) => (
                  <button key={key} type="button" aria-pressed={source === key} onClick={() => setSource(key)} className={seg(source === key)}>
                    {text}
                  </button>
                ))}
              </div>
              <Toggle on={onlyVariable} onChange={setOnlyVariable} filter="variable">فقط متغیر</Toggle>
              <Toggle on={hideDeprecated} onChange={setHideDeprecated} filter="deprecated">بدون منسوخ</Toggle>
            </div>
          </div>
          <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] sm:flex-wrap" role="group" aria-label="دسته‌بندی">
            {Object.entries(CATEGORIES).map(([key, text]) => {
              const n = key === 'all' ? matching.length : matching.filter((fam) => fam.category === key).length
              const on = category === key
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCategory(key)}
                  disabled={n === 0 && !on}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 ${on ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900' : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500'}`}
                >
                  {text}
                  <span className={`text-xs tabular-nums ${on ? 'opacity-70' : 'text-zinc-400 dark:text-zinc-500'}`}>{faNum(n)}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Preview controls */}
        <div className="grid gap-4 border-t border-zinc-200 bg-zinc-50/70 p-4 sm:rounded-b-2xl lg:grid-cols-[minmax(0,1fr)_auto] dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="sample" className={label}>متن نمونه</label>
              <div className="flex gap-1" role="group" aria-label="متن‌های آماده">
                {SAMPLES.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-pressed={text === s}
                    aria-label={`نمونهٔ ${faNum(i + 1)}`}
                    onClick={() => setText(s)}
                    className={`grid size-6 place-items-center rounded-md text-xs transition outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${text === s ? 'bg-emerald-700 text-white' : 'text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}
                  >
                    {faNum(i + 1)}
                  </button>
                ))}
              </div>
            </div>
            <input
              id="sample"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="متن دلخواه خود را بنویسید…"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="grid grid-cols-2 items-end gap-4 sm:grid-cols-[repeat(2,minmax(0,10rem))_auto]">
            <label className="flex flex-col gap-2">
              <span className={`${label} flex justify-between`}>وزن <b className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{faNum(weight)}</b></span>
              <input type="range" min={100} max={900} step={100} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="h-9 accent-emerald-600" aria-label="وزن فونت" />
            </label>
            <label className="flex flex-col gap-2">
              <span className={`${label} flex justify-between`}>اندازه <b className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{faNum(size)}px</b></span>
              <input type="range" min={14} max={72} step={2} value={size} onChange={(e) => setSize(Number(e.target.value))} className="h-9 accent-emerald-600" aria-label="اندازهٔ فونت" />
            </label>
            <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
              <span id="digits-label" className={label}>ارقام</span>
              <div className={segWrap} role="group" aria-labelledby="digits-label">
                {[true, false].map((fa) => (
                  <button key={String(fa)} type="button" aria-pressed={persianDigits === fa} onClick={() => changeDigits(fa)} className={`flex-1 ${seg(persianDigits === fa)}`}>
                    {fa ? '۱۲۳ فارسی' : '123 لاتین'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-300" aria-live="polite">
            <b className="font-semibold tabular-nums text-zinc-900 dark:text-white">{faNum(visible.length)}</b> خانواده
            {visible.length !== families.length && <span className="text-zinc-400 dark:text-zinc-500"> از {faNum(families.length)}</span>}
          </p>
          {filtersActive && (
            <button type="button" onClick={clearFilters} className="rounded-lg px-2 py-1 text-sm text-emerald-700 transition outline-none hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-emerald-300 dark:hover:bg-emerald-500/10">
              ✕ پاک کردن فیلترها
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span id="code-mode-label" className={label}>کد برای</span>
          <div className={segWrap} role="group" aria-labelledby="code-mode-label">
            {([['next', 'Next.js'], ['css', 'CSS (بدون Next)']] as const).map(([mode, text]) => (
              <button key={mode} type="button" aria-pressed={codeMode === mode} onClick={() => setCodeMode(mode)} className={seg(codeMode === mode)}>
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="mb-4 text-xs leading-6 text-zinc-500 dark:text-zinc-400">
        هر کارت یک خانواده است؛ نسخه‌ها (ارقام فارسی FD، متغیر، نقطهٔ گرد، ایتالیک) را داخل کارت انتخاب کنید.
      </p>

      {visible.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visible.map((fam) => (
            <FamilyCard
              key={fam.id}
              family={fam}
              selected={selected[fam.id]}
              onSelect={(exportName) => setSelected((s) => ({ ...s, [fam.id]: exportName }))}
              persianDigits={persianDigits}
              hideDeprecated={hideDeprecated}
              onlyVariable={onlyVariable}
              preview={preview}
              weight={weight}
              setWeight={setWeight}
              size={size}
              codeMode={codeMode}
            />
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
          <p className="font-medium text-zinc-700 dark:text-zinc-200">فونتی با این فیلترها پیدا نشد.</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">جستجو را تغییر دهید یا فیلترها را بردارید.</p>
          {filtersActive && (
            <button type="button" onClick={clearFilters} className="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-sm text-white transition hover:bg-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950">
              پاک کردن فیلترها
            </button>
          )}
        </div>
      )}
    </div>
  )
}
