import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navLinks, menuLinks, contact } from '../data/content'

interface Props {
  activeId?: string
}

export default function Nav({ activeId = '' }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16 pt-6 sm:pt-8">
        <a href="#top" className="text-white text-lg sm:text-xl font-medium tracking-tight">
          Static Ritual<span className="text-[10px] align-super ml-0.5">°</span>
        </a>
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((l) => (
            <a
              key={l.target}
              href={l.target}
              className={`text-sm font-light tracking-wide transition-opacity duration-300 hover:opacity-70 ${
                activeId === l.target.slice(1) ? 'text-white' : 'text-white/60'
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-white/60 transition-colors duration-300"
        >
          <Menu size={15} />
        </button>
      </nav>

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setOpen(false)} />
        <div
          className={`relative z-10 flex flex-col h-full px-8 pt-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? 'translate-y-0' : '-translate-y-8'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white text-lg sm:text-xl font-medium tracking-tight">
              Static Ritual<span className="text-[10px] align-super ml-0.5">°</span>
            </span>
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-white/60 transition-colors duration-300"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            {menuLinks.map((l, i) => (
              <a
                key={l.label}
                href={l.href ?? l.target}
                {...(l.href ? { target: '_blank', rel: 'noreferrer' } : {})}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: `${150 + i * 75}ms` }}
                className={`text-white text-4xl sm:text-5xl font-light tracking-tight py-3 hover:opacity-60 transition-all duration-500 ${
                  open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
          <div
            style={{ transitionDelay: '450ms' }}
            className={`border-t border-white/10 py-6 transition-opacity duration-500 ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <a href={`mailto:${contact.email}`} className="text-white/40 text-xs font-light">
              {contact.email}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
