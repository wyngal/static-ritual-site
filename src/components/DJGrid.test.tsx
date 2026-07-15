import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DJGrid from './DJGrid'
import { djs } from '../data/content'

describe('DJGrid', () => {
  it('renders every DJ tile', () => {
    render(<DJGrid />)
    for (const dj of djs) {
      expect(screen.getByText(dj.name)).toBeInTheDocument()
    }
  })

  it('gives CR//SPY the real photo and a SoundCloud link', () => {
    render(<DJGrid />)
    expect(screen.getByAltText('CR//SPY')).toHaveAttribute('src', '/media/crspy.png')
    expect(screen.getByLabelText('CR//SPY on SoundCloud')).toHaveAttribute(
      'href',
      'https://soundcloud.com/nikitashokur',
    )
  })

  it('renders duotone placeholders for the five placeholder DJs', () => {
    render(<DJGrid />)
    expect(screen.getAllByTestId('dj-placeholder')).toHaveLength(5)
  })
})
