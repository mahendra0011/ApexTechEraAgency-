import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.join(__dirname, '..')
const TMP = 'C:/Users/mahen/AppData/Local/Temp/opencode/qclay'
const ASSET = '/sites/qclay-design-fc4b5892/root-8a5edab2'

let css = fs.readFileSync(path.join(TMP, 'main.css'), 'utf8')

// strip the google fonts @import (added explicitly at top of globals) — note semicolons inside the URL
css = css.replace(/@import url\(https:\/\/fonts\.googleapis\.com[^)]*\);?/, '')
// strip the trailing sourceMappingURL comment
css = css.replace(/\/\*# sourceMappingURL=[^*]*\*\//, '')

// font-face url rewrites
css = css.replace(/\/static\/media\/(MazzardM-Medium\.[0-9a-f]+\.(woff2|woff|ttf|eot))/g, `${ASSET}/fonts/MazzardM-Medium.$2`)
css = css.replace(/\/static\/media\/(MazzardM-Bold\.[0-9a-f]+\.(woff2|woff|ttf|eot))/g, `${ASSET}/fonts/MazzardM-Bold.$2`)
css = css.replace(/\/static\/media\/(AtypDisplay-Medium\.[0-9a-f]+\.(woff2|woff|ttf|eot))/g, `${ASSET}/fonts/AtypDisplay-Medium.$2`)
css = css.replace(/\/static\/media\/(arp-150\.[0-9a-f]+\.(woff2|woff|ttf|eot))/g, `${ASSET}/fonts/arp-150.$2`)
css = css.replace(/\/static\/media\/blur\.[0-9a-f]+\.webp/g, `${ASSET}/images/startups/blur.webp`)
css = css.replace(/\/static\/media\/infinite\.[0-9a-f]+\.webp/g, `${ASSET}/images/startups/infinite.webp`)
css = css.replace(/\/static\/media\/text\.[0-9a-f]+\.webp/g, `${ASSET}/images/main/text.webp`)

const leftovers = css.match(/\/static\/media\/[^)'"]+/g) || []
console.log('leftover /static/media refs:', leftovers.length ? leftovers : 'none')

// normalize-restore block (Tailwind preflight differs from CRA normalize on a few props)
const restore = `
/* --- normalize-restore (clone fidelity over Tailwind preflight) --- */
img { display: inline-block; max-width: none; }
button, input, textarea, select { font: inherit; }
a { color: inherit; text-decoration: inherit; }
`

const globals = `@import url(https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap);
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, monospace;
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.87 0 0);
  --chart-2: oklch(0.556 0 0);
  --chart-3: oklch(0.439 0 0);
  --chart-4: oklch(0.371 0 0);
  --chart-5: oklch(0.269 0 0);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

/* ================= qclay.design compiled CSS (verbatim) ================= */
${css}

/* ================= end qclay ================= */
${restore}
`

fs.writeFileSync(path.join(REPO, 'src', 'app', 'globals.css'), globals)
console.log('globals.css written:', globals.length, 'bytes')
