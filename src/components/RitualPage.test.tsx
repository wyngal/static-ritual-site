import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import RitualPage from './RitualPage'
import { pastRituals, PastRitual } from '../data/content'

describe('RitualPage', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })
  afterEach(() => vi.restoreAllMocks())

  it('shows the ritual header data and a link back to the main page', () => {
    render(<RitualPage ritual={pastRituals[0]} />)
    expect(screen.getByText('RITUAL 002')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'NASHVILLE, TN' })).toBeInTheDocument()
    expect(screen.getByText('~800 / 1,000 CAP')).toBeInTheDocument()
    expect(screen.getByText(/Yung Gravy/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /BACK TO THE RITUALS/ })).toHaveAttribute(
      'href',
      '#rituals',
    )
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('says the archive is still developing when there are no photos', () => {
    render(<RitualPage ritual={pastRituals[0]} />)
    expect(screen.getByText('ARCHIVE STILL DEVELOPING.')).toBeInTheDocument()
  })

  it('renders every photo when present', () => {
    const ritual: PastRitual = { ...pastRituals[0], photos: ['/a.jpg', '/b.jpg'] }
    render(<RitualPage ritual={ritual} />)
    expect(screen.getAllByRole('img', { name: /NASHVILLE, TN — photo/ })).toHaveLength(2)
    expect(screen.queryByText('ARCHIVE STILL DEVELOPING.')).toBeNull()
  })
})
