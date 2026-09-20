import { describe, it, expect } from 'vitest'
import { capacityPercent, formatRitualDate } from './ritual'

describe('capacityPercent', () => {
  it('derives a whole-number percentage', () => {
    expect(capacityPercent({ attendance: 800, capacity: 1000 })).toBe(80)
    expect(capacityPercent({ attendance: 990, capacity: 1100 })).toBe(90)
  })
})

describe('formatRitualDate', () => {
  it('formats an ISO date as weekday, month-day, year without timezone drift', () => {
    expect(formatRitualDate('2026-11-14')).toBe('SAT · NOV 14 · 2026')
    expect(formatRitualDate('2026-01-01')).toBe('THU · JAN 1 · 2026')
  })
})
