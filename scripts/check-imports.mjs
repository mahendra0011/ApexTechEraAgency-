import fs from 'node:fs'
import path from 'node:path'

const ROOTS = [
  'C:/Users/mahen/apextechera/src/components/sites/qclay-design-fc4b5892',
  'C:/Users/mahen/apextechera/src/lib/sites/qclay-design-fc4b5892',
  'C:/Users/mahen/apextechera/src/components/sites/qclay-design-fc4b5892/AppClone.jsx',
]
const ALL = new Map()
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else ALL.set(path.resolve(p), true)
  }
}
walk(ROOTS[0]); walk(ROOTS[1])

const EXT = ['.js', '.jsx', '.ts', '.tsx', '.json']
const re = /(?:import\s+(?:[\w${},*\s]+?\s+from\s+)?|require\()["'](\.[^"']+)["']/g

let issues = 0
for (const [abs] of ALL) {
  if (!/\.(js|jsx|ts|tsx)$/.test(abs)) continue
  const content = fs.readFileSync(abs, 'utf8')
  let m
  while ((m = re.exec(content))) {
    const spec = m[1]
    if (spec.includes('.scss')) continue
    const base = path.resolve(path.dirname(abs), spec)
    const candidates = [base, ...EXT.map(e => base + e)]
    const ok = candidates.some(c => ALL.has(path.resolve(c)))
    if (!ok) {
      issues++
      console.log(`MISSING: ${path.relative('C:/Users/mahen/apextechera/src', abs)} -> "${spec}"`)
    }
  }
}
console.log(issues ? `\n${issues} broken imports` : 'All imports resolve.')