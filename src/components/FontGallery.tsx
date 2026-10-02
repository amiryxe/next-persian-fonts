'use client'

import { useMemo, useState } from 'react'
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

export function FontGallery({ fonts }: { fonts: FontEntry[] }) {
  const [text, setText] = useState(SAMPLES[0])
  const [weight, setWeight] = useState(400)
  const [size, setSize] = useState(28)
  const [persianDigits, setPersianDigits] = useState(true)
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [hideDeprecated, setHideDeprecated] = useState(true)

  const preview = persianDigits ? toPersianDigits(text) : toLatinDigits(text)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return fonts.filter(
      (f) =>
        (category === 'all' || f.category === category) &&
        (!hideDeprecated || !f.deprecated) &&
        (!q || [f.name, f.nameFa, f.exportName, f.subpath].some((s) => s.toLowerCase().includes(q))),
    )
  }, [fonts, category, query, hideDeprecated])

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
                    onClick={() => setPersianDigits(fa)}
                    className={`flex-1 rounded-md px-3 py-1 text-sm transition ${persianDigits === fa ? 'bg-emerald-600 text-white' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'}`}
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
            پنهان کردن منسوخ‌ها
          </label>
        </div>
      </div>

      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        {faNum(visible.length)} خروجی نمایش داده می‌شود. فونت‌های «FD» ارقام لاتین را هم به شکل فارسی نمایش می‌دهند.
      </p>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {visible.map((f) => {
          const snippet = `import { ${f.exportName} } from 'next-persian-fonts/${f.subpath}'`
          const w = nearestWeight(f, weight)
          return (
            <li key={f.id} className="group flex min-w-0 flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-emerald-400/70 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-emerald-500/50">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold">
                    {f.nameFa} <span className="font-normal text-zinc-500 dark:text-zinc-400" dir="ltr">{f.name}</span>
                  </h3>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{f.designer}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{weightLabel(f)}</span>
                  {f.digits === 'persian' && <span className="rounded-full bg-sky-50 px-2 py-0.5 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">ارقام فارسی (FD)</span>}
                  {f.digits === 'none' && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">فقط فارسی</span>}
                  {f.deprecated && <span className="rounded-full bg-rose-50 px-2 py-0.5 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">منسوخ</span>}
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300" dir="ltr">v{f.version}</span>
                </div>
              </div>

              <p
                className="my-5 min-h-24 [overflow-wrap:anywhere] leading-[1.7] text-zinc-900 dark:text-zinc-50"
                style={{ fontFamily: f.fontFamily, fontWeight: w, fontSize: size }}
              >
                {preview || 'متن نمونه'}
              </p>

              <div className="mt-auto space-y-3">
                {!f.isVariable && f.weights.length > 1 && (
                  <div className="flex flex-wrap gap-1" aria-label="وزن‌های موجود">
                    {f.weights.map((x) => (
                      <button
                        key={x}
                        type="button"
                        onClick={() => setWeight(x)}
                        className={`rounded px-1.5 py-0.5 text-[11px] ${x === w ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}
                      >
                        {faNum(x)}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 rounded-lg bg-zinc-50 p-2 dark:bg-zinc-950/60">
                  <code dir="ltr" className="min-w-0 flex-1 truncate text-left font-mono text-xs text-zinc-700 dark:text-zinc-300" title={snippet}>{snippet}</code>
                  <CopyButton text={snippet} />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <span dir="ltr" className="font-mono">{f.cssVariable}</span>
                  <a className="hover:text-emerald-600 dark:hover:text-emerald-400" href={f.licenseUrl} target="_blank" rel="noreferrer">مجوز: <span dir="ltr">{f.license.split(' ')[0]}</span></a>
                  <a className="hover:text-emerald-600 dark:hover:text-emerald-400" href={f.sourceUrl} target="_blank" rel="noreferrer">منبع ↗</a>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      {visible.length === 0 && <p className="py-16 text-center text-zinc-500">فونتی پیدا نشد.</p>}
    </div>
  )
}
