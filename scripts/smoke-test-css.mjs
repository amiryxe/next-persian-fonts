#!/usr/bin/env node
// Builds throw-away Vite apps against the packed tarball of next-persian-fonts and checks that the
// plain CSS files (next-persian-fonts/css/*.css) work without Next.js:
//   1. vanilla Vite: a JS import and a CSS @import; only the imported fonts are emitted and referenced
//   2. Vite + Tailwind CSS 4: @import the CSS and map --font-sans to the variable
//   3. webpack 5 + css-loader (what Gatsby uses): a JS import of the CSS
//   4. plain HTML: every url() in css/*.css resolves inside node_modules (for <link href="node_modules/…">)
//
//   node scripts/smoke-test-css.mjs
//   KEEP=1 node scripts/smoke-test-css.mjs   # keep the temp apps
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkgDir = join(root, 'src', 'next-persian-fonts')
const sh = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })

const work = mkdtempSync(join(tmpdir(), 'npf-css-smoke-'))
console.log(`Packing next-persian-fonts into ${work}`)
const tarball = join(work, JSON.parse(sh('npm', ['pack', '--json', '--pack-destination', work], pkgDir))[0].filename)

const writeFiles = (app, map) => {
  for (const [p, c] of Object.entries(map)) {
    mkdirSync(dirname(join(app, p)), { recursive: true })
    writeFileSync(join(app, p), c)
  }
}
const html = (body) => `<!doctype html>
<html lang="fa" dir="rtl">
  <head><meta charset="utf-8" /><title>smoke</title></head>
  <body class="${body}">
    <p>سلام دنیا ۱۲۳ 123</p>
    <script type="module" src="/main.js"></script>
  </body>
</html>
`
const distFiles = (app) => {
  const out = []
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) walk(join(d, e.name))
      else out.push(join(d, e.name))
    }
  }
  walk(join(app, 'dist'))
  return out
}

const results = []
async function test(label, fn) {
  try {
    const info = await fn()
    console.log(`  ✓ ${label}${info ? ` — ${info}` : ''}`)
    results.push({ label, ok: true, info })
  } catch (e) {
    console.log(`  ✗ ${label} FAILED\n${`${e.stdout ?? ''}${e.stderr ?? ''}${e.message}`.split('\n').slice(-30).join('\n')}`)
    results.push({ label, ok: false })
  }
}

// ---- 1. vanilla Vite ----------------------------------------------------------
const vite = join(work, 'vite')
writeFiles(vite, {
  'package.json': JSON.stringify({ name: 'smoke-vite', private: true, type: 'module', scripts: { build: 'vite build' } }),
  'index.html': html('font-vazirmatn-variable'),
  'main.js': "import 'next-persian-fonts/css/vazirmatn-variable.css'\nimport './style.css'\n",
  'style.css': "@import 'next-persian-fonts/css/amiri.css';\n\nh1 { font-family: var(--font-amiri); }\n",
})
process.stdout.write('\n▶ Vite: installing… ')
sh('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error', 'vite@latest', tarball], vite)
const viteVersion = JSON.parse(readFileSync(join(vite, 'node_modules/vite/package.json'), 'utf8')).version
console.log(`vite@${viteVersion}`)

await test(`vite@${viteVersion} (JS import + CSS @import)`, () => {
  sh('npx', ['vite', 'build'], vite)
  const files = distFiles(vite)
  const fonts = files.filter((f) => f.endsWith('.woff2')).map((f) => f.split('/').pop())
  const css = files.filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('\n')
  const errors = []
  // exactly the imported fonts: 1 Vazirmatn variable file + 4 Amiri files
  if (!fonts.some((f) => /^Vazirmatn-VF-.*\.woff2$/.test(f))) errors.push('Vazirmatn-VF.woff2 was not emitted')
  const amiri = fonts.filter((f) => f.startsWith('Amiri-'))
  if (amiri.length !== 4) errors.push(`expected 4 Amiri files, got ${amiri.length}`)
  if (fonts.length !== 5) errors.push(`expected 5 font files, got ${fonts.length}: ${fonts.join(', ')}`)
  for (const f of fonts) if (!css.includes(f)) errors.push(`${f} is not referenced from the CSS`)
  if (!/font-weight:\s*100 900/.test(css)) errors.push('variable weight range 100 900 missing')
  if (!/--font-vazirmatn-variable:\s*"?'?Vazirmatn Variable/.test(css)) errors.push('--font-vazirmatn-variable missing')
  if (!css.includes('.font-vazirmatn-variable')) errors.push('.font-vazirmatn-variable class missing')
  if (!/font-display:\s*swap/.test(css)) errors.push('font-display: swap missing')
  if (errors.length) throw new Error(errors.join('\n'))
  return `${fonts.length} font files emitted and referenced`
})

// ---- 2. Vite + Tailwind CSS 4 --------------------------------------------------
const tw = join(work, 'tailwind')
writeFiles(tw, {
  'package.json': JSON.stringify({ name: 'smoke-tailwind', private: true, type: 'module' }),
  'vite.config.js': "import tailwindcss from '@tailwindcss/vite'\nexport default { plugins: [tailwindcss()] }\n",
  'index.html': html('font-sans'),
  'main.js': "import './style.css'\n",
  'style.css': "@import 'tailwindcss';\n@import 'next-persian-fonts/css/estedad.css';\n\n@theme inline {\n  --font-sans: var(--font-estedad), sans-serif;\n}\n",
})
process.stdout.write('\n▶ Vite + Tailwind 4: installing… ')
sh('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error', 'vite@latest', 'tailwindcss@4', '@tailwindcss/vite@4', tarball], tw)
const twVersion = JSON.parse(readFileSync(join(tw, 'node_modules/tailwindcss/package.json'), 'utf8')).version
console.log(`tailwindcss@${twVersion}`)

await test(`tailwindcss@${twVersion} (@import + @theme)`, () => {
  sh('npx', ['vite', 'build'], tw)
  const files = distFiles(tw)
  const fonts = files.filter((f) => f.endsWith('.woff2')).map((f) => f.split('/').pop())
  const css = files.filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('\n')
  const errors = []
  if (fonts.length !== 1 || !fonts[0].startsWith('Estedad-VF')) errors.push(`expected only Estedad-VF.woff2, got ${fonts.join(', ')}`)
  else if (!css.includes(fonts[0])) errors.push(`${fonts[0]} is not referenced from the CSS`)
  if (!/\.font-sans\s*\{\s*font-family:\s*var\(--font-estedad\)/.test(css)) errors.push('.font-sans does not use var(--font-estedad)')
  if (errors.length) throw new Error(errors.join('\n'))
  return 'font-sans → Estedad'
})

// ---- 3. webpack 5 + css-loader (Gatsby) ----------------------------------------
const wp = join(work, 'webpack')
writeFiles(wp, {
  'package.json': JSON.stringify({ name: 'smoke-webpack', private: true }),
  'webpack.config.js': `const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  mode: 'production',
  entry: './main.js',
  output: { path: __dirname + '/dist', clean: true },
  plugins: [new MiniCssExtractPlugin()],
  module: { rules: [{ test: /\\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] }] },
}
`,
  'main.js': "import 'next-persian-fonts/css/sahel-fd.css'\n",
})
process.stdout.write('\n▶ webpack 5: installing… ')
sh('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error', 'webpack@5', 'webpack-cli@6', 'css-loader@7', 'mini-css-extract-plugin@2', tarball], wp)
const wpVersion = JSON.parse(readFileSync(join(wp, 'node_modules/webpack/package.json'), 'utf8')).version
console.log(`webpack@${wpVersion}`)

await test(`webpack@${wpVersion} + css-loader (JS import)`, () => {
  sh('npx', ['webpack'], wp)
  const files = distFiles(wp)
  const fonts = files.filter((f) => f.endsWith('.woff2')).map((f) => f.split('/').pop())
  const css = files.filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('\n')
  const errors = []
  if (fonts.length !== 5) errors.push(`expected the 5 Sahel FD files, got ${fonts.length}: ${fonts.join(', ')}`)
  for (const f of fonts) if (!css.includes(f)) errors.push(`${f} is not referenced from the CSS`)
  if (!css.includes('.font-sahel-fd')) errors.push('.font-sahel-fd class missing (CSS dropped?)')
  if (errors.length) throw new Error(errors.join('\n'))
  return `${fonts.length} font files emitted, CSS kept (sideEffects)`
})

// ---- 4. plain HTML <link> to node_modules ----------------------------------------
await test('plain HTML <link href="node_modules/next-persian-fonts/css/…">', () => {
  const cssDir = join(vite, 'node_modules/next-persian-fonts/css')
  let urls = 0
  for (const file of readdirSync(cssDir)) {
    for (const m of readFileSync(join(cssDir, file), 'utf8').matchAll(/url\('([^']+)'\)/g)) {
      if (!existsSync(join(cssDir, m[1]))) throw new Error(`${file}: ${m[1]} does not resolve inside node_modules`)
      urls++
    }
  }
  return `${readdirSync(cssDir).length} CSS files, ${urls} font URLs resolve`
})

console.log('\nSummary')
for (const r of results) console.log(`  ${r.ok ? '✓' : '✗'} ${r.label}${r.info ? ` — ${r.info}` : ''}`)
if (!process.env.KEEP) rmSync(work, { recursive: true, force: true })
else console.log(`Kept ${work}`)
if (results.some((r) => !r.ok)) process.exit(1)
