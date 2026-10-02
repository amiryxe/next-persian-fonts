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
import { lalezar } from 'next-persian-fonts/lalezar'
import { markaziText } from 'next-persian-fonts/markazi-text'
import { mirza } from 'next-persian-fonts/mirza'
import { reemKufi } from 'next-persian-fonts/reem-kufi'
import { notoNaskhArabic } from 'next-persian-fonts/noto-naskh-arabic'
import { notoSansArabic } from 'next-persian-fonts/noto-sans-arabic'
import { notoKufiArabic } from 'next-persian-fonts/noto-kufi-arabic'
import { notoNastaliqUrdu } from 'next-persian-fonts/noto-nastaliq-urdu'
import { ibmPlexSansArabic } from 'next-persian-fonts/ibm-plex-sans-arabic'
import { amiri } from 'next-persian-fonts/amiri'
import { harmattan } from 'next-persian-fonts/harmattan'
import { scheherazadeNew } from 'next-persian-fonts/scheherazade-new'
import { lateef } from 'next-persian-fonts/lateef'
import { katibeh } from 'next-persian-fonts/katibeh'
import { arefRuqaa } from 'next-persian-fonts/aref-ruqaa'
import { rubik } from 'next-persian-fonts/rubik'
import { jomhuria } from 'next-persian-fonts/jomhuria'
import { elMessiri } from 'next-persian-fonts/el-messiri'
import { changa } from 'next-persian-fonts/changa'
import { balooBhaijaan2 } from 'next-persian-fonts/baloo-bhaijaan-2'
import { cairo } from 'next-persian-fonts/cairo'

const loaded: Record<string, PersianFont> = {
  vazirMatn, vazirmatnVariable, vazirmatnRoundDots, sahel, sahelFD, estedad, estedadFD,
  samim, samimFD, shabnam, shabnamFD, tanha, tanhaFD, parastoo, parastooFD, gandom, gandomFD,
  mikhak, mikhakFD, vazirCode, vazirCodeFD, behdad, nika,
  lalezar, markaziText, mirza, reemKufi, notoNaskhArabic, notoSansArabic, notoKufiArabic, notoNastaliqUrdu,
  ibmPlexSansArabic, amiri, harmattan, scheherazadeNew, lateef, katibeh, arefRuqaa, rubik, jomhuria,
  elMessiri, changa, balooBhaijaan2, cairo,
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
  /** Also on Google Fonts (bundled here for offline use). */
  googleFonts: boolean
  hasItalic: boolean
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
      }
    }),
  ),
)

export const familyCount = manifest.families.length
