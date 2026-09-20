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
