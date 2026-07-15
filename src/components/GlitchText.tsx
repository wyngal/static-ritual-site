import { ReactNode, useEffect, useState } from 'react'

interface Props {
  text: string
  children?: ReactNode
  className?: string
  ambient?: boolean
}

export default function GlitchText({ text, children, className = '', ambient = false }: Props) {
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    if (!ambient || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let start = 0
    let stop = 0
    const schedule = () => {
      start = window.setTimeout(() => {
        setGlitching(true)
        stop = window.setTimeout(() => {
          setGlitching(false)
          schedule()
        }, 300)
      }, 4000 + Math.random() * 5000)
    }
    schedule()
    return () => {
      clearTimeout(start)
      clearTimeout(stop)
    }
  }, [ambient])

  return (
    <span data-text={text} className={`glitch-text ${glitching ? 'glitching' : ''} ${className}`}>
      {children ?? text}
    </span>
  )
}
