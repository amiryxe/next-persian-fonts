#!/usr/bin/env node
// Downloads the font files and license texts listed in fonts.json from upstream GitHub repos.
//
//   node scripts/update-fonts.mjs                 # (re)download every family at its pinned `ref`
//   node scripts/update-fonts.mjs --only estedad  # only one family (comma separated list allowed)
//   node scripts/update-fonts.mjs --check         # compare pinned versions with the latest upstream releases
//
// To upgrade a font: bump `version` and `ref` (and file paths if they changed) in fonts.json,
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

async function check() {
  let outdated = 0
  for (const f of families) {
    const res = await fetch(`https://api.github.com/repos/${f.repo}/releases/latest`, { headers })
    let latest = null
    if (res.ok) latest = (await res.json()).tag_name
    else if (res.status !== 404) throw new Error(`GitHub API ${res.status} for ${f.repo} (set GITHUB_TOKEN?)`)
    const norm = (s) => String(s ?? '').replace(/^v/, '')
    const status = !latest ? 'no releases' : norm(latest) === norm(f.version) ? 'up to date' : `UPDATE AVAILABLE (${latest})`
    if (latest && norm(latest) !== norm(f.version)) outdated++
    console.log(`${f.name.padEnd(12)} pinned ${f.version.padEnd(8)} latest ${String(latest ?? '-').padEnd(10)} ${status}`)
  }
  if (outdated) process.exitCode = 1
}

async function update() {
  for (const f of families) {
    // Some fonts are only published as release archives (`archive`); then `from` is a path inside the zip.
    let extracted = null
    if (f.archive) {
      extracted = mkdtempSync(join(tmpdir(), `npf-${f.id}-`))
      await download(f.archive, join(extracted, 'archive.zip'))
      execFileSync('unzip', ['-q', '-o', join(extracted, 'archive.zip'), '-d', extracted])
    }
    for (const v of f.variants) {
      const dir = join(pkgDir, v.subpath)
      await download(raw(f.repo, f.ref, f.licenseFile.from), join(dir, f.licenseFile.to))
      for (const x of [v, ...(v.extra ?? [])]) {
        if (x.pinned) continue // kept as-is on purpose (see `deprecated` note in fonts.json)
        for (const file of x.files) {
          if (extracted) copyFileSync(join(extracted, file.from), join(dir, file.to))
          else await download(raw(f.repo, f.ref, file.from), join(dir, file.to))
        }
      }
      console.log(`✓ ${f.name} → ${v.subpath}/`)
    }
    if (extracted) rmSync(extracted, { recursive: true, force: true })
  }
  console.log('Done. Now run: npm run fonts:generate')
}

await (args.includes('--check') ? check() : update())
