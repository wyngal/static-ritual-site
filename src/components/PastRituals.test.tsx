import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import PastRituals from './PastRituals'
import CapacityBar from './CapacityBar'

describe('CapacityBar', () => {
  it('derives the percentage and formats the counts', () => {
    render(<CapacityBar attendance={800} capacity={1000} />)
    expect(screen.getByRole('img', { name: '80% of capacity' })).toBeInTheDocument()
    expect(screen.getByText('80%')).toBeInTheDocument()
    expect(screen.getByText('~800 / 1,000 CAP')).toBeInTheDocument()
  })
})

describe('PastRituals', () => {
  it('renders one band per ritual, newest first', () => {
    render(<PastRituals />)
    expect(document.getElementById('rituals')).toBeInTheDocument()
    const bands = screen.getAllByRole('article')
    expect(bands).toHaveLength(2)
    expect(within(bands[0]).getByText('NASHVILLE, TN')).toBeInTheDocument()
    expect(within(bands[1]).getByText('ASHEVILLE, NC')).toBeInTheDocument()
  })

  it('shows date, headliner, capacity, quote, and a gallery link per band', () => {
    render(<PastRituals />)
    const [nashville, asheville] = screen.getAllByRole('article')
    expect(within(nashville).getByText('RITUAL 002')).toBeInTheDocument()
    expect(within(nashville).getByText('AUG 2025')).toBeInTheDocument()
    expect(within(nashville).getByText('Yung Gravy')).toBeInTheDocument()
    expect(within(nashville).getByText('80%')).toBeInTheDocument()
    expect(within(nashville).getByText('~800 / 1,000 CAP')).toBeInTheDocument()
    // Regex: the quote is wrapped in curly quotation marks.
    expect(within(nashville).getByText(/The floor never cleared/)).toBeInTheDocument()
    expect(within(nashville).getByRole('link', { name: /OPEN THE ARCHIVE/ })).toHaveAttribute(
      'href',
      '#/ritual/nashville',
    )
    expect(within(asheville).getByText('90%')).toBeInTheDocument()
    expect(within(asheville).getByText('~990 / 1,100 CAP')).toBeInTheDocument()
  })

  it('never names a venue', () => {
    const { container } = render(<PastRituals />)
    expect(container.textContent).not.toMatch(/cannery|orange peel/i)
  })
})
