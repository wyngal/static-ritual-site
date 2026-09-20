import { pastRituals } from './data/content'
import { useHashRoute } from './lib/useHashRoute'
import MainPage from './components/MainPage'
import RitualPage from './components/RitualPage'
import GlitchCanvas from './components/GlitchCanvas'

export default function App() {
  const slug = useHashRoute()
  const ritual = pastRituals.find((r) => r.slug === slug)

  return (
    <div id="top" className="bg-black font-geist">
      {ritual ? <RitualPage ritual={ritual} /> : <MainPage />}
      <GlitchCanvas />
    </div>
  )
}
