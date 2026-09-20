const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export function capacityPercent(r: { attendance: number; capacity: number }): number {
  return Math.round((r.attendance / r.capacity) * 100)
}

// Parsed as UTC so the weekday never shifts with the viewer's timezone.
export function formatRitualDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  return `${DAYS[d.getUTCDay()]} · ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()} · ${d.getUTCFullYear()}`
}
