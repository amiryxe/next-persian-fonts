# Licenses

## Package code

The JavaScript/TypeScript code of `next-persian-fonts` (the `index.js`, `index.d.ts` and
`types.d.ts` files) is licensed under the ISC license:

Copyright (c) Amir Salehi (@amiryxe)

Permission to use, copy, modify, and/or distribute this software for any purpose with or without
fee is hereby granted, provided that the above copyright notice and this permission notice appear
in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE
AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT,
NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.

## Fonts

The font files are **not** covered by the ISC license. Each font is redistributed under its own
upstream license, and every font folder contains that license file (`OFL.txt` or `LICENSE.txt`).
See [FONTS.md](./FONTS.md) for the full list of fonts, versions, licenses, sources and changes.

- SIL Open Font License 1.1: Vazirmatn, Sahel, Estedad, Parastoo, Mikhak, Behdad, Nika and all the
  fonts that are also on Google Fonts (Lalezar, Markazi Text, Mirza, Reem Kufi, Noto Naskh Arabic,
  Noto Sans Arabic, Noto Kufi Arabic, Noto Nastaliq Urdu, IBM Plex Sans Arabic, Amiri, Harmattan,
  Scheherazade New, Lateef, Katibeh, Aref Ruqaa, Rubik, Jomhuria, El Messiri, Changa,
  Baloo Bhaijaan 2, Cairo)
- OFL 1.1 (Arabic glyphs) + Bitstream Vera / Apache 2.0 (Latin glyphs): Samim, Shabnam, Gandom
- Bitstream Vera license + public domain changes (+ Apache 2.0 Latin glyphs for Tanha): Tanha, Vazir Code

### Modifications

Most fonts are shipped exactly as released upstream. Some Google Fonts families are distributed
upstream only as TTF; to keep the package small these were converted to WOFF2 and subset to the
Arabic + Latin character ranges (the same ranges Google Fonts serves), and a few variable fonts had
an unused axis pinned. The "Changes" column in [FONTS.md](./FONTS.md) lists exactly which files were
changed and how. Fonts whose license declares a Reserved Font Name for the font's own name
(IBM Plex Sans Arabic, Harmattan, Lateef, Scheherazade New) were **not** modified: they ship the
authors' official WOFF2 files.
