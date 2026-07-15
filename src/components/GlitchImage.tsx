import { useEffect, useState } from 'react'

interface Props {
  src: string | null
  alt: string
  className?: string
}

export default function GlitchImage({ src, alt, className = '' }: Props) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return <div data-testid="dj-placeholder" aria-label={alt} className={`duotone-placeholder ${className}`} />
  }

  return (
    <div className={`glitch-image ${className}`}>
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
      />
      <img src={src} alt="" aria-hidden className="glitch-image-ghost ghost-a" />
      <img src={src} alt="" aria-hidden className="glitch-image-ghost ghost-b" />
    </div>
  )
}
