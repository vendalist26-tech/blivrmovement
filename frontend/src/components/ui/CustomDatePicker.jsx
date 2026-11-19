import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { cn } from '@/lib/cn'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function toISO(date) {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

function fromISO(value) {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

function buildCalendarGrid(viewDate) {
  const first = startOfMonth(viewDate)
  const last = endOfMonth(viewDate)
  const firstWeekday = first.getDay()
  const totalDays = last.getDate()
  const cells = []
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null)
  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), day))
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const selectClass = cn(
  'max-w-[7.5rem] flex-1 rounded-lg border border-slate-200/90 bg-white py-1.5 pl-2 pr-7 text-sm text-slate-800',
  'outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-200/50',
  'dark:border-white/15 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-sky-500/50 dark:focus:ring-sky-500/20',
)

/**
 * Non-native date picker (no <input type="date">).
 * Month/year dropdowns allow jumping to old dates without clicking prev/next many times.
 */
export function CustomDatePicker({
  id,
  label,
  value,
  onChange,
  placeholder = 'Pick a date',
  className = '',
  error,
  minYear,
  maxYear,
}) {
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const [panelPos, setPanelPos] = useState(null)
  const reactId = useId()
  const monthId = id ? `${id}-month` : `${reactId}-month`
  const yearId = id ? `${id}-year` : `${reactId}-year`
  const selectedDate = fromISO(value)
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => selectedDate || new Date())

  const now = new Date()
  const yearMax = maxYear ?? now.getFullYear()
  const yearMin = minYear ?? now.getFullYear() - 120
  const yearOptions = useMemo(() => {
    const list = []
    for (let y = yearMax; y >= yearMin; y -= 1) list.push(y)
    return list
  }, [yearMin, yearMax])

  const clampViewToYearRange = (d) => {
    let y = d.getFullYear()
    if (y < yearMin) y = yearMin
    if (y > yearMax) y = yearMax
    if (y === d.getFullYear()) return d
    const last = endOfMonth(new Date(y, d.getMonth(), 1)).getDate()
    const day = Math.min(d.getDate(), last)
    return new Date(y, d.getMonth(), day)
  }

  const updatePanelPosition = useCallback(() => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPanelPos({ top: r.bottom + 6, left: r.left, width: r.width })
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    setPanelPos(null)
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    updatePanelPosition()
    window.addEventListener('scroll', updatePanelPosition, true)
    window.addEventListener('resize', updatePanelPosition)
    return () => {
      window.removeEventListener('scroll', updatePanelPosition, true)
      window.removeEventListener('resize', updatePanelPosition)
    }
  }, [open, updatePanelPosition])

  useEffect(() => {
    if (!open) return
    const onDocClick = (e) => {
      if (rootRef.current?.contains(e.target) || panelRef.current?.contains(e.target)) return
      close()
    }
    const onEsc = (e) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open, close])

  const cells = useMemo(() => buildCalendarGrid(viewDate), [viewDate])
  const selectedISO = selectedDate ? toISO(selectedDate) : null

  const displayText = selectedDate
    ? selectedDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : placeholder

  return (
    <div ref={rootRef} className={cn('relative space-y-1.5', className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400"
        >
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={cn(
          'flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white/90 px-3.5 py-2.5 text-left text-sm text-slate-900 shadow-inner shadow-slate-200/20 transition',
          'focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200/50',
          'dark:border-white/12 dark:bg-zinc-950/80 dark:text-zinc-100 dark:shadow-none dark:focus:border-sky-500/50 dark:focus:ring-sky-500/20',
          error && 'border-rose-300 focus:border-rose-400 focus:ring-rose-200/50',
        )}
        onClick={() => {
          if (open) {
            close()
            return
          }
          const base = selectedDate || viewDate
          setViewDate(clampViewToYearRange(base))
          setPanelPos(null)
          setOpen(true)
        }}
      >
        <span className={cn(!selectedDate && 'text-slate-400 dark:text-zinc-500')}>{displayText}</span>
        <Calendar className="h-4 w-4 shrink-0" />
      </button>

      {open &&
        panelPos &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: 'fixed',
              top: panelPos.top,
              left: panelPos.left,
              width: panelPos.width,
              zIndex: 80,
            }}
            className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-lg dark:border-white/12 dark:bg-zinc-900"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                className="shrink-0 rounded-md p-1.5 text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-white/10"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex min-w-0 flex-1 items-center justify-center gap-2 sm:gap-2.5">
                <label className="sr-only" htmlFor={monthId}>
                  Month
                </label>
                <select
                  id={monthId}
                  className={selectClass}
                  value={viewDate.getMonth()}
                  onChange={(e) => {
                    const m = Number(e.target.value)
                    setViewDate((d) => {
                      const next = new Date(d.getFullYear(), m, 1)
                      const last = endOfMonth(next).getDate()
                      const day = Math.min(d.getDate(), last)
                      return new Date(d.getFullYear(), m, day)
                    })
                  }}
                >
                  {MONTHS.map((name, i) => (
                    <option key={name} value={i}>
                      {name}
                    </option>
                  ))}
                </select>
                <label className="sr-only" htmlFor={yearId}>
                  Year
                </label>
                <select
                  id={yearId}
                  className={cn(selectClass, 'max-w-[5.5rem] pr-6')}
                  value={viewDate.getFullYear()}
                  onChange={(e) => {
                    const y = Number(e.target.value)
                    setViewDate((d) => {
                      const next = new Date(y, d.getMonth(), 1)
                      const last = endOfMonth(next).getDate()
                      const day = Math.min(d.getDate(), last)
                      return new Date(y, d.getMonth(), day)
                    })
                  }}
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                className="shrink-0 rounded-md p-1.5 text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-white/10"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-2 grid grid-cols-7 text-center text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-zinc-500">
              {WEEKDAYS.map((d) => (
                <span key={d} className="py-1">
                  {d}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((cell, idx) => {
                if (!cell) return <span key={`empty-${idx}`} />
                const cellISO = toISO(cell)
                const isSelected = cellISO === selectedISO
                return (
                  <button
                    key={cellISO}
                    type="button"
                    onClick={() => {
                      onChange?.(cellISO)
                      close()
                    }}
                    className={cn(
                      'rounded-md py-1.5 text-sm transition',
                      isSelected
                        ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-white/10',
                    )}
                  >
                    {cell.getDate()}
                  </button>
                )
              })}
            </div>

            <div className="mt-3 flex justify-between">
              <button
                type="button"
                onClick={() => {
                  onChange?.('')
                  close()
                }}
                className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-white/10"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  const today = new Date()
                  const iso = toISO(today)
                  onChange?.(iso)
                  setViewDate(today)
                  close()
                }}
                className="rounded-md px-2 py-1 text-xs text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-white/10"
              >
                Today
              </button>
            </div>
          </div>,
          document.body,
        )}

      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

