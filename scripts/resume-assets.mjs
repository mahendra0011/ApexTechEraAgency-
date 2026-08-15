import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE = 'https://qclay.design'
const OUT = path.join(__dirname, '..', 'public', 'sites', 'qclay-design-fc4b5892', 'root-8a5edab2')

const targets = []
const frames = []
for (let i = 1; i <= 47; i++) frames.push(`/images/startups/frames/rope_${String(i).padStart(3, '0')}.webp`)
targets.push(...frames)
targets.push('/logo-q.png', '/projects.json', '/static/media/arrow.72c444f1ea0b27e269db3cd4b460206a.svg')

function destFor(src) {
  if (src.startsWith('/images/')) return path.join(OUT, 'images', src.replace('/images/', ''))
  if (src.startsWith('/static/media/')) return path.join(OUT, 'icons', path.basename(src))
  return path.join(OUT, src.replace(/^\//, ''))
}

async function fetchOne(src) {
  const dest = destFor(src)
  if (fs.existsSync(dest) && fs.statSync(dest).size > 100 && !src.includes('arrow')) return 'SKIP ' + src
  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), 20000)
  try {
    const res = await fetch(BASE + src, { redirect: 'follow', signal: ac.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.writeFileSync(dest, buf)
    console.log(`OK ${src} (${buf.length}b)`)
  } catch (e) {
    console.log(`FAIL ${src} (${e.message})`)
  } finally {
    clearTimeout(timer)
  }
}

for (const src of targets) await fetchOne(src)
console.log('done')
