# qclay.design → apextechera — Output Plan

- Site origin: `https://qclay.design`
- Site key: `qclay-design-fc4b5892` (SHA-256(origin)[:8])
- Page key: `root-8a5edab2` (SHA-256(pathname `"/`")[:8])
- Destination route: `/` (first clone; replaces template scaffold)

## Roots
| Purpose | Path |
| --- | --- |
| Research/specs | `docs/research/qclay-design-fc4b5892/root-8a5edab2/` |
| Screenshots (QA) | `docs/design-references/qclay-design-fc4b5892/root-8a5edab2/` |
| Shared components | `src/components/sites/qclay-design-fc4b5892/shared/` |
| Page components | `src/components/sites/qclay-design-fc4b5892/root-8a5edab2/` |
| Infra (Controller/Animator/etc.) | `src/lib/sites/qclay-design-fc4b5892/` |
| Public assets | `/sites/qclay-design-fc4b5892/root-8a5edab2/` (images/, video/, projects/, fonts/, icons/) |

## Asset URL mapping (rewrite rules applied to every ported file)
- `/images/…` → `/sites/qclay-design-fc4b5892/root-8a5edab2/images/…`
- `/video/…` → `/sites/qclay-design-fc4b5892/root-8a5edab2/video/…`
- `/projects/…` → `/sites/qclay-design-fc4b5892/root-8a5edab2/projects/…`
- `/static/media/<MazzardM-Medium.*>` → `…/fonts/MazzardM-Medium.woff2` (CSS @font-face only)
- `/static/media/<MazzardM-Bold.*>` → `…/fonts/MazzardM-Bold.woff2`
- `/static/media/<AtypDisplay-Medium.*>` → `…/fonts/AtypDisplay-Medium.woff2`
- `/static/media/<arp-150.*>` → `…/fonts/arp-150.woff`
- `/static/media/<blur.*.webp>` → `…/images/startups/blur.webp`
- `/static/media/<infinite.*.webp>` → `…/images/startups/infinite.webp`
- `/static/media/<text.*.webp>` → `…/images/main/text.webp`
- `/static/media/<*.svg>` (socials/arrow) → `…/icons/<hashed-name>.svg`

## Module-scoped class names (kept verbatim from compiled CSS)
- VimeoPreview: `VimeoPreview_preview__BZUeA`

## Source of truth
- Recovered CRA source: `C:\Users\mahen\AppData\Local\Temp\opencode\qclay\src\` (port mechanically; keep logic byte-identical)
- Compiled CSS: `C:\Users\mahen\AppData\Local\Temp\opencode\qclay\main.css` → merge into `src/app/globals.css`
- Content: `C:\Users\mahen\AppData\Local\Temp\opencode\qclay\content.pretty.json` → `src/lib/sites/qclay-design-fc4b5892/qclay-content.json` (i18n payload)
- Portfolio: `public/sites/qclay-design-fc4b5892/root-8a5edab2/projects/projects.json`

## Library adaptations (only these deviate from source)
| Original | Replacement |
| --- | --- |
| `lodash` `_.get` in i18n.js | inline 2-line getter |
| `nookies` parseCookies (Form.js) | inline `document.cookie` reader (returns {} if absent) |
| `axios` (api/submit.js) | mock `sendForm` — 1s delay, success callback (demo scope) |
| `react-hook-form` (Form.js) | keep — install `react-hook-form` |
| `swiper` (Portfolio Slider) | keep — install `swiper` |
| `@vimeo/player` (Vimeo.js) | keep — install `@vimeo/player` |
| `classnames` | keep — install `classnames` |
| `react-helmet`/`Helmet` (App.js head) | replaced by Next.js `metadata` in `layout.tsx` |

## Build order
1. Research docs (this file + topology + behaviors) ✔
2. Assets downloaded (137 files) ✔
3. globals.css: `@import` Google fonts + qclay `:root` tokens + all compiled qclay rules (minus swiper-only + svg-inline dups), `@font-face` URLs rewritten to namespaced `fonts/` dir
4. Infra port → `src/lib/sites/qclay-design-fc4b5892/`: Controller, Sections, detector, useTransform+transforms, Animator, contexts, i18n, api, utils
5. Shared components port → `src/components/sites/qclay-design-fc4b5892/shared/`
6. Page components port → `src/components/sites/qclay-design-fc4b5892/root-8a5edab2/`
7. Assemble `src/app/page.tsx` (client component rendering ported `<App />`-equivalent at `/`), metadata in `layout.tsx`
8. `npm run typecheck` + `npm run build`; fix
9. QA (dev server + build output inspection)

## Verification plan (no browser tooling)
- `npm run build` passes, `npx tsc --noEmit` clean
- Grep-check: no `@/` imports, no `/images/`, `/video/` unprefixed literals, no `.scss` imports left in ported tree
- Asset fingerprint: every referenced asset exists under public root
- Dev-server smoke: fetch `/` returns 200; check hydration errors via console marker (add temporary `console.error` listener note)
