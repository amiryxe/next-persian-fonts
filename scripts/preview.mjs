#!/usr/bin/env node
// Serves the static export in ./out under the GitHub Pages base path (/next-persian-fonts),
// so the local preview matches https://amiryxe.github.io/next-persian-fonts/.
//   npm run build && npm start        →  http://localhost:4173/next-persian-fonts/
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = '/next-persian-fonts'
const out = fileURLToPath(new URL('../out', import.meta.url))
const port = Number(process.env.PORT ?? 4173)
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.png': 'image/png',
}

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (url === '/' ) return res.writeHead(302, { location: `${BASE}/` }).end()
  if (!url.startsWith(BASE)) return res.writeHead(404).end('Not found')
  let file = normalize(join(out, url.slice(BASE.length)))
  if (!file.startsWith(out)) return res.writeHead(403).end()
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html')
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }).end(await readFile(file))
  } catch {
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }).end(await readFile(join(out, '404.html')).catch(() => 'Not found'))
  }
}).listen(port, () => console.log(`Preview: http://localhost:${port}${BASE}/`))
