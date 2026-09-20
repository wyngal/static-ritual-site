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
