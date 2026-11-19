import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

const base = cn(
  'text-sm font-medium text-slate-500 underline-offset-2 transition',
  'hover:text-slate-800 hover:underline',
  'dark:text-zinc-400 dark:hover:text-zinc-100',
)

export function TextLink({ to, href, className = '', children, ...rest }) {
  if (to) {
    return (
      <Link to={to} className={cn(base, className)} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <a
      href={href}
      className={cn(base, className)}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      {...rest}
    >
      {children}
    </a>
  )
}
