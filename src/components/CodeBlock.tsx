import { CopyButton } from './CopyButton'

export function CodeBlock({ code, title }: { code: string; title?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200 px-4 py-2 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <span dir="ltr" className="font-mono">{title ?? ''}</span>
        <CopyButton text={code} />
      </div>
      <pre dir="ltr" className="overflow-x-auto p-4 text-left font-mono text-[13px] leading-6 text-zinc-800 dark:text-zinc-200">
        <code>{code}</code>
      </pre>
    </div>
  )
}
