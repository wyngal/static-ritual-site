import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Nav from './Nav'

describe('Nav', () => {
  it('renders logo and desktop anchor links', () => {
    render(<Nav />)
    // NOTE: "Static Ritual" text appears twice (nav bar + menu overlay header),
    // so target the unique logo link, not getByText.
    expect(screen.getByRole('link', { name: /Static Ritual/ })).toHaveAttribute('href', '#top')
    expect(screen.getByRole('link', { name: 'DJs—' })).toHaveAttribute('href', '#djs')
    expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute('href', '#experience')
  })

  it('opens and closes the mobile menu, locking body scroll', () => {
    render(<Nav />)
    fireEvent.click(screen.getByLabelText('Open menu'))
    expect(document.body.style.overflow).toBe('hidden')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
    fireEvent.click(screen.getByLabelText('Close menu'))
    expect(document.body.style.overflow).toBe('')
    expect(screen.getByLabelText('Open menu')).toHaveFocus()
  })

  it('links SoundCloud externally in the menu', () => {
    render(<Nav />)
    fireEvent.click(screen.getByLabelText('Open menu'))
    const sc = screen.getByRole('link', { name: 'SoundCloud' })
    expect(sc).toHaveAttribute('href', 'https://soundcloud.com/nikitashokur')
    expect(sc).toHaveAttribute('target', '_blank')
  })
})
