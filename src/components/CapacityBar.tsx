import { capacityPercent } from '../lib/ritual'

interface Props {
  attendance: number
  capacity: number
}

export default function CapacityBar({ attendance, capacity }: Props) {
  const pct = capacityPercent({ attendance, capacity })
  return (
    <div>
      <div role="img" aria-label={`${pct}% of capacity`} className="h-2 w-full bg-white/10">
        <div className="h-full bg-white" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-3 flex items-baseline justify-between font-mono">
        <span className="text-white text-3xl sm:text-4xl">{pct}%</span>
        <span className="text-white/50 text-xs uppercase tracking-wider">
          ~{attendance.toLocaleString('en-US')} / {capacity.toLocaleString('en-US')} CAP
        </span>
      </div>
    </div>
  )
}
