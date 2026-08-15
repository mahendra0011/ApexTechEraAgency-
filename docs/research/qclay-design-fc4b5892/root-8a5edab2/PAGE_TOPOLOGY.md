# PAGE_TOPOLOGY — qclay.design `/`

Original app: CRA SPA, routes: `/` (only clone scope), `/terms`, `/x`, `/blog/:id`. All below is the `/` page.

## Document tree
```
<html class="dark">            (Sections sets dark class when not -first)
<body>
  <App>
    <Controller>            fullpage scroller (screens.MAIN..REQUESTFORM)
      <Sections/>           8 stacked section wrappers + hash handling
      <Header/>             fixed, transparent → filled on scroll
        <TalkButton/>       Let's Talk! avatar button (poster typo: character-poster.web → actual .webp)
        <Burger/>           open/close label + 2 lines
        <Menu/>             overlay: 4 links w/ hover videos (colors #282643/#E3F6F5/#B9E8E8/#2A6A8D)
          <AnimateLink/>
      <Main/>                s1 — hero (scale parallax, Vimeo reel, Clutch badge, Eye)
      <About/>              s2 — horizontal scroll, 3 video Cards
      <Create/>             s3 — "what we create" text rows + land video
      <WhatCreate/>         s4 — horizontal scroll + interface scroll composition
      <Designers/>          s5 — sticky timeline, avatars, PortfolioCircle
      <Portfolio/>          s6 — hand video, line draw, cube, canvas, Swiper(9)
      <Startups/>           s7 — sticky FrameByFrame canvas + logo fill
      <RequestForm/>        s8 — form + footer
        <Form/>             react-hook-form, ChoiceInputs, SubmitButton
    <Modal/>                global modal portal (success "We received your request!")
    <Jumper/>               fixed right-side dot navigation
    <FixedControls/>        Telegram / WhatsApp / Calendly (left+right bars)
    <Cursor/>               custom cursor (global)
  </App>
```

## Section stack (Controller order)
`screens = { MAIN:0, ABOUT:1, CREATE:2, WHATCREATE:3, DESIGNERS:4, PORTFOLIO:5, FOLLOWED:6, STARTUPS:7, REQUESTFORM:8 }`
- FOLLOWED is a wrapper section (the "we're followed by 150k designers" marquee lives inside Portfolio.js region) — see BEHAVIORS.
- `#contact-us` hash → initial active section 6 (REQUESTFORM).

## Controller DOM contract (used by CSS, keep exact)
- `.sections` wrapper; each section `section.section[data-section-key]` gets classes:
  `-prev`, `-active`, `-next` (positioning), and `-global-<key>` (global id class).
- First section additionally `-first`; Sections adds `dark` on `<html>` when not on first section.

## Component inventory (all files ported 1:1)
Infra: Controller/{Controller,Sections,detector/detector,detectWheel,detectSwipe}, Controller/utils/{context,state,scroll,swipe}, Controller/hooks/useTransform/{index,utils}+transforms/{scale,horizontalScroll,sticky,translateX}, Animator/js/{renderer,coords/index,easing,tween,itl}, Animator/js/react/hooks/useMouse/useStickToMouse, Animator/js/presets/canvas2d, i18n/i18n, api/{getProjects,submit}, utils.js, context/breakpointsContext.
Shared: Header/Header, Menu/Menu+AnimateLink, Cursor/{Cursor,CursorWraper,mouse}, Modal/Modal, Jumper/Jumper, FixedControls/fixed-controls, Clutch/index.jsx, PortfolioCircle/PortfolioCircle, Spelling/Spelling, RandomSpelling/RandomSpelling, UI/{Burger,Card,ChoiceInput,Eye,Icon,Input,SocialItem,SubmitButton,TalkButton,UnderLink,Video}.
Page: Home/Home, constants.js, Main/{Main,Eye?,Vimeo,VimeoPreview}, About/About, Create/Create, WhatCreate/WhatCreate + Interface/{Interface,Animate,timeline}, Designers/Designers + timeline.js, Portfolio/{Portfolio,Canvas/Canvas,Canvas/animation,components/Slider/Slider,components/FewPeople/FewPeople} + timeline.js, Startups/Startups + FrameByFrame/{FrameByFrame,canvas,frames} + timeline.js, RequestForm/RequestForm + components/{FormBlock,Form/Form}, Preview svg.

## Global chrome
- FixedControls: left bar: telegram (https://t.me/qclay), WhatsApp (https://wa.me/971502685455), calendar (https://calendly.com/qclay); right bar: socials (behance/dribble/instagram/tiktok SVG).
- Jumper: 9 dots, active = current section, click → `externalChange` to target index.
- Modal: fixed overlay + centered card; activated from Form submit success; close btn + X.
- Cursor: two-element cursor (dot + ring), HOVER_NAV / HOVER_BUTTON / DEFAULT / HIDDEN styles, `mouse.fix` for burger sticky.

## Footer (inside RequestForm region)
Clutch rating (5.0, 24 reviews), dribbble-badge, copyright links (Terms/Dribbble/Behance), top-agency images, menu repeat, socials.
