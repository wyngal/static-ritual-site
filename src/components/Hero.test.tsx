import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Hero from './Hero'

describe('Hero carousel', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows slide 0 first and rotates after 5 seconds', () => {
    render(<Hero />)
    expect(screen.getByTestId('hero-slide-0')).toHaveAttribute('aria-hidden', 'false')
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('hero-slide-1')).toHaveAttribute('aria-hidden', 'false')
    expect(screen.getByTestId('hero-slide-0')).toHaveAttribute('aria-hidden', 'true')
  })

  it('jumps to a slide when its dot is clicked and resets the timer', () => {
    render(<Hero />)
    fireEvent.click(screen.getByLabelText('Go to slide 3'))
    expect(screen.getByTestId('hero-slide-2')).toHaveAttribute('aria-hidden', 'false')
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('hero-slide-0')).toHaveAttribute('aria-hidden', 'false')
  })

  it('renders CTAs targeting section anchors', () => {
    render(<Hero />)
    // `hidden: true` includes links inside non-active slides, which carry
    // aria-hidden="true" (asserted by the tests above) and are therefore
    // excluded from the default accessibility-tree query.
    expect(
      screen.getByRole('link', { name: 'The Experience—', hidden: true }),
    ).toHaveAttribute('href', '#experience')
    expect(
      screen.getByRole('link', { name: 'Book a Ritual—', hidden: true }),
    ).toHaveAttribute('href', '#contact')
  })
})
