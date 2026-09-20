import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NextRitual from './NextRitual'

describe('NextRitual', () => {
  it('announces ritual 003 with date, region, and the disclosure line', () => {
    render(<NextRitual />)
    expect(document.getElementById('next')).toBeInTheDocument()
    expect(screen.getByText('RITUAL 003')).toBeInTheDocument()
    expect(screen.getByText('TAMPA BAY')).toBeInTheDocument()
    expect(screen.getByText('SAT · NOV 14 · 2026')).toBeInTheDocument()
    expect(
      screen.getByText('LOCATION DISCLOSED 48HRS PRIOR — TO THE LIST ONLY.'),
    ).toBeInTheDocument()
  })

  it('shows the lineup, the rig line, and the list signup', () => {
    render(<NextRitual />)
    expect(screen.getByText('CR//SPY')).toBeInTheDocument()
    expect(screen.getByText('MORE NAMES UNVEILED CLOSER TO THE NIGHT')).toBeInTheDocument()
    expect(screen.getByText('16,000W · FULL LIGHT + VISUAL RIG')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'GET ON THE LIST —' })).toBeInTheDocument()
  })
})
