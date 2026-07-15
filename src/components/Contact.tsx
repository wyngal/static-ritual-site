import { Instagram, ArrowUpRight } from 'lucide-react'
import { contact } from '../data/content'
import Section from './Section'
import GlitchText from './GlitchText'
import { SoundCloudIcon } from './icons'

export default function Contact() {
  const handle = contact.instagram.replace(/^@/, '')
  return (
    <Section id="contact" className="pt-24 sm:pt-32">
      <div className="px-5 sm:px-8 md:px-12 lg:px-16">
        <GlitchText
          text="BOOK A RITUAL"
          ambient
          className="text-white text-5xl sm:text-7xl md:text-8xl font-light tracking-tight"
        />
        <div className="mt-8">
          <a
            href={`mailto:${contact.email}`}
            className="inline-block text-white text-sm sm:text-base font-light tracking-wide hover:opacity-70 transition-opacity duration-300"
          >
            {contact.email}—
          </a>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-8">
          <a
            href={contact.soundcloud}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-light transition-colors duration-300"
          >
            <SoundCloudIcon /> SoundCloud <ArrowUpRight size={12} />
          </a>
          {contact.instagramIsPlaceholder ? (
            <span className="inline-flex items-center gap-1.5 text-white/40 text-xs font-light">
              <Instagram size={14} /> {contact.instagram}
            </span>
          ) : (
            <a
              href={`https://instagram.com/${handle}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-light transition-colors duration-300"
            >
              <Instagram size={14} /> {contact.instagram} <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      </div>

      <div className="mt-20 overflow-hidden border-t border-white/10 py-4" aria-hidden>
        <div className="marquee-track whitespace-nowrap text-white/30 text-xl font-light">
          <span>{'STATIC RITUAL — '.repeat(10)}</span>
          <span>{'STATIC RITUAL — '.repeat(10)}</span>
        </div>
      </div>
      <p className="px-5 sm:px-8 md:px-12 lg:px-16 py-6 text-white/30 text-[10px] font-light uppercase tracking-wider">
        © 2026 Static Ritual — Live Audio Production
      </p>
    </Section>
  )
}
