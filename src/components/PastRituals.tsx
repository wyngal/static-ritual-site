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
