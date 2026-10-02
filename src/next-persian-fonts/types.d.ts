/**
 * A font loaded with `next/font/local`. Structurally compatible with Next.js'
 * `NextFontWithVariable`, so it can be used anywhere a Next.js font is expected.
 */
export interface PersianFont {
  /** Class name that sets `font-family` (and weight/style for single-weight fonts). */
  className: string
  /** Class name that defines the font's CSS variable, e.g. `--font-vazirmatn`. */
  variable: string
  /** Inline style object: `{ fontFamily }` plus `fontWeight`/`fontStyle` when fixed. */
  style: {
    fontFamily: string
    fontWeight?: number
    fontStyle?: string
  }
}
