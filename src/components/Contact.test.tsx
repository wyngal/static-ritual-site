import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Contact from './Contact'

describe('Contact', () => {
  it('books via mailto', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: /nikshokur@gmail\.com/ })).toHaveAttribute(
      'href',
      'mailto:nikshokur@gmail.com',
    )
  })

  it('links SoundCloud externally', () => {
    render(<Contact />)
    const sc = screen.getByRole('link', { name: /soundcloud/i })
    expect(sc).toHaveAttribute('href', 'https://soundcloud.com/nikitashokur')
    expect(sc).toHaveAttribute('target', '_blank')
  })

  it('shows Instagram as a non-link placeholder', () => {
    render(<Contact />)
    expect(screen.getByText('@static.ritual')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /@static\.ritual/ })).toBeNull()
  })

  it('shows the fine print', () => {
    render(<Contact />)
    expect(screen.getByText('© 2026 Static Ritual — Live Audio Production')).toBeInTheDocument()
  })

  it('leads with MAKE CONTACT and repeats the list signup', () => {
    render(<Contact />)
    expect(screen.getByText('MAKE CONTACT')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'GET ON THE LIST —' })).toBeInTheDocument()
  })
})
