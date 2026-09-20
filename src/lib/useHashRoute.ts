import { useEffect, useState } from 'react'

// Only hashes starting with "#/" are routes; plain anchors like "#djs" stay in-page links.
export function parseRitualSlug(hash: string): string | null {
  const match = hash.match(/^#\/ritual\/([a-z0-9-]+)$/)
  return match ? match[1] : null
}

export function useHashRoute(): string | null {
  const [slug, setSlug] = useState(() => parseRitualSlug(window.location.hash))

  useEffect(() => {
    const onChange = () => setSlug(parseRitualSlug(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return slug
}
