const states = [
  { color: 'bg-[oklch(0.58_0.18_180)]', label: 'Disponible' },
  { color: 'bg-[oklch(0.52_0.2_355)]', label: 'No disponible' },
  { color: 'bg-[oklch(0.72_0.22_65)]', label: 'Tentativo' },
  { color: 'bg-[oklch(0.55_0.25_255)]', label: 'Reservado' },
]

export function AvailabilityLegend() {
  return (
    <div className="flex items-center gap-5 text-xs text-muted-foreground">
      {states.map(s => (
        <span key={s.label} className="flex items-center gap-1.5">
          <span className={`size-3 rounded-sm ${s.color}`} />
          {s.label}
        </span>
      ))}
    </div>
  )
}
