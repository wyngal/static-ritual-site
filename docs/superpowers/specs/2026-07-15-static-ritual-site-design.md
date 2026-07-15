# Static Ritual — Site Design Spec

**Date:** 2026-07-15
**Status:** Approved pending final user review

## Overview

A single-page marketing site for **Static Ritual**, a live audio production company. It is a grainy, glitchy variation of a Nexform-style hero site: full-bleed background video, minimal editorial typography, plus a real-time WebGL film-grain/glitch layer over the whole page. The site presents the DJ roster (featured: CR//SPY), the production rig, the vibe, the story, and a booking contact.

## Decisions Log

| Decision | Choice |
|---|---|
| Page structure | Single scrolling page with anchor-linked sections; no router |
| Glitch intensity | Medium — persistent grain + scanlines + periodic glitch bursts + element-level RGB-split; readable |
| Glitch implementation | **Option B**: hand-rolled WebGL overlay canvas (no three.js) + CSS keyframes for element-level effects |
| Media | Placeholders with easy swap via one data file; CR//SPY uses a real photo |
| DJ roster | CR//SPY featured (real photo) + 5 styled placeholder DJs |
| Contact | Booking info + socials (mailto), no form backend |
| Blog | Out of scope for v1 entirely |
| Hero slides | Keep 3-slide rotating carousel; production/16,000W slide leads |

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS v3 (config extended per hero spec: `fontFamily.geist`, `animation['spin-slow']`)
- Lucide React (icons: `Menu`, `X`, plus SoundCloud/social glyphs as appropriate)
- Google Fonts **Geist** 300–700 via `https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap`
- Body: `'Geist', -apple-system, BlinkMacSystemFont, sans-serif`, antialiased smoothing
- No other runtime dependencies

## Project Structure

```
src/
  components/
    GlitchCanvas.tsx    WebGL grain/glitch engine (full-viewport overlay)
    GlitchText.tsx      RGB-split treatment for headings
    GlitchImage.tsx     images w/ duotone-placeholder + hover-glitch treatment
    Nav.tsx             fixed top bar + full-screen mobile menu
    Hero.tsx            full-screen hero (adapted Nexform spec)
    DJGrid.tsx          bento roster grid
    Experience.tsx      rig + vibe
    About.tsx           story + pull quote
    Contact.tsx         booking section, doubles as page footer
  data/content.ts       ALL copy, roster, gear, links — single edit point
  index.css             @tailwind directives + universal reset (margin/padding 0, border-box)
  App.tsx  main.tsx
public/
  media/                served assets (crspy.png copied here)
Media/Photos/           user's drop zone for originals (not served)
```

Asset flow: originals live in `Media/Photos/`; the site serves copies from `public/media/`; `content.ts` holds only paths. CR//SPY photo: `Media/Photos/Screenshot_20260715-062117.png` → `public/media/crspy.png`.

## Glitch Engine

### GlitchCanvas (WebGL overlay)

A fixed, full-viewport, `pointer-events-none` canvas layered above all content, running a fragment shader on a fullscreen triangle. It **adds** effects on top of the page; it cannot displace DOM pixels beneath it (that is handled per-element by CSS — see below).

Shader output (medium intensity):

1. **Living film grain** — per-frame animated hash noise. Canvas uses `mix-blend-mode: overlay` so grain darkens shadows and lifts highlights like film rather than sitting on top like fog.
2. **Scanlines** — faint horizontal line field with slow vertical drift.
3. **Glitch bursts** — every 4–9 s (randomized), lasting 150–400 ms: translucent horizontal tear-bands with RGB-offset edges plus a brief brightness flicker.

Performance and fallbacks:

- Canvas renders at device-pixel-ratio **1** (grain needs no retina; 4× less fill).
- `requestAnimationFrame` loop pauses on `visibilitychange` (hidden tab).
- `prefers-reduced-motion`: static grain frame, no bursts, no scanline drift.
- WebGL unavailable → replace canvas with a tiled static noise-PNG overlay div.
- `webglcontextlost` → prevent default, attempt one silent restore on `webglcontextrestored`; if restore fails, fall back to the noise-PNG overlay.

### GlitchText (CSS)

Headings render with layered pseudo-elements: red/cyan offset ghosts revealed via clip-path slice keyframes. Fires on hover and on an occasional randomized ambient trigger. Under reduced motion: no animation, plain text.

### GlitchImage (CSS)

Wraps images: subtle duotone/contrast treatment at rest; on hover, horizontal slice-shift jitter + chromatic offset. When `image` is `null`, renders a styled duotone gradient placeholder tile instead — a missing/bad path can never break the layout.

## Page Sections (top to bottom)

### Nav (fixed top)

Per the Nexform hero spec, rebranded:

- **Logo (left):** "Static Ritual" with superscript `°` (`text-[10px] align-super ml-0.5`).
- **Links (center, desktop only):** "DJs—", "Experience", "About" — smooth-scroll anchor links, `text-sm font-light tracking-wide hover:opacity-70`.
- **Menu button (right):** circular `border-white/30` button, Lucide `Menu` size 15.
- **Mobile menu:** full-screen overlay per spec (`bg-black/90 backdrop-blur-xl`, staggered link entrance at `150 + i*75 ms`, body scroll locked while open). Links: DJs, Experience, About, Contact, SoundCloud (external). Footer of menu: `nikshokur@gmail.com`.

### Hero (`h-screen`, full Nexform spec adapted)

- Background: the CloudFront video (`hf_20260702_135039_….mp4`), `autoPlay muted loop playsInline`, `object-cover`, **no overlay/darkening** — the GlitchCanvas grain sits above it globally.
- **Rotating badge** (desktop only): frosted circle, 20 s spin, circular text **"SOUND • LIGHTS • VISUALS • RITUAL •"** (fill-white/80, size 10, weight 300, letterSpacing 3).
- **Carousel:** 3 slides, auto-rotate 5 s, crossfade + translate-y transition (`duration-700`, cubic-bezier(0.22,1,0.36,1)), pagination dots that jump + reset the timer. Heading/CTA classes per original spec. Headings render through GlitchText. Underlined phrase per slide uses `underline underline-offset-4 decoration-white/60`.

| # | Heading | Underlined phrase | CTA → anchor |
|---|---|---|---|
| 1 | "Full-stack event production — 16,000W of QSC sound, lights, and reactive visuals for rooms that want to move." | 16,000W of QSC sound | "The Experience—" → `#experience` |
| 2 | "High-energy, euphoric mixes of dnb, techhouse, and UK bass — live audio production for the underground music community." | dnb, techhouse, and UK bass | "Meet the DJs—" → `#djs` |
| 3 | "A dedicated crew that shows out every show — bringing back the underground, one ritual at a time." | bringing back the underground | "Book a Ritual—" → `#contact` |

- **Bottom strip:** column markers "SR / 33⅓ / HZ" (`text-white/50 text-[10px]`); footer info row (`border-t border-white/10`): left = short company description paragraph (`text-white/40`, underlined key phrase `decoration-white/30`), right = "LIVE AUDIO PRODUCTION" / "STATIC RITUAL" uppercase tracking-wider.

### DJ Bento Grid (`#djs`)

- Section header: "THE ROSTER" in large GlitchText.
- 4-column bento grid (`grid-cols-4` desktop → 2 tablet → 1 mobile).
- **CR//SPY: 2×2 featured tile** — `public/media/crspy.png` via GlitchImage, name in large type, "FEATURED" tag, genre line "dnb / dubstep / trap", SoundCloud icon-link → `https://soundcloud.com/nikitashokur`.
- **5 placeholder DJs** on 1×1 and 2×1 tiles with duotone gradient placeholders (`image: null`): VOLT//AGE, NULL SIGNAL, LOW THEORY, GHOST FREQ, RED SHIFT — names/genres editable in `content.ts` only.
- Tiles hover-glitch via GlitchImage.

### Experience (`#experience`)

Two halves:

- **The Rig** — spec-sheet readout style (small caps, mono-flavored, `text-white/50`):
  - 4× QSC K12.2 (2,000 W each)
  - 2× QSC KS118 18" subs (4,000 W each)
  - Lighting rig
  - Live reactive visuals
  - Pull stat in huge glitch type: **"16,000 WATTS OF INTENT"** (4×2,000 + 2×4,000 = 16,000 W).
- **The Vibe** — genre wall of large glitch-flickering tags: DNB / TECH HOUSE / TRAP / DUBSTEP / UK BASS / REGGAE / TECHNO. Below it, a line noting professional photography & videography coverage of every event.

### About (`#about`)

Pure text, editorial, no images. Paragraph built on: *"Static Ritual was founded by a group of friends with deep roots in the music industry."* — crew, community, bringing back the underground. Pull quote in big GlitchText: **"This is how we think it should be done."**

### Contact (`#contact`, last; doubles as page footer)

- "BOOK A RITUAL" — largest type on the page, GlitchText.
- `mailto:nikshokur@gmail.com` styled like the hero CTA.
- SoundCloud → `https://soundcloud.com/nikitashokur`; Instagram shown as placeholder handle `@static.ritual` (marked in `content.ts` as placeholder until the real handle is supplied).
- Closing marquee strip: "STATIC RITUAL — " repeating, occasional glitch flicker (static under reduced motion).
- Fine print: © year, "Live Audio Production".

## Data Model (`src/data/content.ts`)

Typed and exported; the only file edited for content changes:

```ts
heroSlides: { text: string; underline: string; cta: string; target: string }[]
djs: { name: string; genres: string[]; image: string | null;
      soundcloud?: string; featured?: boolean; size: 'featured' | 'wide' | 'square' }[]
rig: { items: { label: string; detail: string }[]; pullStat: string }
genres: string[]
about: { paragraph: string; pullQuote: string }
contact: { email: string; soundcloud: string; instagram: string; instagramIsPlaceholder: boolean }
```

## Error Handling / Resilience

- **Video fails/slow:** hero section background is solid black; grain canvas keeps running → degrades to "dark + film grain". No poster frame by design.
- **WebGL unavailable / context lost:** static noise-PNG overlay fallback (see Glitch Engine).
- **Missing DJ image:** duotone placeholder renders automatically.
- **Reduced motion:** carousel keeps rotating with simple fades; glitch bursts, ambient text glitches, and marquee stop; grain goes static.

## Verification

1. `npm run build` and `tsc --noEmit` pass clean.
2. Browser pass: video autoplays muted; carousel rotates every 5 s and dots reset the timer; nav anchors smooth-scroll from desktop nav and mobile menu; mailto opens with `nikshokur@gmail.com`; SoundCloud opens `soundcloud.com/nikitashokur`; grain visibly animates; CR//SPY tile hover triggers slice glitch.
3. Mobile viewport check at 390 px width (primary audience device).

## Out of Scope (v1)

- Blog (entirely omitted; single-page structure makes it a future standalone addition)
- Contact form backend
- Real photos/names for the 5 placeholder DJs (data-file swap later)
- Real Instagram handle (placeholder until supplied)
