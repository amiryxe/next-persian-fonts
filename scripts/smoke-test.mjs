#!/usr/bin/env node
// Builds a throw-away Next.js app against the packed tarball of next-persian-fonts for several
// Next.js versions and bundlers, then checks the generated CSS/HTML. Each version also builds a
// Pages Router page (with the documented `transpilePackages`), and Next.js 16 runs a next/jest test.
//
//   node scripts/smoke-test.mjs                # full matrix
//   node scripts/smoke-test.mjs --next 16      # one Next.js major (repeatable / comma separated)
//   KEEP=1 node scripts/smoke-test.mjs          # keep the temp apps for inspection
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkgDir = join(root, 'src', 'next-persian-fonts')
const manifest = JSON.parse(readFileSync(join(pkgDir, 'fonts.json'), 'utf8'))

const MATRIX = [
  { next: '13.5', react: '18', types: '18', bundlers: { webpack: [] } },
  { next: '14', react: '18', types: '18', bundlers: { webpack: [] } },
  { next: '15', react: '19', types: '19', bundlers: { webpack: [], turbopack: ['--turbopack'] } },
  { next: '16', react: '19', types: '19', bundlers: { turbopack: [], webpack: ['--webpack'] }, jest: true },
]

const args = process.argv.slice(2)
const wanted = args.flatMap((a, i) => (args[i - 1] === '--next' ? a.split(',') : []))
const matrix = wanted.length ? MATRIX.filter((m) => wanted.includes(m.next)) : MATRIX
if (!matrix.length) throw new Error(`No matrix entry for --next ${wanted.join(',')}`)

const sh = (cmd, cmdArgs, cwd, env = {}) =>
  execFileSync(cmd, cmdArgs, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1', ...env } })

const work = mkdtempSync(join(tmpdir(), 'npf-smoke-'))
console.log(`Packing next-persian-fonts into ${work}`)
const tarball = join(work, JSON.parse(sh('npm', ['pack', '--json', '--pack-destination', work], pkgDir))[0].filename)

// ---- test app sources -------------------------------------------------------
const exportsBySubpath = {}
for (const f of manifest.families)
  for (const v of f.variants) exportsBySubpath[v.subpath] = [v, ...(v.extra ?? [])].map((x) => x.export)
const allNames = Object.values(exportsBySubpath).flat()

const files = {
  'next.config.mjs': "export default { output: 'export' }\n",
  'tsconfig.json': JSON.stringify({
    compilerOptions: {
      target: 'ES2017', lib: ['dom', 'dom.iterable', 'esnext'], allowJs: true, skipLibCheck: true, strict: true,
      noEmit: true, esModuleInterop: true, module: 'esnext', moduleResolution: 'bundler', resolveJsonModule: true,
      isolatedModules: true, jsx: 'preserve', incremental: true, plugins: [{ name: 'next' }],
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  }, null, 2),
  'app/layout.tsx': `export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fa" dir="rtl"><body>{children}</body></html>
}
`,
  'app/page.tsx': `${Object.entries(exportsBySubpath).map(([s, n]) => `import { ${n.join(', ')} } from 'next-persian-fonts/${s}'`).join('\n')}
import type { PersianFont } from 'next-persian-fonts'

const fonts: PersianFont[] = [${allNames.join(', ')}]

export default function Page() {
  return (
    <main>
      {fonts.map((f) => (
        <p key={f.variable} className={\`\${f.className} \${f.variable}\`}>سلام دنیا ۱۲۳ 123</p>
      ))}
    </main>
  )
}
`,
  // root (1.0.x-style) barrel import must keep working
  'app/legacy/page.tsx': `import { sahel } from 'next-persian-fonts'

export default function Legacy() {
  return <p className={sahel.className}>سلام</p>
}
`,
}

// Pages Router: Next.js does not bundle node_modules packages for pages/, so the docs tell users to add
// transpilePackages. This page (plus that config) must build.
const pagesFiles = {
  'next.config.mjs': "export default { output: 'export', transpilePackages: ['next-persian-fonts'] }\n",
  'pages/pages-router.tsx': `import { samim } from 'next-persian-fonts/samim'
import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'

export default function PagesRouter() {
  return <main className={vazirmatnVariable.className}><p className={samim.className}>سلام از Pages Router</p></main>
}
`,
  'jest.config.mjs': "import nextJest from 'next/jest.js'\nexport default nextJest({ dir: './' })({ testEnvironment: 'node' })\n",
  '__tests__/font.test.js': `import { sahel } from 'next-persian-fonts/sahel'
import { vazirmatnVariable } from 'next-persian-fonts/vazirmatn-variable'

test('font objects work under next/jest', () => {
  expect(typeof sahel.className).toBe('string')
  expect(typeof vazirmatnVariable.variable).toBe('string')
})
`,
}

const writeFiles = (app, map) => {
  for (const [p, c] of Object.entries(map)) {
    mkdirSync(dirname(join(app, p)), { recursive: true })
    writeFileSync(join(app, p), c)
  }
}

// ---- run --------------------------------------------------------------------
const results = []
for (const m of matrix) {
  const app = join(work, `next-${m.next}`)
  mkdirSync(app, { recursive: true })
  writeFiles(app, files)
  writeFileSync(join(app, 'package.json'), JSON.stringify({ name: `smoke-next-${m.next.replace('.', '-')}`, private: true }))
  process.stdout.write(`\n▶ Next.js ${m.next}: installing… `)
  sh('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error',
    `next@${m.next}`, `react@${m.react}`, `react-dom@${m.react}`, 'typescript@5',
    `@types/react@${m.types}`, `@types/react-dom@${m.types}`, '@types/node@22', tarball], app)
  const version = JSON.parse(readFileSync(join(app, 'node_modules/next/package.json'), 'utf8')).version
  console.log(`next@${version}`)

  for (const [bundler, flags] of Object.entries(m.bundlers)) {
    const label = `next@${version} (${bundler})`
    rmSync(join(app, '.next'), { recursive: true, force: true })
    rmSync(join(app, 'out'), { recursive: true, force: true })
    const t0 = Date.now()
    try {
      sh('npx', ['next', 'build', ...flags], app)
      const problems = check(app)
      const secs = ((Date.now() - t0) / 1000).toFixed(1)
      if (problems.errors.length) throw new Error(problems.errors.join('\n'))
      console.log(`  ✓ ${label} built in ${secs}s — ${problems.info}`)
      results.push({ label, ok: true, info: problems.info })
    } catch (e) {
      const out = `${e.stdout ?? ''}${e.stderr ?? ''}${e.stdout || e.stderr ? '' : e.message}`
      console.log(`  ✗ ${label} FAILED\n${out.split('\n').slice(-40).join('\n')}`)
      results.push({ label, ok: false })
    }
  }

  // Pages Router (first bundler of this version) + next/jest (Next.js 16)
  const [bundler, flags] = Object.entries(m.bundlers)[0]
  const label = `next@${version} Pages Router (${bundler})`
  try {
    writeFiles(app, pagesFiles)
    rmSync(join(app, '.next'), { recursive: true, force: true })
    rmSync(join(app, 'out'), { recursive: true, force: true })
    sh('npx', ['next', 'build', ...flags], app)
    const html = findHtml(join(app, 'out'), 'pages-router')
    if (!html.includes('سلام از Pages Router')) throw new Error('pages-router.html has no content')
    console.log(`  ✓ ${label} (transpilePackages)`)
    results.push({ label, ok: true })
  } catch (e) {
    console.log(`  ✗ ${label} FAILED\n${`${e.stdout ?? ''}${e.stderr ?? ''}${e.message}`.split('\n').slice(-30).join('\n')}`)
    results.push({ label, ok: false })
  }
  if (m.jest) {
    const jl = `next@${version} next/jest`
    try {
      sh('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error', 'jest@30'], app)
      sh('npx', ['jest', '--ci'], app)
      console.log(`  ✓ ${jl}`)
      results.push({ label: jl, ok: true })
    } catch (e) {
      console.log(`  ✗ ${jl} FAILED\n${`${e.stdout ?? ''}${e.stderr ?? ''}`.split('\n').slice(-30).join('\n')}`)
      results.push({ label: jl, ok: false })
    }
  }
  if (!process.env.KEEP) rmSync(app, { recursive: true, force: true })
}

function findHtml(out, route) {
  for (const p of [`${route}.html`, `${route}/index.html`]) if (existsSync(join(out, p))) return readFileSync(join(out, p), 'utf8')
  throw new Error(`no exported HTML for /${route}`)
}

function check(app) {
  const errors = []
  const out = join(app, 'out')
  const css = []
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) walk(join(d, e.name))
      else if (e.name.endsWith('.css')) css.push(readFileSync(join(d, e.name), 'utf8'))
    }
  }
  walk(join(out, '_next'))
  const allCss = css.join('\n')
  const faces = allCss.match(/@font-face\s*\{[^}]*\}/g) ?? []
  const realFaces = faces.filter((f) => !/local\(/.test(f))
  // every variable font must declare its weight range so browsers do not synthesize bold
  const ranges = (allCss.match(/font-weight:\s*100 900/g) ?? []).length
  if (ranges < 5) errors.push(`expected ≥5 @font-face rules with "font-weight: 100 900", found ${ranges}`)
  const expectedFiles = manifest.families.flatMap((f) => f.variants.flatMap((v) => [v, ...(v.extra ?? [])].flatMap((x) => x.files))).length
  if (realFaces.length < expectedFiles) errors.push(`expected ≥${expectedFiles} @font-face rules, found ${realFaces.length}`)
  const preloads = (html) => (html.match(/<link[^>]+rel="preload"[^>]+as="font"/g) ?? []).length
  findHtml(out, 'legacy') // the root (1.0.x-style) import must still build
  const home = preloads(findHtml(out, 'index'))
  return { errors, info: `${realFaces.length} @font-face rules, ${ranges} variable weight ranges, ${home} font preloads` }
}

console.log('\nSummary')
for (const r of results) console.log(`  ${r.ok ? '✓' : '✗'} ${r.label}${r.info ? ` — ${r.info}` : ''}`)
if (!process.env.KEEP) rmSync(work, { recursive: true, force: true })
else console.log(`Kept ${work}`)
if (results.some((r) => !r.ok)) process.exit(1)
