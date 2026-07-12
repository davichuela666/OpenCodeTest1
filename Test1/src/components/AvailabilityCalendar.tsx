'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, CalendarRange, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { AvailabilityLegend } from '@/components/AvailabilityLegend'
import { getAvailability, toggleDayAvailability, setAvailabilityRange } from '@/lib/actions/availability'

type SlotMap = Record<string, { type: string; note?: string }>
type ViewMode = 'monthly' | 'weekly'

const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const typeColors: Record<string, string> = {
  available: 'bg-[oklch(0.58_0.18_180)] hover:bg-[oklch(0.62_0.18_180)]',
  unavailable: 'bg-[oklch(0.52_0.2_355)] hover:bg-[oklch(0.56_0.2_355)]',
  tentative: 'bg-[oklch(0.72_0.22_65)] hover:bg-[oklch(0.76_0.22_65)]',
  reserved: 'bg-[oklch(0.55_0.25_255)] hover:bg-[oklch(0.6_0.25_255)]',
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function isToday(year: number, month: number, day: number): boolean {
  const today = new Date()
  return today.getFullYear() === year
    && today.getMonth() === month
    && today.getDate() === day
}

function isPast(year: number, month: number, day: number): boolean {
  const date = new Date(year, month, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

function isWeekend(year: number, month: number, day: number): boolean {
  const dow = new Date(year, month, day).getDay()
  return dow === 0 || dow === 6
}

function getMonthDays(year: number, month: number): (Date | null)[] {
  const days: (Date | null)[] = []
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const startPad = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
  for (let i = 0; i < startPad; i++) days.push(null)

  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d))
  }

  while (days.length % 7 !== 0) days.push(null)
  return days
}

function getWeekDays(date: Date): Date[] {
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + diff)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export function AvailabilityCalendar({ profileId }: { profileId: string }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [slots, setSlots] = useState<SlotMap>({})
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('monthly')
  const [rangeStart, setRangeStart] = useState<string | null>(null)
  const [rangeEnd, setRangeEnd] = useState<string | null>(null)
  const [rangeActive, setRangeActive] = useState(false)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthDays = getMonthDays(year, month)
  const weekDays = getWeekDays(currentDate)

  const fetchSlots = useCallback(async () => {
    setLoading(true)
    const data = await getAvailability(profileId, year, month)
    const map: SlotMap = {}
    data.forEach(s => { map[s.date] = { type: s.type, note: s.note } })
    setSlots(map)
    setLoading(false)
  }, [profileId, year, month])

  useEffect(() => { fetchSlots() }, [fetchSlots])

  function handlePrev() {
    if (viewMode === 'monthly') {
      setCurrentDate(new Date(year, month - 1, 1))
    } else {
      const d = new Date(currentDate)
      d.setDate(d.getDate() - 7)
      setCurrentDate(d)
    }
  }

  function handleNext() {
    if (viewMode === 'monthly') {
      setCurrentDate(new Date(year, month + 1, 1))
    } else {
      const d = new Date(currentDate)
      d.setDate(d.getDate() + 7)
      setCurrentDate(d)
    }
  }

  async function handleDayClick(dateKey: string) {
    const [y, m, d] = dateKey.split('-').map(Number)
    if (isPast(y, m - 1, d)) return

    if (rangeActive && rangeStart) {
      if (!rangeEnd) {
        setRangeEnd(dateKey)
        // Apply the range
        const type = 'unavailable'
        await setAvailabilityRange(rangeStart, dateKey, type)
        await fetchSlots()
        setRangeStart(null)
        setRangeEnd(null)
        setRangeActive(false)
      }
      return
    }

    const current = slots[dateKey]
    if (current?.type === 'tentative' || current?.type === 'reserved') return
    const result = await toggleDayAvailability(dateKey, current?.type || null)
    if (result.success) {
      setSlots(prev => ({
        ...prev,
        [dateKey]: { type: result.type! }
      }))
    }
  }

  function handleDayMouseEnter(dateKey: string) {
    if (rangeActive && rangeStart && !rangeEnd) {
      setRangeEnd(dateKey)
    }
  }

  function renderDayCell(date: Date | null) {
    if (!date) return <div key="empty" className="min-h-[56px] sm:min-h-[82px] w-full" />

    const key = formatDateKey(date.getFullYear(), date.getMonth(), date.getDate())
    const slot = slots[key]
    const past = isPast(date.getFullYear(), date.getMonth(), date.getDate())
    const today = isToday(date.getFullYear(), date.getMonth(), date.getDate())
    const weekend = isWeekend(date.getFullYear(), date.getMonth(), date.getDate())
    const type = slot?.type || (past ? null : 'available')

    return (
      <button
        key={key}
        type="button"
        disabled={past}
        onClick={() => handleDayClick(key)}
        onMouseEnter={() => handleDayMouseEnter(key)}
        className={cn(
          'min-h-[56px] sm:min-h-[82px] w-full rounded-xl text-sm font-semibold transition-all relative flex flex-col items-center justify-center',
          past
            ? 'bg-muted/20 text-muted-foreground/20 cursor-not-allowed line-through'
            : type === 'tentative' || type === 'reserved'
              ? 'text-white cursor-default'
              : type
                ? 'text-white cursor-pointer hover:scale-105 hover:shadow-lg active:scale-95'
                : 'text-muted-foreground/25 cursor-not-allowed',
          type && typeColors[type],
          !type && !past && 'bg-muted/20',
          weekend && 'brightness-[0.7] saturate-[0.85]',
          today && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        )}
        title={slot?.note || ''}
      >
        <span className={cn('text-base sm:text-lg leading-none font-bold', weekend && !past && 'opacity-80')}>{date.getDate()}</span>
        {slot?.note && (
          <span className="text-[9px] leading-none mt-1 opacity-70 truncate max-w-[85%]">
            {slot.note}
          </span>
        )}
      </button>
    )
  }

  const monthName = new Date(year, month).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handlePrev} className="size-8">
            <ChevronLeft className="size-5" />
          </Button>
          <h2 className="text-xl font-bold capitalize min-w-[200px] text-center tracking-tight">
            {monthName}
          </h2>
          <Button variant="ghost" size="icon" onClick={handleNext} className="size-8">
            <ChevronRight className="size-5" />
          </Button>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
          <button
            type="button"
            onClick={() => setViewMode('monthly')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
              viewMode === 'monthly' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <CalendarDays className="size-3.5" />
            Mes
          </button>
          <button
            type="button"
            onClick={() => setViewMode('weekly')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
              viewMode === 'weekly' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <CalendarRange className="size-3.5" />
            Semana
          </button>
        </div>
      </div>

      {/* Legend */}
      <AvailabilityLegend />

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Calendar Grid */}
      {!loading && (
        <>
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-2">
            {dayLabels.map(label => (
              <div key={label} className="h-8 flex items-center justify-center text-xs font-bold tracking-widest text-muted-foreground uppercase">
                {label}
              </div>
            ))}
          </div>

          {/* Monthly view */}
          {viewMode === 'monthly' && (
            <div className="grid grid-cols-7 gap-2">
              {monthDays.map((date, i) => (
                <div key={i}>{renderDayCell(date)}</div>
              ))}
            </div>
          )}

          {/* Weekly view */}
          {viewMode === 'weekly' && (
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((date, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{dayLabels[i]}</span>
                  {renderDayCell(date)}
                </div>
              ))}
            </div>
          )}

          {/* Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
            <p>Haz clic en un día para cambiar su estado</p>
            <RangeModeToggle
              active={rangeActive}
              onToggle={() => {
                setRangeActive(!rangeActive)
                setRangeStart(null)
                setRangeEnd(null)
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

function RangeModeToggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      <CalendarRange className="size-3.5" />
      {active ? 'Selecciona fin del rango' : 'Rango'}
    </button>
  )
}
