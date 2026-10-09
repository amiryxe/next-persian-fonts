#!/usr/bin/env node
// Static checks for the published package:
//  1. generated entry points / types / FONTS.md are in sync with fonts.json
//  2. every subpath has index.js, index.d.ts, a license file and valid WOFF2 files (and no stray fonts)
//  3. `npm pack` would ship everything that the exports map points to
//  4. the type declarations compile under moduleResolution bundler, node16 and node10
//  5. the plain CSS files (css/*.css) cover every export and point at the bundled font files
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync, openSync, readSync, closeSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkgDir = join(root, 'src', 'next-persian-fonts')
const manifest = JSON.parse(readFileSync(join(pkgDir, 'fonts.json'), 'utf8'))
const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'))
const errors = []
const fail = (m) => errors.push(m)
const step = (m) => console.log(`\n▶ ${m}`)
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts })

step('generated files are up to date')
try {
  console.log(run('node', ['scripts/generate-fonts.mjs', '--check']).trim())
} catch (e) {
  fail(e.stderr || e.message)
}

step('font folders')
const exportsList = []
for (const family of manifest.families) {
  for (const v of family.variants) {
    const dir = join(pkgDir, v.subpath)
    for (const f of ['index.js', 'index.d.ts', family.licenseFile.to])
      if (!existsSync(join(dir, f))) fail(`${v.subpath}/${f} is missing`)
    const expected = new Set([v, ...(v.extra ?? [])].flatMap((x) => x.files.map((f) => f.to)))
    for (const x of [v, ...(v.extra ?? [])]) {
      exportsList.push({ subpath: v.subpath, name: x.export, deprecated: Boolean(x.deprecated) })
      for (const a of x.aliases ?? []) exportsList.push({ subpath: v.subpath, name: a })
    }
    for (const file of readdirSync(dir).filter((f) => /\.(woff2?|ttf|otf)$/.test(f))) {
      if (!expected.has(file)) fail(`${v.subpath}/${file} is not listed in fonts.json`)
      // Brackets, commas, spaces etc. get percent-encoded in Next's <link rel=preload> but not in the
      // CSS url(), so the browser would download the file twice.
      if (!/^[A-Za-z0-9._-]+$/.test(file)) fail(`${v.subpath}/${file}: file names may only contain A-Z a-z 0-9 . _ -`)
      const fd = openSync(join(dir, file), 'r')
      const buf = Buffer.alloc(4)
      readSync(fd, buf, 0, 4, 0)
      closeSync(fd)
      if (buf.toString('latin1') !== 'wOF2') fail(`${v.subpath}/${file} is not a WOFF2 file`)
    }
    if (!pkg.exports[`./${v.subpath}`]) fail(`exports map has no ./${v.subpath}`)
  }
}
console.log(`${exportsList.length} exports checked`)

step('npm pack contents')
const packed = JSON.parse(run('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: pkgDir }))[0]
const shipped = new Set(packed.files.map((f) => f.path))
for (const target of Object.values(pkg.exports).flatMap((t) => (typeof t === 'string' ? [t] : Object.values(t)))) {
  if (target.includes('*')) {
    const re = new RegExp('^' + target.replace(/^\.\//, '').replace(/[.]/g, '\\.').replace('*', '.+') + '$')
    if (![...shipped].some((p) => re.test(p))) fail(`npm pack includes nothing for ${target}`)
  } else if (!shipped.has(target.replace(/^\.\//, ''))) fail(`npm pack does not include ${target}`)
}
for (const family of manifest.families)
  for (const v of family.variants)
    for (const x of [v, ...(v.extra ?? [])])
      for (const f of x.files) if (!shipped.has(`${v.subpath}/${f.to}`)) fail(`npm pack does not include ${v.subpath}/${f.to}`)
const stray = [...shipped].filter((p) => /(^|\/)(node_modules|\.DS_Store|package-lock\.json)/.test(p))
if (stray.length) fail(`npm pack includes unexpected files: ${stray.join(', ')}`)
console.log(`${packed.entryCount} files, ${(packed.size / 1024 / 1024).toFixed(2)} MB packed, ${(packed.unpackedSize / 1024 / 1024).toFixed(2)} MB unpacked`)

step('CSS files (non-Next.js usage)')
{
  if (JSON.stringify(pkg.sideEffects) !== JSON.stringify(['*.css'])) fail('package.json sideEffects must be ["*.css"] (JS tree-shakeable, CSS kept)')
  if (pkg.exports['./css/*'] !== './css/*') fail('exports map needs "./css/*": "./css/*"')
  let n = 0
  for (const family of manifest.families)
    for (const v of family.variants)
      for (const x of [v, ...(v.extra ?? [])]) {
        const name = x.cssVariable.replace(/^--font-/, '')
        const rel = `css/${name}.css`
        if (!shipped.has(rel)) fail(`npm pack does not include ${rel}`)
        if (!existsSync(join(pkgDir, rel))) { fail(`${rel} is missing`); continue }
        const css = readFileSync(join(pkgDir, rel), 'utf8')
        const faces = css.match(/@font-face\s*\{[^}]*\}/g) ?? []
        if (faces.length !== x.files.length) fail(`${rel}: ${faces.length} @font-face rules, expected ${x.files.length}`)
        const families = new Set(faces.map((f) => f.match(/font-family:\s*'([^']+)'/)?.[1]))
        if (families.size !== 1 || families.has(undefined)) fail(`${rel}: @font-face rules must share one font-family`)
        for (const f of x.files) {
          const url = `../${v.subpath}/${f.to}`
          const face = faces.find((r) => r.includes(`url('${url}')`))
          if (!face) { fail(`${rel}: no @font-face for ${url}`); continue }
          if (!shipped.has(`${v.subpath}/${f.to}`)) fail(`${rel}: ${url} is not in the package`)
          if (!face.includes(`font-weight: ${f.weight};`)) fail(`${rel}: ${f.to} should have font-weight: ${f.weight}`)
          if (!face.includes(`font-style: ${f.style ?? 'normal'};`)) fail(`${rel}: ${f.to} has the wrong font-style`)
          if (!face.includes('font-display: swap;')) fail(`${rel}: ${f.to} has no font-display: swap`)
        }
        for (const u of css.match(/url\('([^']+)'\)/g) ?? []) {
          const p = u.slice(5, -2)
          if (!existsSync(join(pkgDir, 'css', p))) fail(`${rel}: ${p} does not exist`)
        }
        const [fam] = families
        if (!new RegExp(`:root\\s*\\{\\s*${x.cssVariable}: '${fam}', [a-z-]+;\\s*\\}`).test(css)) fail(`${rel}: :root must set ${x.cssVariable}`)
        if (!css.includes(`.font-${name} {\n  font-family: var(${x.cssVariable});`)) fail(`${rel}: missing .font-${name} class`)
        n++
      }
  // Next.js entry points must never pull in CSS (zero cost for next/font users)
  for (const file of [...shipped].filter((p) => p.endsWith('.js')))
    if (/\.css['"]/.test(readFileSync(join(pkgDir, file), 'utf8'))) fail(`${file} imports a CSS file`)
  console.log(`${n} CSS files checked`)
}

step('type declarations')
const genDir = join(root, 'tests', 'types', '.generated')
mkdirSync(genDir, { recursive: true })
const bySubpath = exportsList.reduce((acc, e) => ((acc[e.subpath] ??= []).push(e), acc), {})
const lines = [
  '// Generated by scripts/verify-package.mjs',
  "import type { NextFontWithVariable } from 'next/dist/compiled/@next/font/dist/types.js'",
  "import type { PersianFont } from 'next-persian-fonts'",
  "import * as legacy from 'next-persian-fonts'",
  ...Object.entries(bySubpath).map(([s, es]) => `import { ${es.map((e) => e.name).join(', ')} } from 'next-persian-fonts/${s}'`),
  '',
  'const all: PersianFont[] = [',
  ...exportsList.map((e) => `  ${e.name},`),
  ']',
  'const asNext: NextFontWithVariable[] = all',
  'const names: string[] = all.map((f) => f.className + f.variable + f.style.fontFamily)',
  'const legacyFonts: PersianFont[] = [legacy.sahel, legacy.vazirMatn, legacy.estedad, legacy.estedadFD]',
  '// @ts-expect-error new fonts are intentionally not re-exported from the root entry',
  'legacy.samim',
  'export { asNext, names, legacyFonts }',
  '',
]
writeFileSync(join(genDir, 'all-exports.ts'), lines.join('\n'))
for (const [mode, module] of [['bundler', 'esnext'], ['node16', 'node16'], ['node10', 'commonjs']]) {
  const cfg = {
    compilerOptions: { strict: true, noEmit: true, skipLibCheck: false, module, moduleResolution: mode, target: 'es2022', lib: ['es2024', 'dom'], types: [], ignoreDeprecations: '5.0' },
    files: ['all-exports.ts'],
  }
  if (mode === 'node16') cfg.compilerOptions.module = 'node16'
  writeFileSync(join(genDir, `tsconfig.${mode}.json`), JSON.stringify(cfg, null, 2))
  // node16 resolution treats the .ts fixture as CJS unless a package.json says module
  writeFileSync(join(genDir, 'package.json'), JSON.stringify({ type: 'module', private: true }))
  try {
    run('npx', ['tsc', '-p', join(genDir, `tsconfig.${mode}.json`)])
    console.log(`✓ tsc (moduleResolution: ${mode})`)
  } catch (e) {
    fail(`tsc (moduleResolution: ${mode}) failed:\n${e.stdout}${e.stderr}`)
  }
}

if (errors.length) {
  console.error('\n✗ ' + errors.join('\n✗ '))
  process.exit(1)
}
console.log('\n✓ package verified')
