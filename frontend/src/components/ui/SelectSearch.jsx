import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check, Search } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * @param {{
 * id?: string,
 * label?: string,
 * options: Array<{ value: string, label: string }>,
 * value?: string | string[],
 * onChange?: (value: string | string[]) => void,
 * placeholder?: string,
 * searchPlaceholder?: string,
 * multiple?: boolean,
 * className?: string,
 * error?: string
 * }} props
 */
export function SelectSearch({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  multiple = false,
  className = '',
  error,
}) {
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const searchRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [panelPos, setPanelPos] = useState(null)
  const [query, setQuery] = useState('')

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

  // Measure for fixed portal: sync layout read + scroll/resize. Panel position is cleared in `close` / `open` handlers (not in an effect) to avoid react-hooks/set-state-in-effect.
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
  const selectedValues = useMemo(
    () => (multiple ? (Array.isArray(value) ? value : []) : [value].filter(Boolean)),
    [multiple, value],
  )

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

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => searchRef.current?.focus(), 0)
    return () => clearTimeout(t)
  }, [open])

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  const selectedText = useMemo(() => {
    if (!selectedValues.length) return placeholder
    const labels = options
      .filter((o) => selectedValues.includes(o.value))
      .map((o) => o.label)
    if (!labels.length) return placeholder
    if (multiple) return labels.join(', ')
    return labels[0]
  }, [multiple, options, placeholder, selectedValues])

  const toggleOption = (optionValue) => {
    if (!onChange) return
    if (!multiple) {
      onChange(optionValue)
      close()
      return
    }
    const exists = selectedValues.includes(optionValue)
    onChange(exists ? selectedValues.filter((v) => v !== optionValue) : [...selectedValues, optionValue])
  }

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
          } else {
            setPanelPos(null)
            setOpen(true)
          }
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={cn('truncate', !selectedValues.length && 'text-slate-400 dark:text-zinc-500')}>
          {selectedText}
        </span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 transition', open && 'rotate-180')} />
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
            className="rounded-xl border border-slate-200/90 bg-white p-2 shadow-lg dark:border-white/12 dark:bg-zinc-900"
          >
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-slate-200/90 bg-white pl-8 pr-2.5 py-2 text-sm text-slate-900 outline-none focus:border-sky-300 dark:border-white/12 dark:bg-zinc-950/80 dark:text-zinc-100"
              />
            </div>

            <ul
              role="listbox"
              aria-multiselectable={multiple || undefined}
              className="max-h-52 overflow-auto rounded-lg"
            >
              {filteredOptions.map((option) => {
                const active = selectedValues.includes(option.value)
                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => toggleOption(option.value)}
                      className={cn(
                        'flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm transition',
                        active
                          ? 'bg-sky-50 text-sky-800 dark:bg-sky-500/15 dark:text-sky-200'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-white/10',
                      )}
                    >
                      <span>{option.label}</span>
                      {active && <Check className="h-4 w-4" />}
                    </button>
                  </li>
                )
              })}
              {!filteredOptions.length && (
                <li className="px-2.5 py-2 text-sm text-slate-500 dark:text-zinc-500">No matches.</li>
              )}
            </ul>
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

