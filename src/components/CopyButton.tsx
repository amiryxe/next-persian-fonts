'use client'

import { useState } from 'react'

export function CopyButton({ text, label = 'کپی', title, className = '' }: { text: string; label?: string; title?: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        } catch {
          /* clipboard unavailable */
        }
      }}
      className={`shrink-0 rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:border-emerald-500 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-400 dark:hover:text-emerald-300 ${className}`}
      aria-label={copied ? 'کپی شد' : `${label}${title ? ` ${title}` : ''}`}
    >
      <span aria-hidden="true">{copied ? 'کپی شد ✓' : label}</span>
      <span className="sr-only" role="status">{copied ? 'کپی شد' : ''}</span>
    </button>
  )
}
