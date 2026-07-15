import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import DJGrid from './components/DJGrid'
import Experience from './components/Experience'
import About from './components/About'
import Contact from './components/Contact'
import GlitchCanvas from './components/GlitchCanvas'

export default function App() {
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

  return (
    <div id="top" className="bg-black font-geist">
      <Nav activeId={activeId} />
      <main>
        <Hero />
        <DJGrid />
        <Experience />
        <About />
        <Contact />
      </main>
      <GlitchCanvas />
    </div>
  )
}
