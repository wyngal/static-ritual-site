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
