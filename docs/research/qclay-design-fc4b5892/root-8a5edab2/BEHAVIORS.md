# BEHAVIORS — qclay.design `/`

## Controller (fullpage scroller) — the core behavior
- All sections absolutely stacked; only `-prev/-active/-next` shown (CSS transform/opacity).
- Transition: duration 700ms (ease-out), wheel/scroll/swipe detection → `customwheel` → `externalChange({from,to,dir})` → `setActiveId`.
- `externalChange` during transition uses `externalDelay 500` / `externalDuration 400`.
- Hash `#contact-us` on load → `active = 6`.
- `-first` class on first section; `<html>` gets/removes class `dark`.
- Jumper + Cursor hide on first section (mouse-fix logic).
- Wheel handlers use `customwheel` events; `detectSwipe` for touch; disabled during transition.
- On resize: sections re-layout; `updateActive` re-applies classes.

## useTransform (scroll-driven animation engine)
`useTransform({ onChange, onResize }, { id, parent, target })` — registers a renderer callback with `delay`-scheduled handler; callbacks receive `{ wheel }` (cumulative wheel delta since section became active). Used by:
- Main: `scale` transform — section scales 0.8→1 (desktop) / 1→0.89 (mobile ≤576); inner wrapper scales 1.5→1; text translates X -200→0 and 200→0.
- About: `horizontalScroll` — translateX of the cards track as wheel accumulates.
- WhatCreate: `horizontalScroll` + `Animate` (Interface) — full timeline, see below.
- Designers: `sticky` transform — section pinned while timeline runs.
- Portfolio: `sticky` + timeline.
- Startups: `sticky` + timeline (fill/blur/logo moves + FrameByFrame).
- RequestForm: section stays until form; cards/inputs stagger-in with `tr-N` classes.

## WhatCreate Interface timeline (Animate.js + timeline.js)
Driven by cumulative wheel over the horizontal scroll `dist = sliderWidth - innerWidth`.
Keyed times: START(0), A=innerWidth, B=A+1, C=2×innerWidth, D..I = C + delta*k (delta=(dist-2w)/7), END=dist.
1. START→A: interface scales up from 3rd-of-screen to "fit screen" scale (944/214, 707/142 ratios), tag1 fades in.
2. A→B: interface opacity →1.
3. B→C: zoom-out to scale 1 centered; tag2 in, tag1 out.
4. C→E: stage1 visible (desktop UI parts) with tag3; cursors fly along edges (6 positions, window-relative).
5. E→G: stage2; G→H desktopEl fades out.
6. G→END: mode animates desktop→mobile: width desktopWidth→mobileWidth (×0.35169492), x shifts by -(desktop-mobile)/2; title/row translate x1, logo x2, tasks/slot x3,y3 (innerOffset 0.08474×desktop); grid opacity→1 at I; stage3 in at END; tag4 in.
Applied via direct `style` mutations (container transform, tagContainer cssText with transition, etc.).

## Portfolio
- `sticky` section; line-draw SVG stroke-dashoffset animation; cube rotation via CSS animation.
- Canvas (canvas2d preset): 30 particles (8 if <600px) rising, colors #7398FF/#F4CE72/#BD99CA, velocity 3-8, r 3-6; active only when section PORTFOLIO active.
- Swiper slider: pagination + slides with poster images; slide → scroll to next region (FOLLOWED); "few people" quote block with scroll-driven progress.
- hand.mp4 plays on view.

## Startups
- `sticky`; FrameByFrame canvas: 47 frames rope_001..047.webp preloaded as Image()s, drawFrame(active) on scroll; canvas resizes with DPR.
- Logo: infinite.webp marquee fill animation; blur.webp sized by timeline; logo translate via timeline; Spelling + RandomSpelling words.

## Cursor
- Custom cursor overlay (dot + trailing ring). `useStickToMouse` keeps `.hover` span stuck to mouse for button micro-interactions. Burger sets `mouse.fix` (cursor pinned to burger center) when hovered.
- Styles via `cursorStyles`: DEFAULT, HOVER_NAV (scale), HOVER_BUTTON, HIDDEN.

## i18n
- `$t(path)` resolves dot-path against the content JSON; used by Header, Menu, all sections. Keep API identical.

## Video component
- `autoplay muted loop playsInline`; first user interaction (click/touchstart `{once:true}`) triggers play; poster fallback; `preload="metadata"`.

## Form
- react-hook-form; honeypot input; on submit: sends via `sendForm` (mock in clone: 1s latency → success cb); success → Modal opens; loading class `-loading` on SubmitButton; invalid inputs get `invalid` class.

## FixedControls
- Telegram https://t.me/qclay, WhatsApp https://wa.me/971502685455, Calendly https://calendly.com/qclay.

## Known source quirks (preserved deliberately)
- TalkButton poster `/video/contact/character-poster.web` (typo; real file .webp) — fix to .webp.
- animation.js `console.log` on generate — remove in port (noise).
- Form honeypot inline styles (absolute off-screen).
- Swiper pagination class must match compiled CSS (`swiper-pagination-bullet`s).
