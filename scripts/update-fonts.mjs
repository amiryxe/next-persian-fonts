#!/usr/bin/env node
// Downloads the font files and license texts listed in fonts.json from upstream.
//
//   node scripts/update-fonts.mjs                 # (re)download every family at its pinned `ref`
//   node scripts/update-fonts.mjs --only estedad  # only some families (comma separated ids)
//   node scripts/update-fonts.mjs --check         # compare pinned versions with the latest upstream releases
//
// Sources (per family in fonts.json):
//   - default:  raw files from GitHub `repo` at `ref` (tag or commit SHA)
//   - `archive`: a release .zip/.tgz URL; `from` paths (and the license if `licenseFile.inArchive`) are inside it
// Per file:
//   - `subset: "arabic-latin"`: TTF → WOFF2 subset to Arabic + Latin (needs Python with `fonttools` and `brotli`;
//     set NPF_PYTHON to pick the interpreter, default `python3`). Only used for fonts whose license has no
//     Reserved Font Name for the font's own name; RFN fonts are shipped as the authors' unmodified WOFF2.
//   - `pinAxes: { "wdth": 100 }`: instance away extra variation axes before subsetting.
//
// To upgrade a font: bump `version` and `ref`/`archive` (and file paths if they changed) in fonts.json,
// run this script, then `npm run fonts:generate`. Set GITHUB_TOKEN to avoid API rate limits for --check.
import { mkdirSync, writeFileSync, readFileSync, copyFileSync, mkdtempSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkgDir = join(root, 'src', 'next-persian-fonts')
const manifest = JSON.parse(readFileSync(join(pkgDir, 'fonts.json'), 'utf8'))
const args = process.argv.slice(2)
const onlyIdx = args.indexOf('--only')
const only = onlyIdx >= 0 ? args[onlyIdx + 1].split(',') : null
const families = manifest.families.filter((f) => !only || only.includes(f.id))
const python = process.env.NPF_PYTHON ?? 'python3'

// Google Fonts "latin" + "arabic" subsets (plus a few symbols used in Persian text)
const SUBSETS = {
  'arabic-latin': [
    'U+0000-00FF', 'U+0131', 'U+0152-0153', 'U+02BB-02BC', 'U+02C6', 'U+02DA', 'U+02DC', 'U+0300-0308', 'U+030A', 'U+030C',
    'U+0327', 'U+0600-06FF', 'U+0750-077F', 'U+0870-08FF', 'U+2000-206F', 'U+20AC', 'U+20BA', 'U+20BC-20BD', 'U+2122',
    'U+2190-2199', 'U+2212', 'U+2215', 'U+25CC', 'U+FB50-FDFF', 'U+FE70-FEFF', 'U+FFFD',
  ].join(','),
}

const headers = { 'user-agent': 'next-persian-fonts-updater' }
if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`

const raw = (repo, ref, path) =>
  `https://raw.githubusercontent.com/${repo}/${ref}/${path.split('/').map(encodeURIComponent).join('/')}`

async function download(url, dest) {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`)
  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
}

function convert(src, dest, file) {
  let input = src
  if (file.pinAxes) {
    input = `${src}.instance.ttf`
    const axes = Object.entries(file.pinAxes).map(([k, v]) => `${k}=${v}`)
    execFileSync(python, ['-m', 'fontTools.varLib.instancer', src, ...axes, '-q', '-o', input], { stdio: 'inherit' })
  }
  execFileSync(python, ['-m', 'fontTools.subset', input, `--unicodes=${SUBSETS[file.subset]}`, '--layout-features=*',
    '--name-IDs=*', '--name-languages=*', '--notdef-outline', '--no-hinting', '--flavor=woff2', `--output-file=${dest}`], { stdio: 'inherit' })
}

async function check() {
  let outdated = 0
  for (const f of families) {
    if (f.repo === 'google/fonts') {
      console.log(`${f.name.padEnd(22)} pinned ${f.version.padEnd(9)} (google/fonts @ ${f.ref.slice(0, 7)}; check https://github.com/google/fonts/commits/main/ofl/${f.googleFontsDir})`)
      continue
    }
    const res = await fetch(`https://api.github.com/repos/${f.repo}/releases/latest`, { headers })
    let latest = null
    if (res.ok) latest = (await res.json()).tag_name
    else if (res.status !== 404) throw new Error(`GitHub API ${res.status} for ${f.repo} (set GITHUB_TOKEN?)`)
    const norm = (s) => String(s ?? '').replace(/^v/, '')
    const status = !latest ? 'no releases' : norm(latest) === norm(f.version) ? 'up to date' : `UPDATE AVAILABLE (${latest})`
    if (latest && norm(latest) !== norm(f.version)) outdated++
    console.log(`${f.name.padEnd(22)} pinned ${f.version.padEnd(9)} latest ${String(latest ?? '-').padEnd(10)} ${status}`)
  }
  if (outdated) process.exitCode = 1
}

async function update() {
  for (const f of families) {
    const work = mkdtempSync(join(tmpdir(), `npf-${f.id}-`))
    let extracted = null
    if (f.archive) {
      extracted = join(work, 'archive')
      mkdirSync(extracted)
      const file = join(work, f.archive.endsWith('.zip') ? 'a.zip' : 'a.tgz')
      await download(f.archive, file)
      if (file.endsWith('.zip')) execFileSync('unzip', ['-q', '-o', file, '-d', extracted])
      else execFileSync('tar', ['-xzf', file, '-C', extracted])
    }
    const fetchTo = async (from, dest) =>
      extracted ? copyFileSync(join(extracted, from), dest) : download(raw(f.repo, f.ref, from), dest)

    for (const v of f.variants) {
      const dir = join(pkgDir, v.subpath)
      mkdirSync(dir, { recursive: true })
      if (f.licenseFile.inArchive) copyFileSync(join(extracted, f.licenseFile.from), join(dir, f.licenseFile.to))
      else await download(raw(f.repo, f.ref, f.licenseFile.from), join(dir, f.licenseFile.to))
      for (const x of [v, ...(v.extra ?? [])]) {
        if (x.pinned) continue // kept as-is on purpose (see `deprecated` note in fonts.json)
        for (const file of x.files) {
          if (!file.subset) {
            await fetchTo(file.from, join(dir, file.to))
            continue
          }
          const tmp = join(work, file.from.split('/').pop())
          await fetchTo(file.from, tmp)
          convert(tmp, join(dir, file.to), file)
        }
      }
      console.log(`✓ ${f.name} → ${v.subpath}/`)
    }
    rmSync(work, { recursive: true, force: true })
  }
  console.log('Done. Now run: npm run fonts:generate')
}

await (args.includes('--check') ? check() : update())
