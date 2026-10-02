import type { PersianFont } from 'next-persian-fonts'
import manifest from 'next-persian-fonts/fonts.json'
import { vazirMatn } from 'next-persian-fonts/vazirmatn'
import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'
import { vazirmatnRoundDots } from 'next-persian-fonts/vazirmatn-round-dots'
import { sahel } from 'next-persian-fonts/sahel'
import { sahelFD } from 'next-persian-fonts/sahel-fd'
import { estedad, estedadFD } from 'next-persian-fonts/estedad'
import { samim } from 'next-persian-fonts/samim'
import { samimFD } from 'next-persian-fonts/samim-fd'
import { shabnam } from 'next-persian-fonts/shabnam'
import { shabnamFD } from 'next-persian-fonts/shabnam-fd'
import { tanha } from 'next-persian-fonts/tanha'
import { tanhaFD } from 'next-persian-fonts/tanha-fd'
import { parastoo } from 'next-persian-fonts/parastoo'
import { parastooFD } from 'next-persian-fonts/parastoo-fd'
import { gandom } from 'next-persian-fonts/gandom'
import { gandomFD } from 'next-persian-fonts/gandom-fd'
import { mikhak } from 'next-persian-fonts/mikhak'
import { mikhakFD } from 'next-persian-fonts/mikhak-fd'
import { vazirCode } from 'next-persian-fonts/vazir-code'
import { vazirCodeFD } from 'next-persian-fonts/vazir-code-fd'
import { behdad } from 'next-persian-fonts/behdad'
import { nika } from 'next-persian-fonts/nika'

const loaded: Record<string, PersianFont> = {
  vazirMatn, vazirmatnVariable, vazirmatnRoundDots, sahel, sahelFD, estedad, estedadFD,
  samim, samimFD, shabnam, shabnamFD, tanha, tanhaFD, parastoo, parastooFD, gandom, gandomFD,
  mikhak, mikhakFD, vazirCode, vazirCodeFD, behdad, nika,
}

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
}

type ManifestFile = { from: string | null; to: string; weight: string }
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
      const weights = x.files.flatMap((f) => f.weight.split(' ').map(Number))
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
      }
    }),
  ),
)

export const familyCount = manifest.families.length
