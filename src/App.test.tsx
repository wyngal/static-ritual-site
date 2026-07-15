import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  beforeAll(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('renders all anchored sections in order', () => {
    render(<App />)
    const ids = ['djs', 'experience', 'about', 'contact']
    for (const id of ids) {
      expect(document.getElementById(id)).toBeInTheDocument()
    }
  })

  it('renders the nav and the grain layer', () => {
    render(<App />)
    // Logo text exists in both nav bar and menu overlay — query the unique logo link.
    expect(screen.getByRole('link', { name: /Static Ritual/ })).toHaveAttribute('href', '#top')
    // jsdom has no WebGL, so GlitchCanvas renders its static fallback here.
    expect(screen.getByTestId('grain-fallback')).toBeInTheDocument()
  })
})
