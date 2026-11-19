import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * @template T
 * @param {{
 * columns: Array<{ key: string, label: string, sortable?: boolean, render?: (row: T) => import('react').ReactNode, className?: string }>,
 * rows: T[],
 * sortBy?: string,
 * sortDir?: 'asc' | 'desc',
 * onSort?: (key: string) => void,
 * emptyText?: string,
 * className?: string
 * }} props
 */
export function DataTable({
  columns,
  rows,
  sortBy,
  sortDir = 'asc',
  onSort,
  emptyText = 'No records yet.',
  className = '',
}) {
  return (
    <div className={cn('overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-zinc-900/40', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50/80 dark:bg-zinc-950/40">
            <tr>
              {columns.map((col) => {
                const active = sortBy === col.key
                const Icon = !col.sortable
                  ? null
                  : active
                    ? sortDir === 'asc'
                      ? ArrowUp
                      : ArrowDown
                    : ArrowUpDown
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn('whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400', col.className)}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSort?.(col.key)}
                        className="inline-flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-zinc-200"
                      >
                        {col.label}
                        {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.id ?? idx}
                className="border-t border-slate-200/70 align-top text-slate-700 dark:border-white/10 dark:text-zinc-200"
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3', col.className)}>
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-sm text-slate-500 dark:text-zinc-500"
                >
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

