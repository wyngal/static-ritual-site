import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import GlitchCanvas from './GlitchCanvas'

// jsdom has no WebGL. Explicitly force getContext to return null so the test
// deterministically exercises the WebGL-unavailable fallback path — and so
// jsdom's "not implemented: getContext" virtual-console noise stays out of the
// test output. Test-scoped (restored after), never a global console suppression.
beforeAll(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
})

afterAll(() => {
  vi.restoreAllMocks()
})

describe('GlitchCanvas', () => {
  it('falls back to static grain when WebGL is unavailable', () => {
    render(<GlitchCanvas />)
    expect(screen.getByTestId('grain-fallback')).toBeInTheDocument()
    expect(screen.queryByTestId('grain-canvas')).toBeNull()
  })
})
