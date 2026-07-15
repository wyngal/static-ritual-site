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
