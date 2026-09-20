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
