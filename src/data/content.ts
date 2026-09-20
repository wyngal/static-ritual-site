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
  brings: string[]
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

export const djs: DJ[] = [
  {
    name: 'CR//SPY',
    genres: ['dnb', 'dubstep', 'trap'],
    image: `${import.meta.env.BASE_URL}media/crspy.png`,
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

export const genres: string[] = [
  'DNB',
  'TECH HOUSE',
  'TRAP',
  'DUBSTEP',
  'UK BASS',
  'REGGAE',
  'TECHNO',
]

export const mediaLine =
  'Professional photography and videography of every event — every ritual documented.'

export const about: About = {
  paragraph:
    "Static Ritual was founded by a group of friends with deep roots in the music industry. We're a full-stack production crew: we book the talent, haul in 16,000 watts of our own sound, rig the lights and reactive visuals, and keep a photographer on the floor all night. We've put national headliners in front of thousand-cap rooms in Nashville and Asheville. Hand us a room and we hand back a night people talk about — dnb, tech house, trap, dubstep, UK bass, reggae, techno. We're here to bring back the underground.",
  pullQuote: 'This is how we think it should be done.',
}

export const contact: Contact = {
  email: 'nikshokur@gmail.com',
  soundcloud: 'https://soundcloud.com/nikitashokur',
  instagram: '@static.ritual',
  instagramIsPlaceholder: true,
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
