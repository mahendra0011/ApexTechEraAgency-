import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE = 'https://qclay.design'
const OUT = path.join(__dirname, '..', 'public', 'sites', 'qclay-design-fc4b5892', 'root-8a5edab2')

const IMAGES = [
  '/images/calendar.svg',
  '/images/clutch.svg',
  '/images/designers/avatars/1.png',
  '/images/designers/avatars/2.webp',
  '/images/designers/avatars/3.png',
  '/images/designers/avatars/4.webp',
  '/images/designers/avatars/5.webp',
  '/images/designers/avatars/6.webp',
  '/images/designers/avatars/7.webp',
  '/images/designers/avatars/8.webp',
  '/images/designers/avatars/9.webp',
  '/images/designers/large.webp',
  '/images/designers/medium.webp',
  '/images/designers/small.webp',
  '/images/dribbble-badge.png',
  '/images/dribbble-img.png',
  '/images/in-this-article-label.png',
  '/images/main/home.webp',
  '/images/main/text.webp',
  '/images/star.svg',
  '/images/startups/logo.webp',
  '/images/telegram.v2.png',
  '/images/top-agency-left.png',
  '/images/top-agency-right.png',
  '/images/wa.svg',
  '/images/whatCreate/1.webp',
  '/images/whatCreate/2.webp',
  '/images/whatCreate/3.webp',
  '/images/whatCreate/4.webp',
  '/images/whatCreate/5.webp',
  '/images/whatCreate/6.webp',
  '/images/whatCreate/grid.webp',
  '/images/whatCreate/interface/background.webp',
  '/images/whatCreate/interface/desktop-header.webp',
  '/images/whatCreate/interface/logo.webp',
  '/images/whatCreate/interface/mobile-header.webp',
  '/images/whatCreate/interface/mobile-ops.webp',
  '/images/whatCreate/interface/other-options.webp',
  '/images/whatCreate/interface/prototype.webp',
  '/images/whatCreate/interface/row.webp',
  '/images/whatCreate/interface/sidebar.webp',
  '/images/whatCreate/interface/tasks.webp',
  '/images/whatCreate/interface/title.webp',
]

const VIDEOS = [
  '/video/about/1.mp4',
  '/video/about/1-poster.webp',
  '/video/about/2.mp4',
  '/video/about/2-poster.webp',
  '/video/about/3.mp4',
  '/video/about/3-poster.webp',
  '/video/contact/ch.mp4',
  '/video/contact/character-poster.webp',
  '/video/create/land.mp4',
  '/video/create/land-poster.webp',
  '/video/menu/1.mp4',
  '/video/menu/1-poster.webp',
  '/video/menu/2.mp4',
  '/video/menu/3.mp4',
  '/video/menu/3-poster.webp',
  '/video/menu/4.mp4',
  '/video/menu/4-poster.webp',
  '/video/portfolio/hand.mp4',
  '/video/portfolio/hand.webp',
  '/video/refs.mp4',
]

const PROJECTS = [
  '/projects/ocamba.png',
  '/projects/niftynafty.png',
  '/projects/polars2.png',
  '/projects/mindnest.png',
  '/projects/bottlehaus.jpg',
  '/projects/vvs.png',
  '/projects/convoa.png',
  '/projects/eletix.png',
  '/projects/meditx.png',
]

const FONTS = [
  '/static/media/MazzardM-Medium.f5ea32168f0ef1e08ef3.woff2',
  '/static/media/MazzardM-Medium.9dc18b4326586ddc50c3.ttf',
  '/static/media/MazzardM-Bold.3a620cadf37c78d11e6c.woff2',
  '/static/media/MazzardM-Bold.5ad0d5064d405c51218a.ttf',
  '/static/media/AtypDisplay-Medium.6c58aa46196848e8bf36.woff2',
  '/static/media/AtypDisplay-Medium.3f7d6d43b083c7d491db.ttf',
  '/static/media/arp-150.9b25897afc22ecbc0213.woff',
  '/static/media/arp-150.2f5bdb2f9e3ffe427568.ttf',
]

const MEDIA = [
  '/static/media/blur.dac95cc078d0910c46a2.webp',
  '/static/media/infinite.d8f28e696aa840dc6483.webp',
  '/static/media/text.1c7e32d321384e3c65c9.webp',
]

const SVGS = [
  '/static/media/behance.62c30ce6522c4b7ce67f292eadfce66c.svg',
  '/static/media/dribble.c6e2b9e68082b9bba6386b47e7741bdb.svg',
  '/static/media/instagram.f0d5fc1f9c39c6cb92e2d58164f68345.svg',
  '/static/media/tiktok.d17c41762a57d02f4192f06f5311dc9a.svg',
  '/static/media/arrow.72c444f1ea0b27e269db3cd4b460206a.svg',
]

const ROOT_FILES = ['/favicon.ico', '/preview.jpg', '/logo-q.png', '/projects.json']

function destFor(src) {
  if (src.startsWith('/images/')) return path.join(OUT, 'images', src.replace('/images/', ''))
  if (src.startsWith('/video/')) return path.join(OUT, 'video', src.replace('/video/', ''))
  if (src.startsWith('/projects/')) return path.join(OUT, 'projects', src.replace('/projects/', ''))
  if (src.startsWith('/static/media/')) {
    const name = path.basename(src)
    const ext = path.extname(name)
    const base = name.replace(/\.(woff2|woff|ttf|eot)$/, '')
    if (base.startsWith('MazzardM-Medium')) return path.join(OUT, 'fonts', 'MazzardM-Medium' + ext)
    if (base.startsWith('MazzardM-Bold')) return path.join(OUT, 'fonts', 'MazzardM-Bold' + ext)
    if (base.startsWith('AtypDisplay-Medium')) return path.join(OUT, 'fonts', 'AtypDisplay-Medium' + ext)
    if (base.startsWith('arp-150')) return path.join(OUT, 'fonts', 'arp-150' + ext)
    if (name.startsWith('blur.')) return path.join(OUT, 'images', 'startups', 'blur.webp')
    if (name.startsWith('infinite.')) return path.join(OUT, 'images', 'startups', 'infinite.webp')
    if (name.startsWith('text.')) return path.join(OUT, 'images', 'main', 'text.webp')
    if (name.endsWith('.svg')) return path.join(OUT, 'icons', name)
  }
  return path.join(OUT, src.replace(/^\//, ''))
}

const fail = []
let ok = 0

async function fetchOne(src) {
  const dest = destFor(src)
  try {
    const res = await fetch(BASE + src, { redirect: 'follow' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.writeFileSync(dest, buf)
    ok++
    console.log(`OK ${src} -> ${dest.replace(process.cwd(), '.')} (${buf.length}b)`)
  } catch (e) {
    fail.push({ src, dest, err: e.message })
    console.log(`FAIL ${src} (${e.message})`)
  }
}

async function main() {
  const all = [...IMAGES, ...VIDEOS, ...PROJECTS, ...FONTS, ...MEDIA, ...SVGS, ...ROOT_FILES]
  for (const src of all) await fetchOne(src)
  console.log(`\n=== ${ok} downloaded, ${fail.length} failed ===`)
  for (const f of fail) console.log(`FAILED: ${f.src} -> ${f.dest}`)
  const frames = []
  for (let i = 1; i <= 47; i++) frames.push(`/images/startups/frames/rope_${String(i).padStart(3, '0')}.webp`)
  console.log(`\n--- now fetching ${frames.length} animation frames ---`)
  for (const src of frames) await fetchOne(src)
  console.log(`\n=== frames: ${ok - all.length} downloaded, ${fail.length} total failed ===`)
  for (const f of fail) console.log(`FAILED: ${f.src}`)
}

main()
