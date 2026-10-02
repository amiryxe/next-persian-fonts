import manifest from 'next-persian-fonts/fonts.json'
import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'
import { vazirCode } from 'next-persian-fonts/vazir-code'
// Gallery previews use generated copies of every font with preload: false (see scripts/generate-fonts.mjs),
// so the page only preloads the site and code fonts.
import * as gallery from './gallery-fonts.generated'

const loaded: Record<string, { style: { fontFamily: string } }> = gallery

export { vazirmatnVariable as siteFont, vazirCode as codeFont }

export type Digits = 'latin' | 'persian' | 'none'

export interface FontEntry {
  id: string
  familyId: string
  name: string
  nameFa: string
  designer: string
  category: string
  subpath: string
  exportName: string
  cssVariable: string
  fontFamily: string
  digits: Digits
  /** Available weights, e.g. [400, 700]; for variable fonts [min, max]. */
  weights: number[]
  isVariable: boolean
  version: string
  license: string
  licenseUrl: string
  sourceUrl: string
  description: string
  deprecated: boolean
  legacy: boolean
  /** Also on Google Fonts (bundled here for offline use). */
  googleFonts: boolean
  hasItalic: boolean
  fileCount: number
}

type ManifestFile = { from: string | null; to: string; weight: string; style?: string }
type ManifestVariant = {
  subpath?: string
  export: string
  cssVariable: string
  digits: string
  description: string
  files: ManifestFile[]
  deprecated?: string
  version?: string
  legacy?: boolean
  extra?: ManifestVariant[]
}

const repoUrl = 'https://github.com/amiryxe/next-persian-fonts/blob/main/src/next-persian-fonts'

export const fonts: FontEntry[] = manifest.families.flatMap((family) =>
  (family.variants as ManifestVariant[]).flatMap((v) =>
    [v, ...(v.extra ?? [])].map((x): FontEntry => {
      const font = loaded[x.export]
      if (!font) throw new Error(`Font ${x.export} is listed in fonts.json but not imported in src/lib/fonts.ts`)
      const weights = [...new Set(x.files.flatMap((f) => f.weight.split(' ').map(Number)))].sort((a, b) => a - b)
      return {
        id: x.export,
        familyId: family.id,
        name: family.name,
        nameFa: family.nameFa,
        designer: family.designer,
        category: family.category,
        subpath: v.subpath!,
        exportName: x.export,
        cssVariable: x.cssVariable,
        fontFamily: font.style.fontFamily,
        digits: x.digits as Digits,
        weights,
        isVariable: x.files.some((f) => f.weight.includes(' ')),
        version: x.version ?? family.version,
        license: family.license,
        licenseUrl: `${repoUrl}/${v.subpath}/${family.licenseFile.to}`,
        sourceUrl: `https://github.com/${family.repo}`,
        description: x.description,
        deprecated: Boolean(x.deprecated),
        legacy: Boolean(v.legacy),
        googleFonts: Boolean((family as { googleFonts?: boolean }).googleFonts),
        hasItalic: x.files.some((f) => f.style === 'italic'),
        fileCount: x.files.length,
      }
    }),
  ),
)

export const familyCount = manifest.families.length
