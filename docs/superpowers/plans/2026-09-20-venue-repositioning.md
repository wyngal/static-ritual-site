# Venue Repositioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the Static Ritual one-pager as a venue-facing credibility site: a dated upcoming ritual with an email-list signup, full-width past-ritual bands with capacity bars, per-ritual gallery pages, and a copy pass.

**Architecture:** All content stays in `src/data/content.ts`; new sections are small components that read from it. Gallery pages are hash routes (`#/ritual/<slug>`) resolved by a tiny hook, so `/` stays a one-pager and static subpath hosting keeps working. Email signup goes through one mocked function, `joinList`, so a real provider is a one-file swap later.

**Tech Stack:** React 18, TypeScript (strict, `noUnusedLocals`/`noUnusedParameters`), Vite 5, Tailwind 3, Vitest 2 + Testing Library, jsdom. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-09-20-venue-repositioning-design.md`

## Global Constraints

- No new npm dependencies (no router library).
- `/` remains a single page. Section order: Hero, Next Ritual, Roster, Past Rituals, The Rig, About, Contact.
- Section ids: `next`, `djs`, `rituals`, `rig`, `about`, `contact`. (`experience` is renamed to `rig` in Task 6.)
- Only hashes beginning `#/` are routes. Plain anchors (`#djs`) must keep working.
- Past rituals show **city only** — never a venue name or event name.
- Past ritual data, exactly: 002 Nashville, TN · AUG 2025 · 800 / 1,000 · headliner Yung Gravy. 001 Asheville, NC · JUN 2024 · 990 / 1,100 · headliner Yung Gravy. Lineup for both: `['CR//SPY']` only — do not invent other acts.
- Next ritual, exactly: 003 · TAMPA BAY · `2026-11-14` (a Saturday). Venue is never shown; the disclosure line is `LOCATION DISCLOSED 48HRS PRIOR — TO THE LIST ONLY.`
- Capacity percentage is derived from attendance / capacity, never stored.
- The list is called `THE LIST`. Button: `GET ON THE LIST —`. Microcopy: `No spam. No flyers. Coordinates only.` Success: `YOU'RE ON THE LIST. WATCH YOUR INBOX. TELL NO ONE.`
- `joinList` is a mock that stores nothing. Keep the `MOCK` comment on it.
- No stock or third-party images. Missing images use the existing `GlitchImage` null placeholder.
- Match existing code style: no semicolons, single quotes, Tailwind utility classes, `px-5 sm:px-8 md:px-12 lg:px-16` page gutters, `font-light` type, `font-mono` for data.
- Run one test file: `npx vitest run <path>`. Run all: `npm test`. Typecheck: `npm run typecheck`.
- End every commit message with: `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`

## File Structure

| File | Responsibility |
|------|----------------|
| `src/data/content.ts` (modify) | Adds `PastRitual`, `NextRitual` types and data; rewrites hero/about/nav copy; adds `rig.brings` |
| `src/lib/ritual.ts` (create) | Pure helpers: `capacityPercent`, `formatRitualDate` |
| `src/lib/list.ts` (create) | `joinList(email)` — the mocked signup backend |
| `src/lib/useHashRoute.ts` (create) | `parseRitualSlug`, `useHashRoute` |
| `src/components/ListSignup.tsx` (create) | Email form with idle/submitting/done/error states |
| `src/components/NextRitual.tsx` (create) | The upcoming-ritual slab, hosts the primary signup |
| `src/components/CapacityBar.tsx` (create) | Filled rail + percentage + `~800 / 1,000 CAP` |
| `src/components/PastRituals.tsx` (create) | Full-width band per past ritual |
| `src/components/RitualPage.tsx` (create) | Thin gallery page for one ritual |
| `src/components/MainPage.tsx` (create) | The one-pager (extracted from `App.tsx`) |
| `src/App.tsx` (modify) | Switches between `MainPage` and `RitualPage` |
| `Experience.tsx`, `Contact.tsx` (modify) | Copy pass, `rig` id, secondary signup |

---

### Task 1: Ritual data and helpers

**Files:**
- Modify: `src/data/content.ts`
- Create: `src/lib/ritual.ts`
- Test: `src/lib/ritual.test.ts`, `src/data/content.test.ts`

**Interfaces:**
- Produces: `PastRitual`, `NextRitual` interfaces; `pastRituals: PastRitual[]` (newest first); `nextRitual: NextRitual`; `capacityPercent(r: { attendance: number; capacity: number }): number`; `formatRitualDate(iso: string): string`.

- [ ] **Step 1: Write the failing helper tests**

Create `src/lib/ritual.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { capacityPercent, formatRitualDate } from './ritual'

describe('capacityPercent', () => {
  it('derives a whole-number percentage', () => {
    expect(capacityPercent({ attendance: 800, capacity: 1000 })).toBe(80)
    expect(capacityPercent({ attendance: 990, capacity: 1100 })).toBe(90)
  })
})

describe('formatRitualDate', () => {
  it('formats an ISO date as weekday, month-day, year without timezone drift', () => {
    expect(formatRitualDate('2026-11-14')).toBe('SAT · NOV 14 · 2026')
    expect(formatRitualDate('2026-01-01')).toBe('THU · JAN 1 · 2026')
  })
})
```

- [ ] **Step 2: Write the failing content tests**

In `src/data/content.test.ts`, change the import line to:

```ts
import { heroSlides, djs, rig, genres, about, contact, pastRituals, nextRitual } from './content'
```

and add inside the `describe` block:

```ts
  it('lists past rituals newest first with unique slugs and sane attendance', () => {
    expect(pastRituals.map((r) => r.number)).toEqual(['002', '001'])
    expect(pastRituals.map((r) => r.slug)).toEqual(['nashville', 'asheville'])
    expect(new Set(pastRituals.map((r) => r.slug)).size).toBe(pastRituals.length)
    for (const r of pastRituals) {
      expect(r.attendance).toBeLessThanOrEqual(r.capacity)
      expect(r.headliner).toBe('Yung Gravy')
      expect(r.lineup).toEqual(['CR//SPY'])
    }
  })

  it('sets the next ritual for Saturday Nov 14 2026 in Tampa Bay', () => {
    expect(nextRitual.number).toBe('003')
    expect(nextRitual.region).toBe('TAMPA BAY')
    expect(nextRitual.date).toBe('2026-11-14')
  })
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run src/lib/ritual.test.ts src/data/content.test.ts`
Expected: FAIL — cannot resolve `./ritual`; `pastRituals` is not exported.

- [ ] **Step 4: Implement the helpers**

Create `src/lib/ritual.ts`:

```ts
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export function capacityPercent(r: { attendance: number; capacity: number }): number {
  return Math.round((r.attendance / r.capacity) * 100)
}

// Parsed as UTC so the weekday never shifts with the viewer's timezone.
export function formatRitualDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  return `${DAYS[d.getUTCDay()]} · ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()} · ${d.getUTCFullYear()}`
}
```

- [ ] **Step 5: Add the data**

In `src/data/content.ts`, add after the `MenuLink` interface:

```ts
export interface PastRitual {
  number: string
  slug: string
  city: string
  date: string
  attendance: number
  capacity: number
  headliner: string
  lineup: string[]
  quote: string
  cover: string | null
  photos: string[]
}

export interface NextRitual {
  number: string
  region: string
  date: string
  lineup: string[]
  lineupNote: string
  rigLine: string
  disclosure: string
}
```

and add after the `djs` array:

```ts
export const nextRitual: NextRitual = {
  number: '003',
  region: 'TAMPA BAY',
  date: '2026-11-14',
  lineup: ['CR//SPY'],
  lineupNote: 'MORE NAMES UNVEILED CLOSER TO THE NIGHT',
  rigLine: '16,000W · FULL LIGHT + VISUAL RIG',
  disclosure: 'LOCATION DISCLOSED 48HRS PRIOR — TO THE LIST ONLY.',
}

// Newest first. City only — venue and event names stay off the site.
// cover/photos are empty until real event photos are supplied.
export const pastRituals: PastRitual[] = [
  {
    number: '002',
    slug: 'nashville',
    city: 'NASHVILLE, TN',
    date: 'AUG 2025',
    attendance: 800,
    capacity: 1000,
    headliner: 'Yung Gravy',
    lineup: ['CR//SPY'],
    quote: 'Eight hundred deep. The floor never cleared.',
    cover: null,
    photos: [],
  },
  {
    number: '001',
    slug: 'asheville',
    city: 'ASHEVILLE, NC',
    date: 'JUN 2024',
    attendance: 990,
    capacity: 1100,
    headliner: 'Yung Gravy',
    lineup: ['CR//SPY'],
    quote: 'Wall to wall in the mountains. The first one set the standard.',
    cover: null,
    photos: [],
  },
]
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/lib/ritual.test.ts src/data/content.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/lib/ritual.ts src/lib/ritual.test.ts src/data/content.ts src/data/content.test.ts
git commit -m "feat: add ritual data and helpers"
```

---

### Task 2: THE LIST signup

**Files:**
- Create: `src/lib/list.ts`, `src/components/ListSignup.tsx`
- Test: `src/components/ListSignup.test.tsx`

**Interfaces:**
- Produces: `joinList(email: string): Promise<void>`; `<ListSignup id: string compact?: boolean />` (default export). `id` must be unique per instance — it names the input.

- [ ] **Step 1: Write the failing tests**

Create `src/components/ListSignup.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ListSignup from './ListSignup'
import { joinList } from '../lib/list'

vi.mock('../lib/list', () => ({ joinList: vi.fn() }))
const mockJoin = vi.mocked(joinList)

const SUCCESS = "YOU'RE ON THE LIST. WATCH YOUR INBOX. TELL NO ONE."

describe('ListSignup', () => {
  beforeEach(() => mockJoin.mockReset())

  it('blocks an invalid email, keeps focus, and never calls joinList', () => {
    render(<ListSignup id="t" />)
    const input = screen.getByLabelText('Email address')
    fireEvent.change(input, { target: { value: 'not-an-email' } })
    fireEvent.click(screen.getByRole('button', { name: 'GET ON THE LIST —' }))
    expect(screen.getByRole('alert')).toHaveTextContent("THAT'S NOT AN ADDRESS. TRY AGAIN.")
    expect(input).toHaveFocus()
    expect(mockJoin).not.toHaveBeenCalled()
  })

  it('shows the success state after joinList resolves', async () => {
    mockJoin.mockResolvedValue()
    render(<ListSignup id="t" />)
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'a@b.co' } })
    fireEvent.click(screen.getByRole('button', { name: 'GET ON THE LIST —' }))
    await waitFor(() => expect(screen.getByText(SUCCESS)).toBeInTheDocument())
    expect(mockJoin).toHaveBeenCalledWith('a@b.co')
    expect(screen.queryByLabelText('Email address')).toBeNull()
  })

  it('shows a retry message and preserves the email when joinList rejects', async () => {
    mockJoin.mockRejectedValue(new Error('down'))
    render(<ListSignup id="t" />)
    const input = screen.getByLabelText('Email address')
    fireEvent.change(input, { target: { value: 'a@b.co' } })
    fireEvent.click(screen.getByRole('button', { name: 'GET ON THE LIST —' }))
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('SIGNAL LOST. HIT IT AGAIN.'),
    )
    expect(input).toHaveValue('a@b.co')
  })

  it('shows the microcopy unless compact', () => {
    const { unmount } = render(<ListSignup id="a" />)
    expect(screen.getByText('No spam. No flyers. Coordinates only.')).toBeInTheDocument()
    unmount()
    render(<ListSignup id="b" compact />)
    expect(screen.queryByText('No spam. No flyers. Coordinates only.')).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/ListSignup.test.tsx`
Expected: FAIL — cannot resolve `./ListSignup`.

- [ ] **Step 3: Implement the mock backend**

Create `src/lib/list.ts`:

```ts
// MOCK — stores nothing; every signup is discarded. Replace the body with a real
// provider call (Mailchimp, Buttondown, ...) before the site goes to real fans.
export async function joinList(_email: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 600))
}
```

- [ ] **Step 4: Implement the component**

Create `src/components/ListSignup.tsx`:

```tsx
import { FormEvent, useRef, useState } from 'react'
import { joinList } from '../lib/list'

interface Props {
  id: string
  compact?: boolean
}

type Status = 'idle' | 'submitting' | 'done'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ListSignup({ id, compact = false }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!EMAIL.test(email.trim())) {
      setError("THAT'S NOT AN ADDRESS. TRY AGAIN.")
      inputRef.current?.focus()
      return
    }
    setError('')
    setStatus('submitting')
    try {
      await joinList(email.trim())
      setStatus('done')
    } catch {
      setStatus('idle')
      setError('SIGNAL LOST. HIT IT AGAIN.')
    }
  }

  if (status === 'done') {
    return (
      <p role="status" className="font-mono text-white text-xs sm:text-sm uppercase tracking-[0.2em]">
        YOU'RE ON THE LIST. WATCH YOUR INBOX. TELL NO ONE.
      </p>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="max-w-xl">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          ref={inputRef}
          id={`list-email-${id}`}
          type="email"
          aria-label="Email address"
          aria-invalid={error !== ''}
          placeholder="your@email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-transparent border border-white/30 focus:border-white outline-none px-4 py-3 font-mono text-white text-sm placeholder:text-white/30 transition-colors duration-300"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="border border-white bg-white text-black px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-transparent hover:text-white disabled:opacity-50 transition-colors duration-300"
        >
          {status === 'submitting' ? 'TRANSMITTING…' : 'GET ON THE LIST —'}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 font-mono text-[#f0f] text-[10px] sm:text-xs uppercase tracking-[0.2em]">
          {error}
        </p>
      )}
      {!compact && (
        <p className="mt-3 text-white/40 text-[10px] sm:text-xs font-light">
          No spam. No flyers. Coordinates only.
        </p>
      )}
    </form>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/components/ListSignup.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add src/lib/list.ts src/components/ListSignup.tsx src/components/ListSignup.test.tsx
git commit -m "feat: add THE LIST signup with mocked backend"
```

---

### Task 3: Next Ritual section

**Files:**
- Create: `src/components/NextRitual.tsx`
- Test: `src/components/NextRitual.test.tsx`

**Interfaces:**
- Consumes: `nextRitual` from `../data/content`; `formatRitualDate(iso: string): string` from `../lib/ritual`; `<ListSignup id compact? />` from `./ListSignup`; existing `Section` (`id`, `className`, `children`) and `GlitchText` (`text`, `ambient`, `className`).
- Produces: `<NextRitual />` default export rendering `<section id="next">`.

- [ ] **Step 1: Write the failing test**

Create `src/components/NextRitual.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NextRitual from './NextRitual'

describe('NextRitual', () => {
  it('announces ritual 003 with date, region, and the disclosure line', () => {
    render(<NextRitual />)
    expect(document.getElementById('next')).toBeInTheDocument()
    expect(screen.getByText('RITUAL 003')).toBeInTheDocument()
    expect(screen.getByText('TAMPA BAY')).toBeInTheDocument()
    expect(screen.getByText('SAT · NOV 14 · 2026')).toBeInTheDocument()
    expect(
      screen.getByText('LOCATION DISCLOSED 48HRS PRIOR — TO THE LIST ONLY.'),
    ).toBeInTheDocument()
  })

  it('shows the lineup, the rig line, and the list signup', () => {
    render(<NextRitual />)
    expect(screen.getByText('CR//SPY')).toBeInTheDocument()
    expect(screen.getByText('MORE NAMES UNVEILED CLOSER TO THE NIGHT')).toBeInTheDocument()
    expect(screen.getByText('16,000W · FULL LIGHT + VISUAL RIG')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'GET ON THE LIST —' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/NextRitual.test.tsx`
Expected: FAIL — cannot resolve `./NextRitual`.

- [ ] **Step 3: Implement**

Create `src/components/NextRitual.tsx`:

```tsx
import { nextRitual } from '../data/content'
import { formatRitualDate } from '../lib/ritual'
import Section from './Section'
import GlitchText from './GlitchText'
import ListSignup from './ListSignup'

export default function NextRitual() {
  return (
    <Section
      id="next"
      className="px-5 sm:px-8 md:px-12 lg:px-16 py-24 sm:py-32 border-t border-white/10"
    >
      <p className="text-white/50 text-xs font-mono uppercase tracking-[0.3em]">Next Ritual</p>
      <GlitchText
        text={`RITUAL ${nextRitual.number}`}
        ambient
        className="block mt-4 text-white text-6xl sm:text-8xl md:text-9xl font-light tracking-tight"
      />
      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-2 font-mono text-white text-sm sm:text-lg uppercase tracking-[0.2em]">
        <span>{nextRitual.region}</span>
        <span>{formatRitualDate(nextRitual.date)}</span>
      </div>
      <p className="mt-6 font-mono text-[#0ff] text-xs sm:text-sm uppercase tracking-[0.2em]">
        {nextRitual.disclosure}
      </p>

      <div className="mt-12 grid md:grid-cols-2 gap-12 md:gap-16 border-t border-white/10 pt-10">
        <div>
          <h3 className="text-white/50 text-xs font-mono uppercase tracking-[0.3em] mb-6">
            Transmitting
          </h3>
          <ul>
            {nextRitual.lineup.map((name) => (
              <li key={name} className="text-white text-3xl sm:text-5xl font-light tracking-tight">
                {name}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-white/40 text-xs font-mono uppercase tracking-wider">
            {nextRitual.lineupNote}
          </p>
          <p className="mt-8 text-white/60 text-xs font-mono uppercase tracking-wider">
            {nextRitual.rigLine}
          </p>
        </div>
        <div>
          <h3 className="text-white/50 text-xs font-mono uppercase tracking-[0.3em] mb-6">
            The List
          </h3>
          <p className="mb-6 text-white/60 text-sm font-light leading-relaxed max-w-md">
            The address goes out 48 hours before doors, to the list and nowhere else. No list, no
            location.
          </p>
          <ListSignup id="next" />
        </div>
      </div>
    </Section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/NextRitual.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/NextRitual.tsx src/components/NextRitual.test.tsx
git commit -m "feat: add Next Ritual section with list signup"
```

---

### Task 4: Past Rituals bands with capacity bar

**Files:**
- Create: `src/components/CapacityBar.tsx`, `src/components/PastRituals.tsx`
- Test: `src/components/PastRituals.test.tsx`

**Interfaces:**
- Consumes: `pastRituals` from `../data/content`; `capacityPercent(r)` from `../lib/ritual`; existing `GlitchImage` (`src: string | null`, `alt`, `className`) — it renders a placeholder when `src` is null.
- Produces: `<CapacityBar attendance: number capacity: number />` and `<PastRituals />` (default exports). `PastRituals` renders `<section id="rituals">`; each band is an `<article>` linking to `#/ritual/<slug>`.

- [ ] **Step 1: Write the failing tests**

Create `src/components/PastRituals.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import PastRituals from './PastRituals'
import CapacityBar from './CapacityBar'

describe('CapacityBar', () => {
  it('derives the percentage and formats the counts', () => {
    render(<CapacityBar attendance={800} capacity={1000} />)
    expect(screen.getByRole('img', { name: '80% of capacity' })).toBeInTheDocument()
    expect(screen.getByText('80%')).toBeInTheDocument()
    expect(screen.getByText('~800 / 1,000 CAP')).toBeInTheDocument()
  })
})

describe('PastRituals', () => {
  it('renders one band per ritual, newest first', () => {
    render(<PastRituals />)
    expect(document.getElementById('rituals')).toBeInTheDocument()
    const bands = screen.getAllByRole('article')
    expect(bands).toHaveLength(2)
    expect(within(bands[0]).getByText('NASHVILLE, TN')).toBeInTheDocument()
    expect(within(bands[1]).getByText('ASHEVILLE, NC')).toBeInTheDocument()
  })

  it('shows date, headliner, capacity, quote, and a gallery link per band', () => {
    render(<PastRituals />)
    const [nashville, asheville] = screen.getAllByRole('article')
    expect(within(nashville).getByText('RITUAL 002')).toBeInTheDocument()
    expect(within(nashville).getByText('AUG 2025')).toBeInTheDocument()
    expect(within(nashville).getByText('Yung Gravy')).toBeInTheDocument()
    expect(within(nashville).getByText('80%')).toBeInTheDocument()
    expect(within(nashville).getByText('~800 / 1,000 CAP')).toBeInTheDocument()
    // Regex: the quote is wrapped in curly quotation marks.
    expect(within(nashville).getByText(/The floor never cleared/)).toBeInTheDocument()
    expect(within(nashville).getByRole('link', { name: /OPEN THE ARCHIVE/ })).toHaveAttribute(
      'href',
      '#/ritual/nashville',
    )
    expect(within(asheville).getByText('90%')).toBeInTheDocument()
    expect(within(asheville).getByText('~990 / 1,100 CAP')).toBeInTheDocument()
  })

  it('never names a venue', () => {
    const { container } = render(<PastRituals />)
    expect(container.textContent).not.toMatch(/cannery|orange peel/i)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/PastRituals.test.tsx`
Expected: FAIL — cannot resolve `./PastRituals`.

- [ ] **Step 3: Implement CapacityBar**

Create `src/components/CapacityBar.tsx`:

```tsx
import { capacityPercent } from '../lib/ritual'

interface Props {
  attendance: number
  capacity: number
}

export default function CapacityBar({ attendance, capacity }: Props) {
  const pct = capacityPercent({ attendance, capacity })
  return (
    <div>
      <div role="img" aria-label={`${pct}% of capacity`} className="h-2 w-full bg-white/10">
        <div className="h-full bg-white" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-3 flex items-baseline justify-between font-mono">
        <span className="text-white text-3xl sm:text-4xl">{pct}%</span>
        <span className="text-white/50 text-xs uppercase tracking-wider">
          ~{attendance.toLocaleString('en-US')} / {capacity.toLocaleString('en-US')} CAP
        </span>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Implement PastRituals**

Create `src/components/PastRituals.tsx`:

```tsx
import { pastRituals } from '../data/content'
import Section from './Section'
import GlitchText from './GlitchText'
import GlitchImage from './GlitchImage'
import CapacityBar from './CapacityBar'

export default function PastRituals() {
  return (
    <Section id="rituals" className="py-24 sm:py-32">
      <div className="px-5 sm:px-8 md:px-12 lg:px-16">
        <GlitchText
          text="PAST RITUALS"
          ambient
          className="text-white text-4xl sm:text-6xl md:text-7xl font-light tracking-tight"
        />
      </div>
      <div className="mt-10 sm:mt-16">
        {pastRituals.map((r) => (
          <article
            key={r.slug}
            className="group grid md:grid-cols-2 border-t border-white/10 last:border-b"
          >
            <GlitchImage
              src={r.cover}
              alt={`Ritual ${r.number}, ${r.city}`}
              className="aspect-[16/10] md:aspect-auto md:min-h-[420px]"
            />
            <div className="flex flex-col justify-between gap-10 px-5 sm:px-8 md:px-12 lg:px-16 py-10 sm:py-14">
              <div>
                <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-[0.3em]">
                  <span className="text-white/50">RITUAL {r.number}</span>
                  <span className="text-white/50">{r.date}</span>
                </div>
                <h3 className="mt-4 text-white text-4xl sm:text-6xl font-light tracking-tight">
                  {r.city}
                </h3>
                <dl className="mt-6 font-mono text-xs uppercase tracking-wider">
                  <div className="flex gap-4 border-b border-white/10 py-3">
                    <dt className="text-white/50 w-24 shrink-0">Headliner</dt>
                    <dd className="text-white">{r.headliner}</dd>
                  </div>
                  <div className="flex gap-4 border-b border-white/10 py-3">
                    <dt className="text-white/50 w-24 shrink-0">With</dt>
                    <dd className="text-white">{r.lineup.join(' · ')}</dd>
                  </div>
                </dl>
                <p className="mt-8 text-white/70 text-lg sm:text-2xl font-light leading-snug">
                  “{r.quote}”
                </p>
              </div>
              <div>
                <CapacityBar attendance={r.attendance} capacity={r.capacity} />
                <a
                  href={`#/ritual/${r.slug}`}
                  className="inline-block mt-8 text-white text-xs sm:text-sm font-light tracking-wide hover:opacity-70 transition-opacity duration-300"
                >
                  OPEN THE ARCHIVE—
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
```

Note: `RITUAL {r.number}` renders as two adjacent text nodes in one `<span>`; Testing Library's `getByText('RITUAL 002')` matches on the element's combined text, so the test passes as written.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/components/PastRituals.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add src/components/CapacityBar.tsx src/components/PastRituals.tsx src/components/PastRituals.test.tsx
git commit -m "feat: add Past Rituals bands with capacity bars"
```

---

### Task 5: Hash routing, gallery page, and page assembly

**Files:**
- Create: `src/lib/useHashRoute.ts`, `src/components/RitualPage.tsx`, `src/components/MainPage.tsx`
- Modify: `src/App.tsx` (full rewrite, currently 37 lines)
- Test: `src/lib/useHashRoute.test.ts`, `src/components/RitualPage.test.tsx`, `src/App.test.tsx`

**Interfaces:**
- Consumes: `pastRituals`, `PastRitual` from `../data/content`; `<NextRitual />`, `<PastRituals />`, `<CapacityBar attendance capacity />` from Tasks 3–4; existing `Nav` (`activeId?: string`), `Hero`, `DJGrid`, `Experience`, `About`, `Contact`, `GlitchCanvas`, `GlitchText`.
- Produces: `parseRitualSlug(hash: string): string | null`; `useHashRoute(): string | null`; `<RitualPage ritual: PastRitual />`; `<MainPage />`.

Why `MainPage` is extracted: the active-section `IntersectionObserver` effect in `App.tsx` runs once on mount. If `App` swapped its own children, returning from a gallery page would re-mount the sections without re-running the effect. Moving it into `MainPage` makes it re-run whenever the one-pager mounts.

- [ ] **Step 1: Write the failing hook tests**

Create `src/lib/useHashRoute.test.ts`:

```ts
import { describe, it, expect, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { parseRitualSlug, useHashRoute } from './useHashRoute'

describe('parseRitualSlug', () => {
  it('reads a ritual slug from a route hash', () => {
    expect(parseRitualSlug('#/ritual/nashville')).toBe('nashville')
  })

  it('ignores plain section anchors and malformed routes', () => {
    expect(parseRitualSlug('#djs')).toBeNull()
    expect(parseRitualSlug('')).toBeNull()
    expect(parseRitualSlug('#/ritual/')).toBeNull()
    expect(parseRitualSlug('#/ritual/a/b')).toBeNull()
  })
})

describe('useHashRoute', () => {
  afterEach(() => {
    window.location.hash = ''
  })

  it('tracks hash changes', () => {
    const { result } = renderHook(() => useHashRoute())
    expect(result.current).toBeNull()
    act(() => {
      window.location.hash = '#/ritual/asheville'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(result.current).toBe('asheville')
  })
})
```

- [ ] **Step 2: Run to verify it fails, then implement the hook**

Run: `npx vitest run src/lib/useHashRoute.test.ts` — Expected: FAIL, cannot resolve `./useHashRoute`.

Create `src/lib/useHashRoute.ts`:

```ts
import { useEffect, useState } from 'react'

// Only hashes starting with "#/" are routes; plain anchors like "#djs" stay in-page links.
export function parseRitualSlug(hash: string): string | null {
  const match = hash.match(/^#\/ritual\/([a-z0-9-]+)$/)
  return match ? match[1] : null
}

export function useHashRoute(): string | null {
  const [slug, setSlug] = useState(() => parseRitualSlug(window.location.hash))

  useEffect(() => {
    const onChange = () => setSlug(parseRitualSlug(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return slug
}
```

Run again — Expected: PASS.

- [ ] **Step 3: Write the failing RitualPage test**

Create `src/components/RitualPage.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import RitualPage from './RitualPage'
import { pastRituals, PastRitual } from '../data/content'

describe('RitualPage', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })
  afterEach(() => vi.restoreAllMocks())

  it('shows the ritual header data and a link back to the main page', () => {
    render(<RitualPage ritual={pastRituals[0]} />)
    expect(screen.getByText('RITUAL 002')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'NASHVILLE, TN' })).toBeInTheDocument()
    expect(screen.getByText('~800 / 1,000 CAP')).toBeInTheDocument()
    expect(screen.getByText(/Yung Gravy/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /BACK TO THE RITUALS/ })).toHaveAttribute(
      'href',
      '#rituals',
    )
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('says the archive is still developing when there are no photos', () => {
    render(<RitualPage ritual={pastRituals[0]} />)
    expect(screen.getByText('ARCHIVE STILL DEVELOPING.')).toBeInTheDocument()
  })

  it('renders every photo when present', () => {
    const ritual: PastRitual = { ...pastRituals[0], photos: ['/a.jpg', '/b.jpg'] }
    render(<RitualPage ritual={ritual} />)
    expect(screen.getAllByRole('img', { name: /NASHVILLE, TN — photo/ })).toHaveLength(2)
    expect(screen.queryByText('ARCHIVE STILL DEVELOPING.')).toBeNull()
  })
})
```

- [ ] **Step 4: Run to verify it fails, then implement RitualPage**

Run: `npx vitest run src/components/RitualPage.test.tsx` — Expected: FAIL, cannot resolve `./RitualPage`.

Create `src/components/RitualPage.tsx`:

```tsx
import { useEffect } from 'react'
import { PastRitual } from '../data/content'
import GlitchText from './GlitchText'
import CapacityBar from './CapacityBar'

interface Props {
  ritual: PastRitual
}

export default function RitualPage({ ritual }: Props) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [ritual.slug])

  return (
    <main className="min-h-screen pt-8 pb-24">
      <div className="px-5 sm:px-8 md:px-12 lg:px-16">
        <a
          href="#rituals"
          className="text-white text-xs sm:text-sm font-light tracking-wide hover:opacity-70 transition-opacity duration-300"
        >
          —BACK TO THE RITUALS
        </a>
        <div className="mt-16 flex items-baseline justify-between font-mono text-xs uppercase tracking-[0.3em] text-white/50">
          <GlitchText text={`RITUAL ${ritual.number}`} ambient />
          <span>{ritual.date}</span>
        </div>
        <h1 className="mt-4 text-white text-5xl sm:text-7xl md:text-8xl font-light tracking-tight">
          {ritual.city}
        </h1>
        <p className="mt-6 font-mono text-white/70 text-xs uppercase tracking-wider">
          {[ritual.headliner, ...ritual.lineup].join(' · ')}
        </p>
        <div className="mt-10 max-w-xl">
          <CapacityBar attendance={ritual.attendance} capacity={ritual.capacity} />
        </div>
      </div>

      {ritual.photos.length === 0 ? (
        <div className="duotone-placeholder mt-16 mx-5 sm:mx-8 md:mx-12 lg:mx-16 flex items-center justify-center aspect-[16/9] border border-white/10">
          <p className="font-mono text-white/50 text-xs uppercase tracking-[0.3em]">
            ARCHIVE STILL DEVELOPING.
          </p>
        </div>
      ) : (
        <div className="mt-16 flex flex-col gap-3">
          {ritual.photos.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${ritual.city} — photo ${i + 1}`}
              loading="lazy"
              className="w-full grayscale contrast-125"
            />
          ))}
        </div>
      )}
    </main>
  )
}
```

Run again — Expected: PASS (3 tests).

- [ ] **Step 5: Update the App tests (failing)**

Replace the contents of `src/App.test.tsx` with:

```tsx
import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  beforeAll(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    window.location.hash = ''
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('renders all anchored sections in order', () => {
    render(<App />)
    const ids = Array.from(document.querySelectorAll('main section[id]')).map((s) => s.id)
    expect(ids).toEqual(['next', 'djs', 'rituals', 'experience', 'about', 'contact'])
  })

  it('renders the nav and the grain layer', () => {
    render(<App />)
    // Logo text exists in both nav bar and menu overlay — query the unique logo link.
    expect(screen.getByRole('link', { name: /Static Ritual/ })).toHaveAttribute('href', '#top')
    // jsdom has no WebGL, so GlitchCanvas renders its static fallback here.
    expect(screen.getByTestId('grain-fallback')).toBeInTheDocument()
  })

  it('renders a ritual gallery page on a ritual route, without the one-pager', () => {
    window.location.hash = '#/ritual/asheville'
    render(<App />)
    expect(screen.getByRole('heading', { name: 'ASHEVILLE, NC' })).toBeInTheDocument()
    expect(document.getElementById('djs')).toBeNull()
    expect(screen.getByTestId('grain-fallback')).toBeInTheDocument()
  })

  it('falls back to the main page for plain anchors and unknown slugs', () => {
    window.location.hash = '#/ritual/nowhere'
    const { unmount } = render(<App />)
    expect(document.getElementById('djs')).toBeInTheDocument()
    unmount()
    window.location.hash = '#djs'
    render(<App />)
    expect(document.getElementById('djs')).toBeInTheDocument()
  })
})
```

(The section id `experience` becomes `rig` in Task 6, which updates this assertion.)

Run: `npx vitest run src/App.test.tsx` — Expected: FAIL (section order lacks `next`/`rituals`; ritual route renders the one-pager).

- [ ] **Step 6: Implement MainPage and rewrite App**

Create `src/components/MainPage.tsx`:

```tsx
import { useEffect, useState } from 'react'
import Nav from './Nav'
import Hero from './Hero'
import NextRitual from './NextRitual'
import DJGrid from './DJGrid'
import PastRituals from './PastRituals'
import Experience from './Experience'
import About from './About'
import Contact from './Contact'

export default function MainPage() {
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

  // Arriving from a gallery page via "#rituals": the browser tried to jump before
  // this page had rendered, so finish the jump now. (jsdom has no scrollIntoView.)
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id && !id.startsWith('/')) document.getElementById(id)?.scrollIntoView?.()
  }, [])

  return (
    <>
      <Nav activeId={activeId} />
      <main>
        <Hero />
        <NextRitual />
        <DJGrid />
        <PastRituals />
        <Experience />
        <About />
        <Contact />
      </main>
    </>
  )
}
```

Replace the contents of `src/App.tsx` with:

```tsx
import { pastRituals } from './data/content'
import { useHashRoute } from './lib/useHashRoute'
import MainPage from './components/MainPage'
import RitualPage from './components/RitualPage'
import GlitchCanvas from './components/GlitchCanvas'

export default function App() {
  const slug = useHashRoute()
  const ritual = pastRituals.find((r) => r.slug === slug)

  return (
    <div id="top" className="bg-black font-geist">
      {ritual ? <RitualPage ritual={ritual} /> : <MainPage />}
      <GlitchCanvas />
    </div>
  )
}
```

- [ ] **Step 7: Run everything**

Run: `npm test` then `npm run typecheck`
Expected: all PASS, no type errors.

- [ ] **Step 8: Commit**

```bash
git add src/lib/useHashRoute.ts src/lib/useHashRoute.test.ts src/components/RitualPage.tsx src/components/RitualPage.test.tsx src/components/MainPage.tsx src/App.tsx src/App.test.tsx
git commit -m "feat: add hash-routed ritual gallery pages and assemble new sections"
```

---

### Task 6: Copy pass, The Rig, nav, and secondary signup

**Files:**
- Modify: `src/data/content.ts`, `src/components/Experience.tsx`, `src/components/Contact.tsx`
- Test (modify): `src/data/content.test.ts`, `src/components/Hero.test.tsx`, `src/components/Nav.test.tsx`, `src/components/sections.test.tsx`, `src/components/Contact.test.tsx`, `src/App.test.tsx`

**Interfaces:**
- Consumes: `<ListSignup id compact? />` from Task 2.
- Produces: section id `rig` (replacing `experience`); `rig.brings: string[]`.

- [ ] **Step 1: Update the tests first (failing)**

`src/data/content.test.ts` — replace the first two tests (`has three hero slides…` and `leads with the 16,000W production slide`) with:

```ts
  it('has three hero slides whose underline phrase appears in the text', () => {
    expect(heroSlides).toHaveLength(3)
    for (const s of heroSlides) {
      expect(s.text).toContain(s.underline)
      expect(s.target).toMatch(/^#(next|djs|rituals|rig|about|contact)$/)
    }
  })

  it('leads with the next ritual, then the rig, then the track record', () => {
    expect(heroSlides.map((s) => s.target)).toEqual(['#next', '#rig', '#rituals'])
    expect(heroSlides[1].underline).toBe('16,000W of QSC sound')
  })

  it('lists what the crew arrives with', () => {
    expect(rig.brings).toHaveLength(5)
  })
```

`src/components/Hero.test.tsx` — replace the two `expect(...)` statements in `renders CTAs targeting section anchors` (keep its comment) with:

```tsx
    expect(
      screen.getByRole('link', { name: 'Next Ritual—', hidden: true }),
    ).toHaveAttribute('href', '#next')
    expect(
      screen.getByRole('link', { name: 'Past Rituals—', hidden: true }),
    ).toHaveAttribute('href', '#rituals')
```

`src/components/Nav.test.tsx` — in the first test replace the `DJs—` and `Experience` assertions with:

```tsx
    expect(screen.getByRole('link', { name: 'Next Ritual—' })).toHaveAttribute('href', '#next')
    expect(screen.getByRole('link', { name: 'Rituals' })).toHaveAttribute('href', '#rituals')
    expect(screen.getByRole('link', { name: 'The Rig' })).toHaveAttribute('href', '#rig')
```

`src/components/sections.test.tsx` — add to the end of the first `Experience` test:

```tsx
    expect(document.getElementById('rig')).toBeInTheDocument()
    expect(screen.getByText('THE RIG')).toBeInTheDocument()
    for (const line of rig.brings) {
      expect(screen.getByText(line)).toBeInTheDocument()
    }
```

and replace the `About` test body with:

```tsx
    render(<About />)
    expect(screen.getByText(/founded by a group of friends/)).toBeInTheDocument()
    expect(screen.getByText(/national headliners/)).toBeInTheDocument()
    expect(screen.getByText('This is how we think it should be done.')).toBeInTheDocument()
```

`src/components/Contact.test.tsx` — add:

```tsx
  it('leads with MAKE CONTACT and repeats the list signup', () => {
    render(<Contact />)
    expect(screen.getByText('MAKE CONTACT')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'GET ON THE LIST —' })).toBeInTheDocument()
  })
```

`src/App.test.tsx` — in the section-order assertion change `'experience'` to `'rig'`.

Run: `npm test` — Expected: FAIL in each modified file.

- [ ] **Step 2: Rewrite the copy in `src/data/content.ts`**

Add `brings: string[]` to the `Rig` interface (between `items` and `pullStat`). Replace the `heroSlides`, `heroFooter`, `rig`, `about`, `navLinks`, and `menuLinks` constants with:

```ts
export const heroSlides: HeroSlide[] = [
  {
    text: 'The next ritual is coming to Tampa Bay — location disclosed 48 hours prior, to the list and nowhere else.',
    underline: 'location disclosed 48 hours prior',
    cta: 'Next Ritual—',
    target: '#next',
  },
  {
    text: 'Full-stack event production — 16,000W of QSC sound, lights, and reactive visuals. You bring the room. We bring everything else.',
    underline: '16,000W of QSC sound',
    cta: 'The Rig—',
    target: '#rig',
  },
  {
    text: 'Two rituals, two cities, thousand-cap rooms at 80% and up — national headliners, booked and produced in-house.',
    underline: 'thousand-cap rooms at 80% and up',
    cta: 'Past Rituals—',
    target: '#rituals',
  },
]

export const heroFooter: HeroFooter = {
  before: 'Full-stack event production for the underground — ',
  underline: 'talent, sound, lights, and visuals',
  after: ', with professional photo and video of every ritual.',
  secondLine: 'We book it. We build it. We fill it.',
  markers: ['SR', '33⅓', 'HZ'],
  rightLines: ['Event Production', 'Static Ritual'],
}

export const rig: Rig = {
  items: [
    { label: '4× QSC K12.2 tops', detail: '2,000 W each', watts: 8000 },
    { label: '2× QSC KS118 18″ subs', detail: '4,000 W each', watts: 8000 },
    { label: 'Lighting rig', detail: 'beams / wash / strobe', watts: 0 },
    { label: 'Live visuals', detail: 'reactive projection', watts: 0 },
  ],
  brings: [
    'Full PA — tops and subs, tuned to the room',
    'Lighting rig',
    'Reactive live visuals',
    'Photographer and videographer, all night',
    'Our own crew for load-in and load-out',
  ],
  pullStat: '16,000 WATTS OF INTENT',
}

export const about: About = {
  paragraph:
    "Static Ritual was founded by a group of friends with deep roots in the music industry. We're a full-stack production crew: we book the talent, haul in 16,000 watts of our own sound, rig the lights and reactive visuals, and keep a photographer on the floor all night. We've put national headliners in front of thousand-cap rooms in Nashville and Asheville. Hand us a room and we hand back a night people talk about — dnb, tech house, trap, dubstep, UK bass, reggae, techno. We're here to bring back the underground.",
  pullQuote: 'This is how we think it should be done.',
}

export const navLinks: NavLink[] = [
  { label: 'Next Ritual—', target: '#next' },
  { label: 'Rituals', target: '#rituals' },
  { label: 'DJs', target: '#djs' },
  { label: 'The Rig', target: '#rig' },
]

export const menuLinks: MenuLink[] = [
  { label: 'Next Ritual', target: '#next' },
  { label: 'Past Rituals', target: '#rituals' },
  { label: 'DJs', target: '#djs' },
  { label: 'The Rig', target: '#rig' },
  { label: 'About', target: '#about' },
  { label: 'Contact', target: '#contact' },
  { label: 'SoundCloud', href: 'https://soundcloud.com/nikitashokur' },
]
```

- [ ] **Step 3: Promote Experience to The Rig**

In `src/components/Experience.tsx`: change `<Section id="experience"` to `<Section id="rig"`; change the heading `GlitchText` from `text="THE EXPERIENCE"` to `text="THE RIG"`; change the first `<h3>` label from `The Rig` to `The Stack`; and insert this block between the closing `</ul>` of the rig items and the pull-stat `GlitchText`:

```tsx
          <h3 className="text-white/50 text-xs font-mono uppercase tracking-[0.3em] mt-10 mb-6">
            We Arrive With
          </h3>
          <ul className="font-mono">
            {rig.brings.map((line) => (
              <li
                key={line}
                className="border-b border-white/10 py-3 text-white uppercase text-xs tracking-wider"
              >
                {line}
              </li>
            ))}
          </ul>
```

- [ ] **Step 4: Update Contact**

In `src/components/Contact.tsx`: add `import ListSignup from './ListSignup'`; change `text="BOOK A RITUAL"` to `text="MAKE CONTACT"`; insert directly after the heading `GlitchText`:

```tsx
        <p className="mt-6 text-white/50 text-xs font-mono uppercase tracking-[0.3em]">
          Venues. Promoters. Artists. One inbox.
        </p>
```

Then insert directly after the closing `</div>` of the SoundCloud/Instagram `flex flex-wrap` row (still inside the padded wrapper `div`):

```tsx
        <div className="mt-16 border-t border-white/10 pt-10">
          <p className="mb-6 text-white/50 text-xs font-mono uppercase tracking-[0.3em]">
            Or just get on the list
          </p>
          <ListSignup id="contact" compact />
        </div>
```

- [ ] **Step 5: Run everything**

Run: `npm test` then `npm run typecheck` then `npm run build`
Expected: all tests PASS, no type errors, build succeeds.

- [ ] **Step 6: Look at it**

Run `npm run dev`, open the printed URL, and check: section order; the Next Ritual slab reads `SAT · NOV 14 · 2026`; an invalid email shows the magenta error; a valid one shows the success line after ~0.6s; `OPEN THE ARCHIVE—` opens the gallery page and `—BACK TO THE RITUALS` returns to the Past Rituals section; nav links scroll correctly; layout holds at ~400px width.

- [ ] **Step 7: Commit**

```bash
git add src/data/content.ts src/data/content.test.ts src/components/Experience.tsx src/components/Contact.tsx src/components/Contact.test.tsx src/components/Hero.test.tsx src/components/Nav.test.tsx src/components/sections.test.tsx src/App.test.tsx
git commit -m "feat: reposition copy for venues, promote The Rig, add secondary list signup"
```

---

## Launch gates (not tasks — carried from the spec)

1. Replace the `joinList` mock in `src/lib/list.ts` with a real provider before the site reaches real fans.
2. Fill `cover` and `photos` for both past rituals with Nikita's own event photos (drop files in `public/media/`, reference as `` `${import.meta.env.BASE_URL}media/<file>` ``) before the link is sent to any venue.
3. Add the remaining lineup acts for rituals 001 and 002 once confirmed.
