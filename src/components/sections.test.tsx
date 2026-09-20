import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Experience from './Experience'
import About from './About'
import { genres, rig } from '../data/content'

describe('Experience', () => {
  it('shows the 16,000 watt pull stat and every rig item', () => {
    render(<Experience />)
    expect(screen.getByText('16,000 WATTS OF INTENT')).toBeInTheDocument()
    for (const item of rig.items) {
      // getAllByText: some rig item labels also appear verbatim in the
      // "We Arrive With" list (e.g. "Lighting rig"), so more than one match is valid.
      expect(screen.getAllByText(item.label).length).toBeGreaterThan(0)
    }
    expect(document.getElementById('rig')).toBeInTheDocument()
    expect(screen.getByText('THE RIG')).toBeInTheDocument()
    for (const line of rig.brings) {
      expect(screen.getAllByText(line).length).toBeGreaterThan(0)
    }
  })

  it('renders the full genre wall and the media coverage line', () => {
    render(<Experience />)
    for (const g of genres) {
      expect(screen.getByText(g)).toBeInTheDocument()
    }
    expect(screen.getByText(/photography/i)).toBeInTheDocument()
  })
})

describe('About', () => {
  it('renders the founding story and pull quote', () => {
    render(<About />)
    expect(screen.getByText(/founded by a group of friends/)).toBeInTheDocument()
    expect(screen.getByText(/national headliners/)).toBeInTheDocument()
    expect(screen.getByText('This is how we think it should be done.')).toBeInTheDocument()
  })
})
