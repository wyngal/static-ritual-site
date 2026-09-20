import { describe, it, expect, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { parseRitualSlug, useHashRoute } from './useHashRoute'

describe('parseRitualSlug', () => {
  it('reads a ritual slug from a route hash', () => {
    expect(parseRitualSlug('#/ritual/nashville')).toBe('nashville')
  })

  it('ignores plain section anchors and malformed routes', () => {
    expect(parseRitualSlug('#djs')).toBeNull()
    expect(parseRitualSlug('')).toBeNull()
    expect(parseRitualSlug('#/ritual/')).toBeNull()
    expect(parseRitualSlug('#/ritual/a/b')).toBeNull()
  })
})

describe('useHashRoute', () => {
  afterEach(() => {
    window.location.hash = ''
  })

  it('tracks hash changes', () => {
    const { result } = renderHook(() => useHashRoute())
    expect(result.current).toBeNull()
    act(() => {
      window.location.hash = '#/ritual/asheville'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(result.current).toBe('asheville')
  })
})
