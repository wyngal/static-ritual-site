import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  beforeAll(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    window.location.hash = ''
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('renders all anchored sections in order', () => {
    render(<App />)
    const ids = Array.from(document.querySelectorAll('main section[id]')).map((s) => s.id)
    expect(ids).toEqual(['next', 'djs', 'rituals', 'rig', 'about', 'contact'])
  })

  it('renders the nav and the grain layer', () => {
    render(<App />)
    // Logo text exists in both nav bar and menu overlay — query the unique logo link.
    expect(screen.getByRole('link', { name: /Static Ritual/ })).toHaveAttribute('href', '#top')
    // jsdom has no WebGL, so GlitchCanvas renders its static fallback here.
    expect(screen.getByTestId('grain-fallback')).toBeInTheDocument()
  })

  it('renders a ritual gallery page on a ritual route, without the one-pager', () => {
    window.location.hash = '#/ritual/asheville'
    render(<App />)
    expect(screen.getByRole('heading', { name: 'ASHEVILLE, NC' })).toBeInTheDocument()
    expect(document.getElementById('djs')).toBeNull()
    expect(screen.getByTestId('grain-fallback')).toBeInTheDocument()
  })

  it('falls back to the main page for plain anchors and unknown slugs', () => {
    window.location.hash = '#/ritual/nowhere'
    const { unmount } = render(<App />)
    expect(document.getElementById('djs')).toBeInTheDocument()
    unmount()
    window.location.hash = '#djs'
    render(<App />)
    expect(document.getElementById('djs')).toBeInTheDocument()
  })
})
