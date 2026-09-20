# Static Ritual — Venue Repositioning Design

Date: 2026-09-20
Status: awaiting review

## Purpose

The site is a credibility artifact. Static Ritual handles all venue
communication directly and attaches the site link; nobody is converted on
the page itself. It has to pass two sniff tests at once:

- **Venue owners (primary):** are these people a real production company
  with the equipment, talent, and draw to run my room?
- **Underground EDM fans (secondary):** what is the next event?

Posture: a pop-up underground outfit that always has a night about to
drop. Copy is underground rave voice; the upcoming event is shrouded in
some mystery.

## Page structure

`/` remains a single page. Section order:

| # | Section | Status |
|---|---------|--------|
| 1 | Hero | existing, recopied |
| 2 | Next Ritual | **new** |
| 3 | Roster | existing `DJGrid` |
| 4 | Past Rituals | **new** |
| 5 | The Rig | existing `Experience`, promoted to full spec |
| 6 | About | existing, recopied |
| 7 | Contact | existing, plus secondary list signup |

Narrative: Next Ritual names the lineup, Roster shows who they are, Past
Rituals proves they draw, The Rig proves execution.

Nav and menu links gain `Next Ritual` and `Past Rituals`.

## Next Ritual

The largest slab on the page.

- `RITUAL 003 · TAMPA BAY · SAT NOV 14 2026`
- `LOCATION DISCLOSED 48HRS PRIOR — TO THE LIST ONLY.`
- Lineup (roster names), rig line (`16,000W · FULL LIGHT + VISUAL RIG`)
- Primary action: THE LIST signup (below)

The venue is never filled in with a fake room. While venues in Tampa and
St. Petersburg are being pitched, the undisclosed location is literally
true.

## THE LIST (email signup)

The list is the only way to receive the location. It appears twice:
primary inside Next Ritual, quieter repeat in Contact.

- Single email field + `GET ON THE LIST —` button
- Microcopy: `No spam. No flyers. Coordinates only.`
- Success state: `YOU'RE ON THE LIST. WATCH YOUR INBOX. TELL NO ONE.`
- Invalid email: inline error in voice, field keeps focus
- Submit failure: inline retry message; the entered email is preserved

**Backend is mocked.** All submission goes through one function,
`joinList(email): Promise<void>` in `src/lib/list.ts`, which currently
resolves after a short delay and stores nothing. Swapping in a real
provider (Mailchimp, Buttondown, etc.) before launch is a change to that
one function. **Launch gate:** the site must not go to real fans with the
mock in place, since signups would be silently discarded.

## Past Rituals

Full-page-width bands, one per event, newest on top. Not a card grid.
Separate from Next Ritual.

| Ritual | City | Date | Attendance | Capacity | Headliner |
|--------|------|------|-----------|----------|-----------|
| 002 | Nashville, TN | Aug 2025 | ~800 | 1,000 | Yung Gravy |
| 001 | Asheville, NC | Jun 2024 | ~990 | 1,100 | Yung Gravy |

Capacities: Cannery Ballroom 1,000 (80%), The Orange Peel 1,100 (90%).
Venue names and event names are **not** shown; city only.

Each band shows: ritual number, city, date, headliner, lineup, capacity
bar (filled rail, percentage, `~800 / 1,000 CAP`), a one-line pull quote,
a large photo, and a link to its gallery page.

Lineups currently: headliner + `CR//SPY`. Remaining acts to be supplied by
Nikita; until then the lineup lists only confirmed names, with no
invented ones.

## Ritual gallery pages

Hash routes: `/#/ritual/nashville`, `/#/ritual/asheville`.

Hash routing is used because it needs no server rewrites and works under
the existing subpath (`BASE_URL`) hosting. Implemented with a small
`useHashRoute` hook, no router dependency. Existing in-page anchors
(`#djs`, `#contact`) keep working: only hashes beginning `#/` are routes.

Each page is thin: a header slab repeating the band data, full-width
photos, one link back to `/`. No nav, no other sections. Unknown slugs
fall back to the main page.

## Data model

All content stays in `src/data/content.ts`.

```ts
interface PastRitual {
  number: string        // '002'
  slug: string          // 'nashville'
  city: string          // 'NASHVILLE, TN'
  date: string          // 'AUG 2025'
  attendance: number
  capacity: number
  headliner: string
  lineup: string[]
  quote: string
  cover: string | null  // null renders the placeholder treatment
  photos: string[]
}

interface NextRitual {
  number: string        // '003'
  region: string        // 'TAMPA BAY'
  date: string          // ISO, '2026-11-14'
  lineup: string[]
  rigLine: string
}
```

Percentage is derived from attendance / capacity, never stored.

## Imagery

Nikita will supply real photos of both events. Until then, `cover: null`
and empty `photos` render an obvious glitch-styled placeholder block (the
existing `GlitchImage` null treatment), so no stock or third-party
copyrighted image ships. **Launch gate:** real photos in place before the
link is sent to any venue.

## Copy pass

Hero, About, and Contact keep the underground voice but add operational
weight: what the crew brings (PA, lights, visuals, photographer), that it
has booked national headliners into 1,000-cap rooms, and the primary CTA
language moves from "Book a Ritual" to list/next-ritual language. Hero
slides are rewritten around: next ritual, the rig, the track record.

## Testing

Vitest + Testing Library, matching existing tests:

- `content.test.ts`: past rituals sorted newest-first; attendance ≤
  capacity; slugs unique
- Next Ritual: renders date, region, disclosure line
- Signup: invalid email blocked; success state shown after `joinList`
  resolves; error state on rejection preserves input
- Past Rituals: bands render in order with derived percentage
- Hash route: `#/ritual/nashville` renders gallery; `#djs` and unknown
  slugs render the main page

## Out of scope

Real email provider, ticketing, a venue-facing `/venues` dossier, The
Estate as a listed event.
