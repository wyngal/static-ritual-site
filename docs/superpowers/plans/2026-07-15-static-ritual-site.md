# Static Ritual Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Static Ritual single-page site — full-screen video hero, DJ bento grid, experience, about, and contact sections, all under a real-time WebGL film-grain/glitch overlay — per the approved spec at `docs/superpowers/specs/2026-07-15-static-ritual-site-design.md`.

**Architecture:** Vite + React 18 + TypeScript single-page app (no router). A fixed, click-through WebGL canvas (`GlitchCanvas`) renders living grain/scanlines/glitch bursts above all content; element-level RGB-split effects are CSS (`GlitchText`, `GlitchImage`). All copy and data live in one file (`src/data/content.ts`).

**Tech Stack:** Vite 5, React 18, TypeScript (strict), Tailwind CSS **v3**, Lucide React, Vitest + Testing Library (jsdom), raw WebGL (no three.js).

## Model Tier Assignments

The orchestrator (Fable, main session) dispatches one subagent per task with the `model` parameter below. Fable reviews between tasks.

| Task | Model | Why |
|---|---|---|
| 1 Scaffold | haiku | mechanical file creation |
| 2 Content data | haiku | data entry against fixed types |
| 3 UI primitives | sonnet | standard components + CSS |
| 4 GlitchCanvas | **opus** | raw WebGL, fallbacks, lifecycle |
| 5 Nav | sonnet | standard component |
| 6 Hero | **opus** | most spec-dense component, timers |
| 7 DJ grid | sonnet | standard component |
| 8 Experience + About | sonnet | standard components |
| 9 Contact | sonnet | standard component |
| 10 App assembly | sonnet | composition + IntersectionObserver |
| 11 SEO/meta/favicon | haiku | mechanical head edits |
| 12 Final verification | **opus** | whole-site scrutiny |

## Global Constraints

- Runtime dependencies ONLY: `react`, `react-dom`, `lucide-react`. Everything else is a devDependency.
- Tailwind CSS **v3** (`tailwindcss@^3.4`) — NOT v4; config/`@tailwind` directives assume v3.
- Font: Geist via exactly `https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap`.
- Body font stack: `'Geist', -apple-system, BlinkMacSystemFont, sans-serif`; antialiased smoothing.
- Brand renders as `Static Ritual` with superscript `°`.
- Booking email: `nikshokur@gmail.com`. SoundCloud: `https://soundcloud.com/nikitashokur`. Instagram `@static.ritual` is a PLACEHOLDER — render as a span, never a link.
- Wattage: 16,000 W total (4× K12.2 @ 2,000 W + 2× KS118 @ 4,000 W). Pull stat text: `16,000 WATTS OF INTENT`.
- Single page. Section ids exactly: `djs`, `experience`, `about`, `contact`.
- Z-order: nav `z-40` < mobile menu `z-50` < GlitchCanvas `z-[100]` (fixed, `pointer-events-none`, `mix-blend-overlay`, DPR 1).
- Em-dashes (`—`) in copy; bullets (`•`) in the badge ring text.
- All copy/data lives in `src/data/content.ts` — components never hardcode copy.
- Reduced motion: no glitch animation, static grain, carousel still rotates.
- Hero video URL: `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_135039_b04d00db-6ee2-4e2a-a7f5-b2dfd3d24fd2.mp4` — `autoPlay muted loop playsInline`, `object-cover`, no overlay.
- Commit after every task. Working directory is the repo root (`StaticRitualSite`).
- Test commands run with `npx vitest run <file>` for single files; `npm test` for the suite.

---

### Task 1: Scaffold the project

**Model tier:** haiku

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `postcss.config.js`, `tailwind.config.js`, `index.html`, `.gitignore`, `src/index.css`, `src/main.tsx`, `src/App.tsx`, `src/test/setup.ts`
- Create: `public/media/crspy.png` (copied from `Media/Photos/Screenshot_20260715-062117.png`)

**Interfaces:**
- Consumes: nothing (first task)
- Produces: a building Vite app; `font-geist` and `animate-spin-slow` Tailwind utilities; Vitest configured with jsdom + `src/test/setup.ts` (mocks `matchMedia` and `IntersectionObserver`, the latter exposing `instances` for tests); scripts `dev`, `build`, `preview`, `test`, `typecheck`.

Note: the repo root already contains `docs/`, `Media/`, and `.git` — that is why we scaffold by writing files directly instead of `npm create vite` (which balks at non-empty directories and prompts interactively).

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "static-ritual-site",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "lucide-react": "^0.460.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.6",
    "@testing-library/react": "^16.0.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "jsdom": "^24.1.0",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6",
    "typescript": "^5.5.3",
    "vite": "^5.4.0",
    "vitest": "^2.0.4"
  }
}
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "noEmit": true,
    "types": ["vite/client"]
  },
  "include": ["src", "vite.config.ts"]
}
```

- [ ] **Step 3: Write `vite.config.ts`** (uses `vitest/config` so the `test` block typechecks)

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

- [ ] **Step 4: Write `postcss.config.js` and `tailwind.config.js`**

```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        geist: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: Write `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Static Ritual — Live Audio Production</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Write `src/index.css`** (reset + body font + smooth scroll; glitch CSS arrives in Task 3)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #000;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 7: Write `src/main.tsx` and placeholder `src/App.tsx`**

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

```tsx
// src/App.tsx — placeholder, replaced in Task 10
export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-geist flex items-center justify-center">
      STATIC RITUAL
    </div>
  )
}
```

- [ ] **Step 8: Write `src/test/setup.ts`** (jsdom lacks `matchMedia` and `IntersectionObserver`)

```ts
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(cleanup)

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
})

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []
  callback: IntersectionObserverCallback
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}
;(globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
  MockIntersectionObserver
```

- [ ] **Step 9: Write `.gitignore`**

```
node_modules
dist
```

- [ ] **Step 10: Copy the CR//SPY photo into the served folder**

Run: `mkdir -p public/media && cp "Media/Photos/Screenshot_20260715-062117.png" public/media/crspy.png`
Expected: `public/media/crspy.png` exists.

- [ ] **Step 11: Install and verify build**

Run: `npm install`
Expected: completes without errors ("added N packages").

Run: `npm run build`
Expected: `tsc` silent, Vite writes `dist/` ("✓ built in …").

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TS + Tailwind v3 + Vitest, add CR//SPY media"
```

---

### Task 2: Content data model (`content.ts`)

**Model tier:** haiku

**Files:**
- Create: `src/data/content.ts`
- Test: `src/data/content.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces (exact exports every later task imports from `../data/content`):
  - `interface HeroSlide { text: string; underline: string; cta: string; target: string }` — `heroSlides: HeroSlide[]`
  - `interface HeroFooter { before: string; underline: string; after: string; secondLine: string; markers: [string, string, string]; rightLines: [string, string] }` — `heroFooter: HeroFooter`
  - `type TileSize = 'featured' | 'wide' | 'square'`
  - `interface DJ { name: string; genres: string[]; image: string | null; soundcloud?: string; featured?: boolean; size: TileSize }` — `djs: DJ[]`
  - `interface RigItem { label: string; detail: string; watts: number }`, `interface Rig { items: RigItem[]; pullStat: string }` — `rig: Rig`
  - `genres: string[]`
  - `interface About { paragraph: string; pullQuote: string }` — `about: About`
  - `interface Contact { email: string; soundcloud: string; instagram: string; instagramIsPlaceholder: boolean }` — `contact: Contact`
  - `interface NavLink { label: string; target: string }` — `navLinks: NavLink[]`
  - `interface MenuLink { label: string; target?: string; href?: string }` — `menuLinks: MenuLink[]`

- [ ] **Step 1: Write the failing test — `src/data/content.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { heroSlides, djs, rig, genres, about, contact } from './content'

describe('content data', () => {
  it('has three hero slides whose underline phrase appears in the text', () => {
    expect(heroSlides).toHaveLength(3)
    for (const s of heroSlides) {
      expect(s.text).toContain(s.underline)
      expect(s.target).toMatch(/^#(djs|experience|about|contact)$/)
    }
  })

  it('leads with the 16,000W production slide', () => {
    expect(heroSlides[0].underline).toBe('16,000W of QSC sound')
  })

  it('rig wattage totals 16,000', () => {
    expect(rig.items.reduce((sum, i) => sum + i.watts, 0)).toBe(16000)
    expect(rig.pullStat).toBe('16,000 WATTS OF INTENT')
  })

  it('features exactly CR//SPY with the real photo and SoundCloud link', () => {
    const featured = djs.filter((d) => d.featured)
    expect(featured).toHaveLength(1)
    expect(featured[0].name).toBe('CR//SPY')
    expect(featured[0].image).toBe('/media/crspy.png')
    expect(featured[0].soundcloud).toBe('https://soundcloud.com/nikitashokur')
    expect(djs.filter((d) => d.image === null)).toHaveLength(5)
  })

  it('lists all seven genres', () => {
    expect(genres).toEqual(['DNB', 'TECH HOUSE', 'TRAP', 'DUBSTEP', 'UK BASS', 'REGGAE', 'TECHNO'])
  })

  it('books to the right email and keeps Instagram a placeholder', () => {
    expect(contact.email).toBe('nikshokur@gmail.com')
    expect(contact.instagramIsPlaceholder).toBe(true)
    expect(about.pullQuote).toBe('This is how we think it should be done.')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/content.test.ts`
Expected: FAIL — "Failed to load … content" (module does not exist).

- [ ] **Step 3: Write `src/data/content.ts`**

```ts
export interface HeroSlide {
  text: string
  underline: string
  cta: string
  target: string
}

export interface HeroFooter {
  before: string
  underline: string
  after: string
  secondLine: string
  markers: [string, string, string]
  rightLines: [string, string]
}

export type TileSize = 'featured' | 'wide' | 'square'

export interface DJ {
  name: string
  genres: string[]
  image: string | null
  soundcloud?: string
  featured?: boolean
  size: TileSize
}

export interface RigItem {
  label: string
  detail: string
  watts: number
}

export interface Rig {
  items: RigItem[]
  pullStat: string
}

export interface About {
  paragraph: string
  pullQuote: string
}

export interface Contact {
  email: string
  soundcloud: string
  instagram: string
  instagramIsPlaceholder: boolean
}

export interface NavLink {
  label: string
  target: string
}

export interface MenuLink {
  label: string
  target?: string
  href?: string
}

export const heroSlides: HeroSlide[] = [
  {
    text: 'Full-stack event production — 16,000W of QSC sound, lights, and reactive visuals for rooms that want to move.',
    underline: '16,000W of QSC sound',
    cta: 'The Experience—',
    target: '#experience',
  },
  {
    text: 'High-energy, euphoric mixes of dnb, techhouse, and UK bass — live audio production for the underground music community.',
    underline: 'dnb, techhouse, and UK bass',
    cta: 'Meet the DJs—',
    target: '#djs',
  },
  {
    text: 'A dedicated crew that shows out every show — bringing back the underground, one ritual at a time.',
    underline: 'bringing back the underground',
    cta: 'Book a Ritual—',
    target: '#contact',
  },
]

export const heroFooter: HeroFooter = {
  before: 'Full-stack live audio production for the underground — ',
  underline: 'sound, lights, and visuals',
  after: ', with professional photo and video of every ritual.',
  secondLine: 'High-energy nights. A crowd that shows out. Zero compromise.',
  markers: ['SR', '33⅓', 'HZ'],
  rightLines: ['Live Audio Production', 'Static Ritual'],
}

export const djs: DJ[] = [
  {
    name: 'CR//SPY',
    genres: ['dnb', 'dubstep', 'trap'],
    image: '/media/crspy.png',
    soundcloud: 'https://soundcloud.com/nikitashokur',
    featured: true,
    size: 'featured',
  },
  { name: 'VOLT//AGE', genres: ['tech house', 'techno'], image: null, size: 'wide' },
  { name: 'NULL SIGNAL', genres: ['dubstep', 'uk bass'], image: null, size: 'square' },
  { name: 'LOW THEORY', genres: ['dnb', 'jungle'], image: null, size: 'square' },
  { name: 'GHOST FREQ', genres: ['trap', 'uk bass'], image: null, size: 'wide' },
  { name: 'RED SHIFT', genres: ['reggae', 'dub'], image: null, size: 'wide' },
]

export const rig: Rig = {
  items: [
    { label: '4× QSC K12.2 tops', detail: '2,000 W each', watts: 8000 },
    { label: '2× QSC KS118 18″ subs', detail: '4,000 W each', watts: 8000 },
    { label: 'Lighting rig', detail: 'beams / wash / strobe', watts: 0 },
    { label: 'Live visuals', detail: 'reactive projection', watts: 0 },
  ],
  pullStat: '16,000 WATTS OF INTENT',
}

export const genres: string[] = [
  'DNB',
  'TECH HOUSE',
  'TRAP',
  'DUBSTEP',
  'UK BASS',
  'REGGAE',
  'TECHNO',
]

export const about: About = {
  paragraph:
    "Static Ritual was founded by a group of friends with deep roots in the music industry. We run high-energy, euphoric nights across dnb, tech house, trap, dubstep, UK bass, reggae, and techno — with our own sound, lights, visuals, and a dedicated crew that shows out at every single show. We're here for a great time, and we're here to bring back the underground music community.",
  pullQuote: 'This is how we think it should be done.',
}

export const contact: Contact = {
  email: 'nikshokur@gmail.com',
  soundcloud: 'https://soundcloud.com/nikitashokur',
  instagram: '@static.ritual',
  instagramIsPlaceholder: true,
}

export const navLinks: NavLink[] = [
  { label: 'DJs—', target: '#djs' },
  { label: 'Experience', target: '#experience' },
  { label: 'About', target: '#about' },
]

export const menuLinks: MenuLink[] = [
  { label: 'DJs', target: '#djs' },
  { label: 'Experience', target: '#experience' },
  { label: 'About', target: '#about' },
  { label: 'Contact', target: '#contact' },
  { label: 'SoundCloud', href: 'https://soundcloud.com/nikitashokur' },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/content.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/content.ts src/data/content.test.ts
git commit -m "feat: add typed content data model with all site copy"
```

---

### Task 3: UI primitives — GlitchText, GlitchImage, Section, icons

**Model tier:** sonnet

**Files:**
- Create: `src/components/GlitchText.tsx`, `src/components/GlitchImage.tsx`, `src/components/Section.tsx`, `src/components/icons.tsx`
- Modify: `src/index.css` (append glitch CSS)
- Test: `src/components/primitives.test.tsx`

**Interfaces:**
- Consumes: `src/test/setup.ts` mocks from Task 1.
- Produces:
  - `GlitchText({ text: string; children?: ReactNode; className?: string; ambient?: boolean })` — renders `<span class="glitch-text" data-text={text}>`; visible content is `children ?? text`; magenta/cyan ghost slices on hover; when `ambient`, also self-triggers every 4–9 s for 300 ms (disabled under reduced motion).
  - `GlitchImage({ src: string | null; alt: string; className?: string })` — `<img>` (grayscale, high contrast) with hover slice ghosts when `src` set; duotone placeholder `<div data-testid="dj-placeholder">` when `src` is null or the image errors. Hover effects key off a parent `.group`.
  - `Section({ id: string; className?: string; children: ReactNode })` — `<section id>` that starts `opacity-0 translate-y-6` and reveals via IntersectionObserver (immediate under reduced motion).
  - `SoundCloudIcon({ size?: number })` — inline SVG glyph (Lucide has no SoundCloud icon).

- [ ] **Step 1: Write the failing test — `src/components/primitives.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import GlitchText from './GlitchText'
import GlitchImage from './GlitchImage'
import Section from './Section'

type MockIO = {
  instances: Array<{
    callback: (entries: Array<{ isIntersecting: boolean; target: Element }>, io: unknown) => void
  }>
}

describe('GlitchText', () => {
  it('exposes ghost copies via data-text and renders its text', () => {
    render(<GlitchText text="THE ROSTER" />)
    const el = screen.getByText('THE ROSTER')
    expect(el).toHaveAttribute('data-text', 'THE ROSTER')
    expect(el.className).toContain('glitch-text')
  })

  it('renders rich children while keeping plain data-text', () => {
    render(
      <GlitchText text="A B C">
        <em>rich</em>
      </GlitchText>,
    )
    expect(screen.getByText('rich')).toBeInTheDocument()
  })
})

describe('GlitchImage', () => {
  it('renders a duotone placeholder when src is null', () => {
    render(<GlitchImage src={null} alt="VOLT//AGE" />)
    expect(screen.getByTestId('dj-placeholder')).toBeInTheDocument()
  })

  it('renders the image when src is provided', () => {
    render(<GlitchImage src="/media/crspy.png" alt="CR//SPY" />)
    expect(screen.getByAltText('CR//SPY')).toBeInTheDocument()
  })
})

describe('Section', () => {
  it('reveals once its element intersects', () => {
    render(<Section id="about">hello</Section>)
    const section = document.getElementById('about')!
    expect(section.className).toContain('opacity-0')
    const io = (globalThis.IntersectionObserver as unknown as MockIO).instances.at(-1)!
    act(() => {
      io.callback([{ isIntersecting: true, target: section }], io)
    })
    expect(section.className).toContain('opacity-100')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/primitives.test.tsx`
Expected: FAIL — cannot resolve `./GlitchText`.

- [ ] **Step 3: Write `src/components/GlitchText.tsx`**

```tsx
import { ReactNode, useEffect, useState } from 'react'

interface Props {
  text: string
  children?: ReactNode
  className?: string
  ambient?: boolean
}

export default function GlitchText({ text, children, className = '', ambient = false }: Props) {
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    if (!ambient || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let start = 0
    let stop = 0
    const schedule = () => {
      start = window.setTimeout(() => {
        setGlitching(true)
        stop = window.setTimeout(() => {
          setGlitching(false)
          schedule()
        }, 300)
      }, 4000 + Math.random() * 5000)
    }
    schedule()
    return () => {
      clearTimeout(start)
      clearTimeout(stop)
    }
  }, [ambient])

  return (
    <span data-text={text} className={`glitch-text ${glitching ? 'glitching' : ''} ${className}`}>
      {children ?? text}
    </span>
  )
}
```

- [ ] **Step 4: Write `src/components/GlitchImage.tsx`**

```tsx
import { useState } from 'react'

interface Props {
  src: string | null
  alt: string
  className?: string
}

export default function GlitchImage({ src, alt, className = '' }: Props) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return <div data-testid="dj-placeholder" aria-label={alt} className={`duotone-placeholder ${className}`} />
  }

  return (
    <div className={`glitch-image ${className}`}>
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
      />
      <img src={src} alt="" aria-hidden className="glitch-image-ghost ghost-a" />
      <img src={src} alt="" aria-hidden className="glitch-image-ghost ghost-b" />
    </div>
  )
}
```

- [ ] **Step 5: Write `src/components/Section.tsx`**

```tsx
import { ReactNode, useEffect, useRef, useState } from 'react'

interface Props {
  id: string
  className?: string
  children: ReactNode
}

export default function Section({ id, className = '', children }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
    >
      {children}
    </section>
  )
}
```

- [ ] **Step 6: Write `src/components/icons.tsx`**

```tsx
export function SoundCloudIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 17v-5h1.5v5H3zm3 0V9h1.5v8H6zm3 0V7h1.5v10H9zm3 0V5h1.5v12H12zm3.5 0c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5 2.7 0 4.94 2.05 5.22 4.68A3.5 3.5 0 0 1 19.5 17h-4z" />
    </svg>
  )
}
```

- [ ] **Step 7: Append glitch CSS to `src/index.css`**

```css
/* ---- glitch primitives ---- */
.glitch-text {
  position: relative;
  display: inline-block;
}
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  white-space: pre-wrap;
}
.glitch-text:hover::before,
.glitch-text.glitching::before {
  opacity: 0.7;
  color: #f0f;
  transform: translate(-2px, 1px);
  animation: glitch-slice-a 0.3s steps(3, end) infinite;
}
.glitch-text:hover::after,
.glitch-text.glitching::after {
  opacity: 0.7;
  color: #0ff;
  transform: translate(2px, -1px);
  animation: glitch-slice-b 0.3s steps(3, end) infinite;
}
@keyframes glitch-slice-a {
  0% { clip-path: inset(10% 0 80% 0); }
  33% { clip-path: inset(60% 0 10% 0); }
  66% { clip-path: inset(30% 0 45% 0); }
  100% { clip-path: inset(75% 0 5% 0); }
}
@keyframes glitch-slice-b {
  0% { clip-path: inset(70% 0 10% 0); }
  33% { clip-path: inset(20% 0 60% 0); }
  66% { clip-path: inset(50% 0 25% 0); }
  100% { clip-path: inset(5% 0 85% 0); }
}

.duotone-placeholder {
  background:
    linear-gradient(135deg, rgba(255, 0, 255, 0.12), rgba(0, 255, 255, 0.08)),
    linear-gradient(to bottom right, #27272a, #09090b);
}

.glitch-image {
  position: relative;
  overflow: hidden;
}
.glitch-image-ghost {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  pointer-events: none;
}
.group:hover .ghost-a {
  opacity: 0.5;
  transform: translateX(-4px);
  filter: grayscale(1) contrast(1.25) hue-rotate(300deg);
  animation: glitch-slice-a 0.4s steps(3, end) infinite;
}
.group:hover .ghost-b {
  opacity: 0.5;
  transform: translateX(4px);
  filter: grayscale(1) contrast(1.25) hue-rotate(160deg);
  animation: glitch-slice-b 0.4s steps(3, end) infinite;
}

/* static grain fallback when WebGL is unavailable */
.grain-static {
  opacity: 0.3;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='128' height='128' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* contact marquee */
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.marquee-track {
  display: inline-block;
  animation: marquee 20s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .glitch-text::before,
  .glitch-text::after,
  .glitch-image-ghost {
    display: none;
  }
  .marquee-track {
    animation: none;
  }
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/components/primitives.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 9: Commit**

```bash
git add src/components/GlitchText.tsx src/components/GlitchImage.tsx src/components/Section.tsx src/components/icons.tsx src/index.css src/components/primitives.test.tsx
git commit -m "feat: add glitch UI primitives (GlitchText, GlitchImage, Section, icons)"
```

---

### Task 4: GlitchCanvas — WebGL grain/glitch engine

**Model tier:** opus

**Files:**
- Create: `src/components/GlitchCanvas.tsx`
- Test: `src/components/GlitchCanvas.test.tsx`

**Interfaces:**
- Consumes: `.grain-static` CSS class from Task 3.
- Produces: `GlitchCanvas()` — no props. Renders a fixed full-viewport `<canvas data-testid="grain-canvas">` at `z-[100]`, `pointer-events-none`, `mix-blend-overlay`; falls back to `<div data-testid="grain-fallback">` when WebGL is unavailable or restore fails.

Behavior requirements (from spec): grain centered on mid-gray (overlay blend neutral), scanlines with slow drift, bursts every 4–9 s lasting 150–400 ms, DPR fixed at 1, RAF paused on hidden tab, reduced motion renders a single static frame, context-lost gets one silent restore attempt then falls back.

- [ ] **Step 1: Write the failing test — `src/components/GlitchCanvas.test.tsx`** (jsdom has no WebGL, so the fallback path is the naturally testable one)

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import GlitchCanvas from './GlitchCanvas'

describe('GlitchCanvas', () => {
  it('falls back to static grain when WebGL is unavailable', () => {
    render(<GlitchCanvas />)
    expect(screen.getByTestId('grain-fallback')).toBeInTheDocument()
    expect(screen.queryByTestId('grain-canvas')).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/GlitchCanvas.test.tsx`
Expected: FAIL — cannot resolve `./GlitchCanvas`.

- [ ] **Step 3: Write `src/components/GlitchCanvas.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react'

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
precision mediump float;
uniform float u_time;
uniform vec2 u_res;
uniform float u_burst;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float t = u_time;

  // film grain centered on mid-gray: overlay blend treats 0.5 as neutral
  float g = hash(gl_FragCoord.xy + vec2(t * 61.7, t * 83.3));
  vec3 col = vec3(mix(0.5, g, 0.22));

  // scanlines with slow vertical drift
  col -= sin((gl_FragCoord.y + t * 18.0) * 1.6) * 0.02;

  // burst: horizontal tear bands with RGB-offset edges + brightness flicker
  if (u_burst > 0.0) {
    float band = floor(uv.y * 24.0 + t * 40.0);
    float r = hash(vec2(band, floor(t * 20.0)));
    if (r > 0.8) {
      float edge = fract(uv.y * 24.0);
      col.r += 0.25 * u_burst;
      col.b += 0.20 * u_burst * step(0.85, edge);
      col.g -= 0.10 * u_burst * step(edge, 0.15);
    }
    col += (hash(vec2(floor(t * 30.0), 7.0)) - 0.5) * 0.08 * u_burst;
  }

  gl_FragColor = vec4(col, 0.85);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)
  if (!sh) throw new Error('createShader failed')
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh) ?? 'shader compile failed')
  }
  return sh
}

export default function GlitchCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let cleanupGl = () => {}

    const init = (): boolean => {
      const gl = canvas.getContext('webgl', { alpha: true, antialias: false })
      if (!gl) return false
      let program: WebGLProgram | null
      try {
        program = gl.createProgram()
        if (!program) return false
        gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT))
        gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG))
        gl.linkProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false
      } catch {
        return false
      }
      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
      const aPos = gl.getAttribLocation(program, 'a_pos')
      gl.enableVertexAttribArray(aPos)
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
      const uTime = gl.getUniformLocation(program, 'u_time')
      const uRes = gl.getUniformLocation(program, 'u_res')
      const uBurst = gl.getUniformLocation(program, 'u_burst')

      const resize = () => {
        // DPR intentionally 1: grain needs no retina, 4x less fill
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        gl.viewport(0, 0, canvas.width, canvas.height)
      }
      resize()
      window.addEventListener('resize', resize)

      let burstUntil = 0
      let nextBurst = performance.now() + 4000 + Math.random() * 5000

      const draw = (now: number) => {
        if (now >= nextBurst) {
          burstUntil = now + 150 + Math.random() * 250
          nextBurst = now + 4000 + Math.random() * 5000
        }
        gl.uniform1f(uTime, now / 1000)
        gl.uniform2f(uRes, canvas.width, canvas.height)
        gl.uniform1f(uBurst, !reduced && now < burstUntil ? 1 : 0)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
        if (!reduced && !document.hidden) raf = requestAnimationFrame(draw)
      }
      raf = requestAnimationFrame(draw)

      const onVisibility = () => {
        cancelAnimationFrame(raf)
        if (!document.hidden && !reduced) raf = requestAnimationFrame(draw)
      }
      document.addEventListener('visibilitychange', onVisibility)

      cleanupGl = () => {
        window.removeEventListener('resize', resize)
        document.removeEventListener('visibilitychange', onVisibility)
        cancelAnimationFrame(raf)
      }
      return true
    }

    const onLost = (e: Event) => {
      e.preventDefault()
      cancelAnimationFrame(raf)
    }
    const onRestored = () => {
      cleanupGl()
      if (!init()) setFallback(true) // one silent restore attempt
    }
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)

    if (!init()) setFallback(true)

    return () => {
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      cleanupGl()
    }
  }, [])

  if (fallback) {
    return (
      <div
        data-testid="grain-fallback"
        aria-hidden
        className="grain-static pointer-events-none fixed inset-0 z-[100] mix-blend-overlay"
      />
    )
  }
  return (
    <canvas
      ref={ref}
      data-testid="grain-canvas"
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] mix-blend-overlay"
    />
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/GlitchCanvas.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/GlitchCanvas.tsx src/components/GlitchCanvas.test.tsx
git commit -m "feat: add WebGL film-grain/glitch overlay engine with static fallback"
```

---

### Task 5: Nav + mobile menu

**Model tier:** sonnet

**Files:**
- Create: `src/components/Nav.tsx`
- Test: `src/components/Nav.test.tsx`

**Interfaces:**
- Consumes: `navLinks`, `menuLinks`, `contact` from `../data/content`; `Menu`, `X` from `lucide-react`.
- Produces: `Nav({ activeId?: string })` — fixed transparent top bar (`z-40`) with logo, desktop anchor links (active link full white, others `text-white/60`), circular menu button (aria-label "Open menu"); full-screen overlay menu (`z-50`, aria-label "Close menu" on the X) with staggered links (`transitionDelay: 150 + i * 75 ms`), email footer, backdrop click-to-close, and `document.body.style.overflow = 'hidden'` while open.

- [ ] **Step 1: Write the failing test — `src/components/Nav.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Nav from './Nav'

describe('Nav', () => {
  it('renders logo and desktop anchor links', () => {
    render(<Nav />)
    // NOTE: "Static Ritual" text appears twice (nav bar + menu overlay header),
    // so target the unique logo link, not getByText.
    expect(screen.getByRole('link', { name: /Static Ritual/ })).toHaveAttribute('href', '#top')
    expect(screen.getByRole('link', { name: 'DJs—' })).toHaveAttribute('href', '#djs')
    expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute('href', '#experience')
  })

  it('opens and closes the mobile menu, locking body scroll', () => {
    render(<Nav />)
    fireEvent.click(screen.getByLabelText('Open menu'))
    expect(document.body.style.overflow).toBe('hidden')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
    fireEvent.click(screen.getByLabelText('Close menu'))
    expect(document.body.style.overflow).toBe('')
  })

  it('links SoundCloud externally in the menu', () => {
    render(<Nav />)
    fireEvent.click(screen.getByLabelText('Open menu'))
    const sc = screen.getByRole('link', { name: 'SoundCloud' })
    expect(sc).toHaveAttribute('href', 'https://soundcloud.com/nikitashokur')
    expect(sc).toHaveAttribute('target', '_blank')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Nav.test.tsx`
Expected: FAIL — cannot resolve `./Nav`.

- [ ] **Step 3: Write `src/components/Nav.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navLinks, menuLinks, contact } from '../data/content'

interface Props {
  activeId?: string
}

export default function Nav({ activeId = '' }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16 pt-6 sm:pt-8">
        <a href="#top" className="text-white text-lg sm:text-xl font-medium tracking-tight">
          Static Ritual<span className="text-[10px] align-super ml-0.5">°</span>
        </a>
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((l) => (
            <a
              key={l.target}
              href={l.target}
              className={`text-sm font-light tracking-wide transition-opacity duration-300 hover:opacity-70 ${
                activeId === l.target.slice(1) ? 'text-white' : 'text-white/60'
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-white/60 transition-colors duration-300"
        >
          <Menu size={15} />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setOpen(false)} />
        <div
          className={`relative z-10 flex flex-col h-full px-8 pt-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? 'translate-y-0' : '-translate-y-8'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white text-lg sm:text-xl font-medium tracking-tight">
              Static Ritual<span className="text-[10px] align-super ml-0.5">°</span>
            </span>
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-white/60 transition-colors duration-300"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            {menuLinks.map((l, i) => (
              <a
                key={l.label}
                href={l.href ?? l.target}
                {...(l.href ? { target: '_blank', rel: 'noreferrer' } : {})}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: `${150 + i * 75}ms` }}
                className={`text-white text-4xl sm:text-5xl font-light tracking-tight py-3 hover:opacity-60 transition-all duration-500 ${
                  open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
          <div
            style={{ transitionDelay: '450ms' }}
            className={`border-t border-white/10 py-6 transition-opacity duration-500 ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <a href={`mailto:${contact.email}`} className="text-white/40 text-xs font-light">
              {contact.email}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Nav.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.tsx src/components/Nav.test.tsx
git commit -m "feat: add fixed nav with full-screen mobile menu"
```

---

### Task 6: Hero — video, badge, rotating carousel

**Model tier:** opus

**Files:**
- Create: `src/components/Hero.tsx`
- Test: `src/components/Hero.test.tsx`

**Interfaces:**
- Consumes: `heroSlides`, `heroFooter` from `../data/content`; `GlitchText` from Task 3.
- Produces: `Hero()` — `<section class="relative h-screen w-full overflow-hidden bg-black">`, background `<video>`, desktop-only spinning badge ring, 3-slide carousel (5 s auto-rotate, dot click jumps AND resets the timer — the interval effect depends on `active`, so every change restarts the 5 s window), slide `i` marked `aria-hidden={i !== active}` and `data-testid="hero-slide-{i}"`, bottom info strip.

- [ ] **Step 1: Write the failing test — `src/components/Hero.test.tsx`**

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Hero from './Hero'

describe('Hero carousel', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows slide 0 first and rotates after 5 seconds', () => {
    render(<Hero />)
    expect(screen.getByTestId('hero-slide-0')).toHaveAttribute('aria-hidden', 'false')
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('hero-slide-1')).toHaveAttribute('aria-hidden', 'false')
    expect(screen.getByTestId('hero-slide-0')).toHaveAttribute('aria-hidden', 'true')
  })

  it('jumps to a slide when its dot is clicked and resets the timer', () => {
    render(<Hero />)
    fireEvent.click(screen.getByLabelText('Go to slide 3'))
    expect(screen.getByTestId('hero-slide-2')).toHaveAttribute('aria-hidden', 'false')
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('hero-slide-0')).toHaveAttribute('aria-hidden', 'false')
  })

  it('renders CTAs targeting section anchors', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: 'The Experience—' })).toHaveAttribute('href', '#experience')
    expect(screen.getByRole('link', { name: 'Book a Ritual—' })).toHaveAttribute('href', '#contact')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Hero.test.tsx`
Expected: FAIL — cannot resolve `./Hero`.

- [ ] **Step 3: Write `src/components/Hero.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { heroSlides, heroFooter } from '../data/content'
import GlitchText from './GlitchText'

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_135039_b04d00db-6ee2-4e2a-a7f5-b2dfd3d24fd2.mp4'

const BADGE_TEXT = 'SOUND • LIGHTS • VISUALS • RITUAL • '

export default function Hero() {
  const [active, setActive] = useState(0)

  // Re-created whenever `active` changes, so a dot click resets the 5s window.
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % heroSlides.length), 5000)
    return () => clearInterval(t)
  }, [active])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      <div className="relative z-10 flex flex-col h-full px-5 sm:px-8 md:px-12 lg:px-16 pt-24">
        <div className="flex-1 flex items-center">
          <div className="w-full flex items-start justify-center md:justify-end md:mr-16 lg:mr-24 px-1 sm:px-0">
            <div className="hidden md:flex items-start mr-6 lg:mr-10 -mt-8 shrink-0">
              <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
                <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md" />
                <svg className="animate-spin-slow w-full h-full" viewBox="0 0 200 200">
                  <defs>
                    <path id="badge-circle" d="M100,30 a70,70 0 1,1 -0.1,0" />
                  </defs>
                  <text className="fill-white/80" fontSize="10" fontWeight="300" letterSpacing="3">
                    <textPath href="#badge-circle">{BADGE_TEXT}</textPath>
                  </text>
                </svg>
              </div>
            </div>

            <div className="max-w-2xl relative">
              {heroSlides.map((s, i) => {
                const [before, after] = s.text.split(s.underline)
                return (
                  <div
                    key={s.cta}
                    data-testid={`hero-slide-${i}`}
                    aria-hidden={i !== active}
                    className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      i === active
                        ? 'opacity-100 translate-y-0 relative'
                        : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'
                    }`}
                  >
                    <GlitchText text={s.text} className="block">
                      <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-[2.1rem] font-light leading-[1.45] tracking-tight">
                        {before}
                        <span className="underline underline-offset-4 decoration-white/60">
                          {s.underline}
                        </span>
                        {after}
                      </h1>
                    </GlitchText>
                    <a
                      href={s.target}
                      className="inline-block mt-6 sm:mt-8 text-white text-xs sm:text-sm font-light tracking-wide hover:opacity-70 transition-opacity duration-300"
                    >
                      {s.cta}
                    </a>
                  </div>
                )
              })}

              <div className="flex items-center gap-2 mt-8 sm:mt-10">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-500 ${
                      i === active ? 'bg-white scale-100' : 'bg-white/40 scale-90 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pb-5 sm:pb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            {heroFooter.markers.map((m) => (
              <span key={m} className="text-white/50 text-[10px] sm:text-xs font-light">
                {m}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-0 border-t border-white/10 pt-4">
            <p className="text-white/40 text-[9px] sm:text-[10px] md:text-xs font-light leading-relaxed max-w-md">
              {heroFooter.before}
              <span className="underline underline-offset-2 decoration-white/30">
                {heroFooter.underline}
              </span>
              {heroFooter.after}
              <br className="hidden sm:block" /> {heroFooter.secondLine}
            </p>
            <div className="sm:text-right text-white/40 text-[9px] sm:text-[10px] md:text-xs font-light uppercase tracking-wider">
              {heroFooter.rightLines.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Hero.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx src/components/Hero.test.tsx
git commit -m "feat: add full-screen video hero with rotating badge and slide carousel"
```

---

### Task 7: DJ bento grid

**Model tier:** sonnet

**Files:**
- Create: `src/components/DJGrid.tsx`
- Test: `src/components/DJGrid.test.tsx`

**Interfaces:**
- Consumes: `djs`, `TileSize` from `../data/content`; `Section`, `GlitchText`, `GlitchImage`, `SoundCloudIcon`; `ArrowUpRight` from `lucide-react`.
- Produces: `DJGrid()` — `<Section id="djs">` with "THE ROSTER" header and a 4-col bento grid (`auto-rows-[240px]`; featured = 2×2, wide = 2×1, square = 1×1; single column on mobile). Featured SoundCloud link has `aria-label="CR//SPY on SoundCloud"`.

- [ ] **Step 1: Write the failing test — `src/components/DJGrid.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DJGrid from './DJGrid'
import { djs } from '../data/content'

describe('DJGrid', () => {
  it('renders every DJ tile', () => {
    render(<DJGrid />)
    for (const dj of djs) {
      expect(screen.getByText(dj.name)).toBeInTheDocument()
    }
  })

  it('gives CR//SPY the real photo and a SoundCloud link', () => {
    render(<DJGrid />)
    expect(screen.getByAltText('CR//SPY')).toHaveAttribute('src', '/media/crspy.png')
    expect(screen.getByLabelText('CR//SPY on SoundCloud')).toHaveAttribute(
      'href',
      'https://soundcloud.com/nikitashokur',
    )
  })

  it('renders duotone placeholders for the five placeholder DJs', () => {
    render(<DJGrid />)
    expect(screen.getAllByTestId('dj-placeholder')).toHaveLength(5)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/DJGrid.test.tsx`
Expected: FAIL — cannot resolve `./DJGrid`.

- [ ] **Step 3: Write `src/components/DJGrid.tsx`**

```tsx
import { ArrowUpRight } from 'lucide-react'
import { djs, TileSize } from '../data/content'
import Section from './Section'
import GlitchText from './GlitchText'
import GlitchImage from './GlitchImage'
import { SoundCloudIcon } from './icons'

const spans: Record<TileSize, string> = {
  featured: 'sm:col-span-2 sm:row-span-2',
  wide: 'sm:col-span-2',
  square: '',
}

export default function DJGrid() {
  return (
    <Section id="djs" className="px-5 sm:px-8 md:px-12 lg:px-16 py-24 sm:py-32">
      <GlitchText
        text="THE ROSTER"
        ambient
        className="text-white text-4xl sm:text-6xl md:text-7xl font-light tracking-tight"
      />
      <div className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[240px] gap-3">
        {djs.map((dj) => (
          <article
            key={dj.name}
            className={`group relative overflow-hidden border border-white/10 ${spans[dj.size]}`}
          >
            <GlitchImage src={dj.image} alt={dj.name} className="absolute inset-0" />
            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 bg-gradient-to-t from-black/80 via-black/10 to-transparent">
              {dj.featured && (
                <span className="text-[10px] tracking-[0.2em] text-white/60 uppercase mb-1">
                  Featured
                </span>
              )}
              <h3
                className={`text-white font-light tracking-tight ${
                  dj.featured ? 'text-3xl sm:text-5xl' : 'text-xl sm:text-2xl'
                }`}
              >
                {dj.name}
              </h3>
              <p className="text-white/50 text-xs font-light mt-1">{dj.genres.join(' / ')}</p>
              {dj.soundcloud && (
                <a
                  href={dj.soundcloud}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${dj.name} on SoundCloud`}
                  className="mt-2 inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-light transition-colors duration-300"
                >
                  <SoundCloudIcon /> SoundCloud <ArrowUpRight size={12} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/DJGrid.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/DJGrid.tsx src/components/DJGrid.test.tsx
git commit -m "feat: add DJ bento grid with featured CR//SPY tile"
```

---

### Task 8: Experience + About sections

**Model tier:** sonnet

**Files:**
- Create: `src/components/Experience.tsx`, `src/components/About.tsx`
- Test: `src/components/sections.test.tsx`

**Interfaces:**
- Consumes: `rig`, `genres`, `about` from `../data/content`; `Section`, `GlitchText`.
- Produces: `Experience()` — `<Section id="experience">` with rig spec-sheet (`font-mono`), pull stat, genre wall, photo/video line. `About()` — `<Section id="about">` with paragraph + pull quote.

- [ ] **Step 1: Write the failing test — `src/components/sections.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Experience from './Experience'
import About from './About'
import { genres, rig } from '../data/content'

describe('Experience', () => {
  it('shows the 16,000 watt pull stat and every rig item', () => {
    render(<Experience />)
    expect(screen.getByText('16,000 WATTS OF INTENT')).toBeInTheDocument()
    for (const item of rig.items) {
      expect(screen.getByText(item.label)).toBeInTheDocument()
    }
  })

  it('renders the full genre wall and the media coverage line', () => {
    render(<Experience />)
    for (const g of genres) {
      expect(screen.getByText(g)).toBeInTheDocument()
    }
    expect(screen.getByText(/photography/i)).toBeInTheDocument()
  })
})

describe('About', () => {
  it('renders the founding story and pull quote', () => {
    render(<About />)
    expect(screen.getByText(/founded by a group of friends/)).toBeInTheDocument()
    expect(screen.getByText('This is how we think it should be done.')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/sections.test.tsx`
Expected: FAIL — cannot resolve `./Experience`.

- [ ] **Step 3: Write `src/components/Experience.tsx`**

```tsx
import { rig, genres } from '../data/content'
import Section from './Section'
import GlitchText from './GlitchText'

export default function Experience() {
  return (
    <Section id="experience" className="px-5 sm:px-8 md:px-12 lg:px-16 py-24 sm:py-32">
      <GlitchText
        text="THE EXPERIENCE"
        ambient
        className="text-white text-4xl sm:text-6xl md:text-7xl font-light tracking-tight"
      />
      <div className="mt-10 sm:mt-16 grid md:grid-cols-2 gap-16">
        <div>
          <h3 className="text-white/50 text-xs font-mono uppercase tracking-[0.3em] mb-6">
            The Rig
          </h3>
          <ul className="font-mono">
            {rig.items.map((item) => (
              <li key={item.label} className="flex justify-between gap-4 border-b border-white/10 py-3">
                <span className="text-white uppercase text-xs tracking-wider">{item.label}</span>
                <span className="text-white/50 text-xs">{item.detail}</span>
              </li>
            ))}
          </ul>
          <GlitchText
            text={rig.pullStat}
            ambient
            className="block mt-10 text-white text-3xl sm:text-5xl font-light tracking-tight"
          />
        </div>
        <div>
          <h3 className="text-white/50 text-xs font-mono uppercase tracking-[0.3em] mb-6">
            The Vibe
          </h3>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {genres.map((g) => (
              <GlitchText
                key={g}
                text={g}
                ambient
                className="text-white/80 text-2xl sm:text-4xl font-light tracking-tight"
              />
            ))}
          </div>
          <p className="mt-10 text-white/40 text-xs font-light leading-relaxed max-w-md">
            Professional photography and videography of every event — every ritual documented.
          </p>
        </div>
      </div>
    </Section>
  )
}
```

- [ ] **Step 4: Write `src/components/About.tsx`**

```tsx
import { about } from '../data/content'
import Section from './Section'
import GlitchText from './GlitchText'

export default function About() {
  return (
    <Section id="about" className="px-5 sm:px-8 md:px-12 lg:px-16 py-24 sm:py-32">
      <p className="text-white/60 max-w-2xl text-base sm:text-lg font-light leading-relaxed">
        {about.paragraph}
      </p>
      <GlitchText
        text={about.pullQuote}
        ambient
        className="block mt-12 text-white text-3xl sm:text-5xl md:text-6xl font-light tracking-tight max-w-4xl"
      />
    </Section>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/sections.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/Experience.tsx src/components/About.tsx src/components/sections.test.tsx
git commit -m "feat: add Experience (rig + vibe) and About sections"
```

---

### Task 9: Contact section + marquee footer

**Model tier:** sonnet

**Files:**
- Create: `src/components/Contact.tsx`
- Test: `src/components/Contact.test.tsx`

**Interfaces:**
- Consumes: `contact` from `../data/content`; `Section`, `GlitchText`, `SoundCloudIcon`; `Instagram`, `ArrowUpRight` from `lucide-react`; `.marquee-track` CSS from Task 3.
- Produces: `Contact()` — `<Section id="contact">` with "BOOK A RITUAL", mailto link, SoundCloud external link, Instagram placeholder **span** (link only if `instagramIsPlaceholder` is false), marquee strip, fine print.

- [ ] **Step 1: Write the failing test — `src/components/Contact.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Contact from './Contact'

describe('Contact', () => {
  it('books via mailto', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: /nikshokur@gmail\.com/ })).toHaveAttribute(
      'href',
      'mailto:nikshokur@gmail.com',
    )
  })

  it('links SoundCloud externally', () => {
    render(<Contact />)
    const sc = screen.getByRole('link', { name: /soundcloud/i })
    expect(sc).toHaveAttribute('href', 'https://soundcloud.com/nikitashokur')
    expect(sc).toHaveAttribute('target', '_blank')
  })

  it('shows Instagram as a non-link placeholder', () => {
    render(<Contact />)
    expect(screen.getByText('@static.ritual')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /@static\.ritual/ })).toBeNull()
  })

  it('shows the fine print', () => {
    render(<Contact />)
    expect(screen.getByText('© 2026 Static Ritual — Live Audio Production')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Contact.test.tsx`
Expected: FAIL — cannot resolve `./Contact`.

- [ ] **Step 3: Write `src/components/Contact.tsx`**

```tsx
import { Instagram, ArrowUpRight } from 'lucide-react'
import { contact } from '../data/content'
import Section from './Section'
import GlitchText from './GlitchText'
import { SoundCloudIcon } from './icons'

export default function Contact() {
  const handle = contact.instagram.replace(/^@/, '')
  return (
    <Section id="contact" className="pt-24 sm:pt-32">
      <div className="px-5 sm:px-8 md:px-12 lg:px-16">
        <GlitchText
          text="BOOK A RITUAL"
          ambient
          className="text-white text-5xl sm:text-7xl md:text-8xl font-light tracking-tight"
        />
        <div className="mt-8">
          <a
            href={`mailto:${contact.email}`}
            className="inline-block text-white text-sm sm:text-base font-light tracking-wide hover:opacity-70 transition-opacity duration-300"
          >
            {contact.email}—
          </a>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-8">
          <a
            href={contact.soundcloud}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-light transition-colors duration-300"
          >
            <SoundCloudIcon /> SoundCloud <ArrowUpRight size={12} />
          </a>
          {contact.instagramIsPlaceholder ? (
            <span className="inline-flex items-center gap-1.5 text-white/40 text-xs font-light">
              <Instagram size={14} /> {contact.instagram}
            </span>
          ) : (
            <a
              href={`https://instagram.com/${handle}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-light transition-colors duration-300"
            >
              <Instagram size={14} /> {contact.instagram} <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      </div>

      <div className="mt-20 overflow-hidden border-t border-white/10 py-4" aria-hidden>
        <div className="marquee-track whitespace-nowrap text-white/30 text-xl font-light">
          <span>{'STATIC RITUAL — '.repeat(10)}</span>
          <span>{'STATIC RITUAL — '.repeat(10)}</span>
        </div>
      </div>
      <p className="px-5 sm:px-8 md:px-12 lg:px-16 py-6 text-white/30 text-[10px] font-light uppercase tracking-wider">
        © 2026 Static Ritual — Live Audio Production
      </p>
    </Section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Contact.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/Contact.tsx src/components/Contact.test.tsx
git commit -m "feat: add contact/booking section with marquee footer"
```

---

### Task 10: App assembly — composition + active-nav highlighting

**Model tier:** sonnet

**Files:**
- Modify: `src/App.tsx` (replace placeholder entirely)
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: every component from Tasks 3–9.
- Produces: the complete page. An IntersectionObserver (rootMargin `-40% 0px -55% 0px`) tracks which section is centered and feeds `Nav`'s `activeId`.

- [ ] **Step 1: Write the failing test — `src/App.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders all anchored sections in order', () => {
    render(<App />)
    const ids = ['djs', 'experience', 'about', 'contact']
    for (const id of ids) {
      expect(document.getElementById(id)).toBeInTheDocument()
    }
  })

  it('renders the nav and the grain layer', () => {
    render(<App />)
    // Logo text exists in both nav bar and menu overlay — query the unique logo link.
    expect(screen.getByRole('link', { name: /Static Ritual/ })).toHaveAttribute('href', '#top')
    // jsdom has no WebGL, so GlitchCanvas renders its static fallback here.
    expect(screen.getByTestId('grain-fallback')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/App.test.tsx`
Expected: FAIL — placeholder App has no sections ("djs" not found).

- [ ] **Step 3: Replace `src/App.tsx`**

```tsx
import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import DJGrid from './components/DJGrid'
import Experience from './components/Experience'
import About from './components/About'
import Contact from './components/Contact'
import GlitchCanvas from './components/GlitchCanvas'

export default function App() {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    document.querySelectorAll('main section[id]').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <div id="top" className="bg-black font-geist">
      <Nav activeId={activeId} />
      <main>
        <Hero />
        <DJGrid />
        <Experience />
        <About />
        <Contact />
      </main>
      <GlitchCanvas />
    </div>
  )
}
```

- [ ] **Step 4: Run the full suite to verify everything passes together**

Run: `npm test`
Expected: PASS — all test files green (content, primitives, GlitchCanvas, Nav, Hero, DJGrid, sections, Contact, App).

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: assemble single-page app with active-section nav highlighting"
```

---

### Task 11: SEO, meta, favicon

**Model tier:** haiku

**Files:**
- Modify: `index.html` (head)
- Create: `public/favicon.svg`

**Interfaces:**
- Consumes: nothing new.
- Produces: complete `<head>` metadata; glitch-styled favicon.

- [ ] **Step 1: Write `public/favicon.svg`** (RGB-split "SR" mark)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#000"/>
  <text x="7" y="42" font-family="monospace" font-size="26" fill="#f0f">SR</text>
  <text x="11" y="44" font-family="monospace" font-size="26" fill="#0ff">SR</text>
  <text x="9" y="43" font-family="monospace" font-size="26" fill="#fff">SR</text>
</svg>
```

- [ ] **Step 2: Extend `index.html` head** — insert after the `<title>` line:

```html
    <meta
      name="description"
      content="Static Ritual — live audio production for the underground. 16,000W of QSC sound, lights, visuals, and high-energy DJ nights. Featured: CR//SPY."
    />
    <meta name="theme-color" content="#000000" />
    <meta property="og:title" content="Static Ritual — Live Audio Production" />
    <meta
      property="og:description"
      content="16,000W of QSC sound, lights, visuals, and high-energy DJ nights. Bringing back the underground."
    />
    <meta property="og:type" content="website" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

(No `og:image`: it requires an absolute URL, and no production domain exists yet — add one when the site is deployed.)

- [ ] **Step 3: Verify build still passes**

Run: `npm run build`
Expected: clean build; `dist/favicon.svg` present.

- [ ] **Step 4: Commit**

```bash
git add index.html public/favicon.svg
git commit -m "feat: add SEO metadata, OG tags, and glitch favicon"
```

---

### Task 12: Final verification

**Model tier:** opus (browser pass driven by the orchestrator/Fable session, which can use browser tooling)

**Files:**
- Modify: only whatever the checks below reveal.

**Interfaces:**
- Consumes: the entire app.
- Produces: a verified, shippable build.

- [ ] **Step 1: Full automated pass**

Run: `npm test`
Expected: all tests pass.

Run: `npm run typecheck`
Expected: silent.

Run: `npm run build`
Expected: clean production build in `dist/`.

- [ ] **Step 2: Browser pass** — run `npm run dev` and verify each item in a real browser (the spec's verification list):

- Hero video autoplays muted and loops, full-bleed, no overlay.
- Grain visibly *animates* (not a static texture); scanlines faint; a glitch burst fires within ~10 s.
- Carousel rotates every 5 s; clicking a dot jumps and restarts the 5 s window.
- Badge ring spins (20 s period), desktop only.
- Desktop nav anchors smooth-scroll to each section; the active link brightens as sections pass.
- Mobile menu opens (body scroll locks), links stagger in, backdrop click closes, email shows.
- CR//SPY tile shows the club photo; hover triggers slice-ghost glitch; SoundCloud opens `soundcloud.com/nikitashokur` in a new tab.
- Five placeholder tiles render duotone gradients.
- Rig list, "16,000 WATTS OF INTENT", all seven genres, About pull quote, "BOOK A RITUAL", marquee strip all present.
- Mailto link opens with `nikshokur@gmail.com`.
- 390 px viewport: single-column grid, hero text legible, no horizontal scroll.

- [ ] **Step 3: Fix anything found, re-run Step 1, and commit**

```bash
git add -A
git commit -m "fix: final verification pass adjustments"
```

(Skip the commit if no changes were needed.)

---

## Post-plan notes

- **Deployment** is out of scope for this plan; `npm run build` output in `dist/` is host-agnostic (Netlify/Vercel/GitHub Pages all work as-is).
- **Content swaps later:** real DJ names/photos → edit `src/data/content.ts` + drop files in `public/media/`; real Instagram → set `instagramIsPlaceholder: false`.
