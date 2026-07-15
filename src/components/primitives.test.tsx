import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import GlitchText from './GlitchText'
import GlitchImage from './GlitchImage'
import Section from './Section'

type MockIO = {
  instances: Array<{
    callback: (entries: Array<{ isIntersecting: boolean; target: Element }>, io: unknown) => void
  }>
}

describe('GlitchText', () => {
  it('exposes ghost copies via data-text and renders its text', () => {
    render(<GlitchText text="THE ROSTER" />)
    const el = screen.getByText('THE ROSTER')
    expect(el).toHaveAttribute('data-text', 'THE ROSTER')
    expect(el.className).toContain('glitch-text')
  })

  it('renders rich children while keeping plain data-text', () => {
    render(
      <GlitchText text="A B C">
        <em>rich</em>
      </GlitchText>,
    )
    expect(screen.getByText('rich')).toBeInTheDocument()
  })
})

describe('GlitchImage', () => {
  it('renders a duotone placeholder when src is null', () => {
    render(<GlitchImage src={null} alt="VOLT//AGE" />)
    expect(screen.getByTestId('dj-placeholder')).toBeInTheDocument()
  })

  it('renders the image when src is provided', () => {
    render(<GlitchImage src="/media/crspy.png" alt="CR//SPY" />)
    expect(screen.getByAltText('CR//SPY')).toBeInTheDocument()
  })
})

describe('Section', () => {
  it('reveals once its element intersects', () => {
    render(<Section id="about">hello</Section>)
    const section = document.getElementById('about')!
    expect(section.className).toContain('opacity-0')
    const io = (globalThis.IntersectionObserver as unknown as MockIO).instances.at(-1)!
    act(() => {
      io.callback([{ isIntersecting: true, target: section }], io)
    })
    expect(section.className).toContain('opacity-100')
  })
})
