import { useEffect, useState } from 'react'
import Nav from './Nav'
import Hero from './Hero'
import NextRitual from './NextRitual'
import DJGrid from './DJGrid'
import PastRituals from './PastRituals'
import Experience from './Experience'
import About from './About'
import Contact from './Contact'

export default function MainPage() {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    document.querySelectorAll('main section[id]').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // Arriving from a gallery page via "#rituals": the browser tried to jump before
  // this page had rendered, so finish the jump now. (jsdom has no scrollIntoView.)
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id && !id.startsWith('/')) document.getElementById(id)?.scrollIntoView?.()
  }, [])

  return (
    <>
      <Nav activeId={activeId} />
      <main>
        <Hero />
        <NextRitual />
        <DJGrid />
        <PastRituals />
        <Experience />
        <About />
        <Contact />
      </main>
    </>
  )
}
