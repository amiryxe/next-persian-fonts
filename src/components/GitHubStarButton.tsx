'use client'

import { useEffect, useState } from 'react'

const REPO = 'amiryxe/next-persian-fonts'
export const GITHUB_URL = `https://github.com/${REPO}`
const CACHE_KEY = 'npf-stars'
const CACHE_TTL = 60 * 60 * 1000 // 1h: the unauthenticated GitHub API allows 60 requests/hour per IP

// One request per page load, shared by every button on the page.
let pending: Promise<number | null> | null = null

function loadStars(): Promise<number | null> {
  if (pending) return pending
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null') as { n: number; t: number } | null
    if (cached && typeof cached.n === 'number' && Date.now() - cached.t < CACHE_TTL) {
      return (pending = Promise.resolve(cached.n))
    }
  } catch {}
  pending = fetch(`https://api.github.com/repos/${REPO}`, { headers: { Accept: 'application/vnd.github+json' } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d: { stargazers_count?: unknown } | null) => {
      const n = typeof d?.stargazers_count === 'number' ? d.stargazers_count : null
      if (n !== null) {
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ n, t: Date.now() }))
        } catch {}
      }
      return n
    })
    .catch(() => null)
  return pending
}

const formatter = typeof Intl !== 'undefined' ? new Intl.NumberFormat('fa-IR') : null

export function GitHubIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

/**
 * "Star on GitHub" button with a live star count. The count is fetched client-side (works on the
 * static GitHub Pages export) and simply stays hidden if the API is unreachable or rate-limited.
 * `compact` shortens the label on small screens (used in the header).
 */
export function GitHubStarButton({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    let alive = true
    let timer: ReturnType<typeof setTimeout> | undefined
    const run = () => {
      loadStars().then((n) => {
        if (alive) setStars(n)
      })
    }
    // The count is decorative: request it well after the page has loaded and painted, so the
    // cross-origin API call never competes with fonts/LCP (and stays out of Lighthouse's critical path).
    const schedule = () => {
      timer = setTimeout(() => {
        if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 2000 })
        else run()
      }, 3000)
    }
    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })
    return () => {
      alive = false
      clearTimeout(timer)
      window.removeEventListener('load', schedule)
    }
  }, [])

  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noreferrer"
      title="اگر این پروژه به کارتان آمد، در گیت‌هاب به آن ستاره بدهید"
      className={`inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-800 transition hover:border-emerald-500 hover:bg-zinc-50 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-emerald-400 dark:hover:bg-zinc-800 dark:hover:text-emerald-300 ${compact ? 'h-9 px-2.5' : 'px-4 py-3'} ${className}`}
    >
      <GitHubIcon className={compact ? 'size-4' : 'size-5'} />
      <span>
        <span aria-hidden="true">★ </span>
        {compact ? (
          <>
            <span className="sr-only sm:not-sr-only">ستاره</span>
            <span className="sr-only"> در گیت‌هاب</span>
          </>
        ) : (
          'ستاره در گیت‌هاب'
        )}
      </span>
      {stars !== null && (
        <span className="border-s border-zinc-200 ps-2 tabular-nums text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
          <span className="sr-only">(</span>
          {formatter ? formatter.format(stars) : stars}
          <span className="sr-only"> ستاره)</span>
        </span>
      )}
    </a>
  )
}
