import { describe, it, expect } from 'vitest'
import { heroSlides, djs, rig, genres, about, contact } from './content'

describe('content data', () => {
  it('has three hero slides whose underline phrase appears in the text', () => {
    expect(heroSlides).toHaveLength(3)
    for (const s of heroSlides) {
      expect(s.text).toContain(s.underline)
      expect(s.target).toMatch(/^#(djs|experience|about|contact)$/)
    }
  })

  it('leads with the 16,000W production slide', () => {
    expect(heroSlides[0].underline).toBe('16,000W of QSC sound')
  })

  it('rig wattage totals 16,000', () => {
    expect(rig.items.reduce((sum, i) => sum + i.watts, 0)).toBe(16000)
    expect(rig.pullStat).toBe('16,000 WATTS OF INTENT')
  })

  it('features exactly CR//SPY with the real photo and SoundCloud link', () => {
    const featured = djs.filter((d) => d.featured)
    expect(featured).toHaveLength(1)
    expect(featured[0].name).toBe('CR//SPY')
    expect(featured[0].image).toBe('/media/crspy.png')
    expect(featured[0].soundcloud).toBe('https://soundcloud.com/nikitashokur')
    expect(djs.filter((d) => d.image === null)).toHaveLength(5)
  })

  it('lists all seven genres', () => {
    expect(genres).toEqual(['DNB', 'TECH HOUSE', 'TRAP', 'DUBSTEP', 'UK BASS', 'REGGAE', 'TECHNO'])
  })

  it('books to the right email and keeps Instagram a placeholder', () => {
    expect(contact.email).toBe('nikshokur@gmail.com')
    expect(contact.instagramIsPlaceholder).toBe(true)
    expect(about.pullQuote).toBe('This is how we think it should be done.')
  })
})
