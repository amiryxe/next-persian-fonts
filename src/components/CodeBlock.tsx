import { CopyButton } from './CopyButton'

export function CodeBlock({ code, title }: { code: string; title?: string }) {
  return (
    <figure className="m-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200 px-4 py-2 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <figcaption dir="ltr" className="font-mono">{title ?? ''}</figcaption>
        <CopyButton text={code} title={title ? `کد ${title}` : 'کد'} />
      </div>
      <pre dir="ltr" tabIndex={0} className="overflow-x-auto p-4 text-left font-mono text-[13px] leading-6 text-zinc-800 dark:text-zinc-200">
        <code>{code}</code>
      </pre>
    </figure>
  )
}
