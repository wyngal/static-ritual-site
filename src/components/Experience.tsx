import { rig, genres, mediaLine } from '../data/content'
import Section from './Section'
import GlitchText from './GlitchText'

export default function Experience() {
  return (
    <Section id="rig" className="px-5 sm:px-8 md:px-12 lg:px-16 py-24 sm:py-32">
      <GlitchText
        text="THE RIG"
        ambient
        className="text-white text-4xl sm:text-6xl md:text-7xl font-light tracking-tight"
      />
      <div className="mt-10 sm:mt-16 grid md:grid-cols-2 gap-16">
        <div>
          <h3 className="text-white/50 text-xs font-mono uppercase tracking-[0.3em] mb-6">
            The Stack
          </h3>
          <ul className="font-mono">
            {rig.items.map((item) => (
              <li key={item.label} className="flex justify-between gap-4 border-b border-white/10 py-3">
                <span className="text-white uppercase text-xs tracking-wider">{item.label}</span>
                <span className="text-white/50 text-xs">{item.detail}</span>
              </li>
            ))}
          </ul>
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
            {mediaLine}
          </p>
        </div>
      </div>
    </Section>
  )
}
