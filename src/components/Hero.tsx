import { useEffect, useState } from 'react'
import { heroSlides, heroFooter } from '../data/content'
import GlitchText from './GlitchText'

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_135039_b04d00db-6ee2-4e2a-a7f5-b2dfd3d24fd2.mp4'

const BADGE_TEXT = 'SOUND • LIGHTS • VISUALS • RITUAL • '

export default function Hero() {
  const [active, setActive] = useState(0)

  // Re-created whenever `active` changes, so a dot click resets the 5s window.
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % heroSlides.length), 5000)
    return () => clearInterval(t)
  }, [active])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      <div className="relative z-10 flex flex-col h-full px-5 sm:px-8 md:px-12 lg:px-16 pt-24">
        <div className="flex-1 flex items-center">
          <div className="w-full flex items-start justify-center md:justify-end md:mr-16 lg:mr-24 px-1 sm:px-0">
            <div className="hidden md:flex items-start mr-6 lg:mr-10 -mt-8 shrink-0">
              <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
                <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md" />
                <svg className="animate-spin-slow w-full h-full" viewBox="0 0 200 200">
                  <defs>
                    <path id="badge-circle" d="M100,30 a70,70 0 1,1 -0.1,0" />
                  </defs>
                  <text className="fill-white/80" fontSize="10" fontWeight="300" letterSpacing="3">
                    <textPath href="#badge-circle">{BADGE_TEXT}</textPath>
                  </text>
                </svg>
              </div>
            </div>

            <div className="max-w-2xl relative">
              {heroSlides.map((s, i) => {
                const [before, after] = s.text.split(s.underline)
                return (
                  <div
                    key={s.cta}
                    data-testid={`hero-slide-${i}`}
                    aria-hidden={i !== active}
                    className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      i === active
                        ? 'opacity-100 translate-y-0 relative'
                        : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'
                    }`}
                  >
                    <GlitchText text={s.text} className="block">
                      <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-[2.1rem] font-light leading-[1.45] tracking-tight">
                        {before}
                        <span className="underline underline-offset-4 decoration-white/60">
                          {s.underline}
                        </span>
                        {after}
                      </h1>
                    </GlitchText>
                    <a
                      href={s.target}
                      className="inline-block mt-6 sm:mt-8 text-white text-xs sm:text-sm font-light tracking-wide hover:opacity-70 transition-opacity duration-300"
                    >
                      {s.cta}
                    </a>
                  </div>
                )
              })}

              <div className="flex items-center gap-2 mt-8 sm:mt-10">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-500 ${
                      i === active ? 'bg-white scale-100' : 'bg-white/40 scale-90 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pb-5 sm:pb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            {heroFooter.markers.map((m) => (
              <span key={m} className="text-white/50 text-[10px] sm:text-xs font-light">
                {m}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-0 border-t border-white/10 pt-4">
            <p className="text-white/40 text-[9px] sm:text-[10px] md:text-xs font-light leading-relaxed max-w-md">
              {heroFooter.before}
              <span className="underline underline-offset-2 decoration-white/30">
                {heroFooter.underline}
              </span>
              {heroFooter.after}
              <br className="hidden sm:block" /> {heroFooter.secondLine}
            </p>
            <div className="sm:text-right text-white/40 text-[9px] sm:text-[10px] md:text-xs font-light uppercase tracking-wider">
              {heroFooter.rightLines.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
