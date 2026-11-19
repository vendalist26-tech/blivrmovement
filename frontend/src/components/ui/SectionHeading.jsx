import { cn } from '@/lib/cn'

/**
 * Marketing section title block.
 * @param {{ tone?: 'paper' | 'ink' }} - `ink` = white text on black bands; `paper` = slate on light.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  subtitleClass = '',
  align = 'center',
  className = '',
  tone = 'ink',
}) {
  const paper = tone === 'paper'
  return (
    <div
      className={cn(
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'text-xs font-medium uppercase tracking-[0.3em]',
            paper
              ? 'text-amber-800/90 dark:text-amber-200/80'
              : 'text-amber-200/80',
          )}
        >
          {eyebrow}
        </p>
      )}
      {title && (
        <h2
          className={cn(
            'mt-2 font-display sm:mt-2.5 sm:text-3xl md:text-4xl lg:text-5xl',
            'text-2xl',
            paper ? 'text-slate-900 dark:text-zinc-100' : 'text-white',
          )}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          className={cn(
            'mt-2 max-w-2xl text-pretty sm:mt-2.5',
            paper ? 'text-slate-600 dark:text-zinc-500' : 'text-zinc-400',
            align === 'center' && 'mx-auto',
            subtitleClass,
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
