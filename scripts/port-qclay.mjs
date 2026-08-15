import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC = 'C:/Users/mahen/AppData/Local/Temp/opencode/qclay/src'
const OUT_BASE = path.join(__dirname, '..', 'src')

const SITE = 'qclay-design-fc4b5892'
const PAGE = 'root-8a5edab2'
const ASSET_ROOT = `/sites/${SITE}/${PAGE}`
const LIB = path.join(OUT_BASE, 'lib', 'sites', SITE)
const SHARED = path.join(OUT_BASE, 'components', 'sites', SITE, 'shared')
const PAGE_DIR = path.join(OUT_BASE, 'components', 'sites', SITE, PAGE)

// Manual files: ported by hand after this script
const MANUAL = new Set([
  'i18n/i18n.js',
  'api/submit.js',
  'api/getProjects.js',
  'views/Home/components/RequestForm/components/Form/Form.js',
  'components/UI/SocialItem/SocialItem.js',
  'components/UI/Video/Video.js',
])
// Excluded entirely
const EXCLUDE = new Set([
  'App.js', 'index.js',
  'views/XRedirect.js',
  'views/Terms/index.js',
  'views/Terms/Terms.module.scss_912d',
  'views/BlogArticle/BlogArticle.js',
  'views/BlogArticle/components/Article/Article.js',
  'views/BlogArticle/components/Footer/Footer.js',
  'views/BlogArticle/components/Header/Header.js',
  'views/BlogArticle/components/Header/Menu/AnimateLink.js',
  'views/BlogArticle/components/Header/Menu/Menu.js',
  'qclay-agency/src/views/Home/components/Main/VimeoPreview/VimeoPreview.module.scss_98bc',
  'qclay-agency/src/views/Terms/Terms.module.scss_912d',
  'components/UI/SocialItem/assets/behance.svg',
  'components/UI/SocialItem/assets/dribble.svg',
  'components/UI/SocialItem/assets/instagram.svg',
  'components/UI/SocialItem/assets/tiktok.svg',
  'views/Home/components/RequestForm/components/Preview/assets/arrow.svg',
])

function targetFor(rel) {
  if (rel.startsWith('views/Home/')) return path.join(PAGE_DIR, rel.slice('views/Home/'.length))
  if (rel.startsWith('components/')) return path.join(SHARED, rel.slice('components/'.length))
  if (rel.startsWith('Animator/')) return path.join(LIB, 'Animator', rel.slice('Animator/'.length))
  if (rel.startsWith('Controller/')) return path.join(LIB, 'Controller', rel.slice('Controller/'.length))
  if (rel.startsWith('api/')) return path.join(LIB, 'api', rel.slice('api/'.length))
  if (rel.startsWith('context/')) return path.join(LIB, 'context', rel.slice('context/'.length))
  if (rel.startsWith('i18n/')) return path.join(LIB, 'i18n', rel.slice('i18n/'.length))
  if (rel === 'utils.js') return path.join(LIB, 'utils.js')
  throw new Error(`no mapping for ${rel}`)
}

const ORIG = new Map() // original abs path -> rel
for (const f of walk(SRC)) {
  const rel = path.relative(SRC, f).split(path.sep).join('/')
  ORIG.set(path.resolve(f), rel)
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

function resolveOriginal(importerDir, spec) {
  let base
  if (spec.startsWith('@/')) base = path.join(SRC, spec.slice(2))
  else if (spec.startsWith('.')) base = path.resolve(importerDir, spec)
  else return null
  const candidates = [base, base + '.js', base + '.jsx', base + '.ts', base + '.tsx', base + '.scss', base + '.module.scss', base + '.svg', path.join(base, 'index.js'), path.join(base, 'index.jsx')]
  for (const c of candidates) {
    const rel = ORIG.get(path.resolve(c))
    if (rel) return rel
  }
  return null
}

const unresolved = []

function rewrite(content, fileRel) {
  const importerDir = path.dirname(path.join(SRC, fileRel))
  const importRe = /import\s+(?:([\w${},*\s]+?)\s+from\s+)?["']([^"']+)["'];?/g
  let out = ''
  let last = 0
  let m
  while ((m = importRe.exec(content))) {
    out += content.slice(last, m.index)
    const binding = m[1]
    const spec = m[2]
    // external package imports
    if (!spec.startsWith('@/') && !spec.startsWith('.')) {
      if (spec === 'swiper/css' || spec === 'swiper/css/pagination' || spec.includes('.scss') || spec === 'lodash/get' || spec === 'axios' || spec === 'nookies') {
        // dropped entirely (handled by manual ports or not needed)
        last = importRe.lastIndex
        continue
      }
      out += m[0]
      last = importRe.lastIndex
      continue
    }
    // svg asset import -> public URL const
    if (spec.endsWith('.svg') || spec.endsWith('.svg"')) {
      if (binding) {
        const name = binding.replace(/\{[^}]*\}/g, '').replace(/as\s+(\w+)/, '$1').trim().split(',').map(s => s.trim()).filter(Boolean)[0]
        const pub = `${ASSET_ROOT}/icons/${path.basename(spec)}`
        out += `const ${name} = "${pub}";\n`
        last = importRe.lastIndex
        continue
      }
    }
    // module scss -> css const map
    if (spec.includes('.module.scss')) {
      const name = (binding || 'css').split(' ').pop().replace(/as\s+/, '')
      out += `const ${name} = { preview: "VimeoPreview_preview__BZUeA" };\n`
      last = importRe.lastIndex
      continue
    }
    // plain scss -> drop
    if (spec.includes('.scss')) {
      last = importRe.lastIndex
      continue
    }
    // internal resolution
    const origRel = resolveOriginal(importerDir, spec)
    if (!origRel) {
      unresolved.push(`${fileRel}: "${spec}"`)
      out += m[0]
      last = importRe.lastIndex
      continue
    }
    const targetAbs = targetFor(origRel)
    let rel = path.relative(path.dirname(targetFor(fileRel)), targetAbs).split(path.sep).join('/')
    if (!rel.startsWith('.')) rel = './' + rel
    rel = rel.replace(/\.(jsx?|tsx?)$/, '')
    out += `import ${binding} from "${rel}"`
    last = importRe.lastIndex
  }
  out += content.slice(last)

  // asset path literals
  for (const prefix of ['/images/', '/video/', '/projects/']) {
    out = out.split(prefix).join(ASSET_ROOT + prefix)
  }
  return out
}

const report = { ported: [], skipped: [] }
let error = 0

for (const [abs, rel] of ORIG) {
  if (EXCLUDE.has(rel)) continue
  const target = targetFor(rel)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  if (MANUAL.has(rel)) {
    fs.writeFileSync(target, `// PORTED MANUALLY — see port script\n`)
    report.skipped.push(rel)
    continue
  }
  let content = fs.readFileSync(abs, 'utf8')
  try {
    content = rewrite(content, rel)
  } catch (e) {
    console.error(`ERROR in ${rel}: ${e.message}`)
    error++
    continue
  }
  fs.writeFileSync(target, content)
  report.ported.push(rel)
}

console.log(`Ported: ${report.ported.length}, manual: ${report.skipped.length}, errors: ${error}`)
console.log(`Unresolved imports (${unresolved.length}):`)
for (const u of unresolved) console.log('  ' + u)
