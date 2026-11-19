import { cn } from '@/lib/cn'

/**
 * Inset “black card on white” section shell — not full-bleed; matches marketing mockups.
 */
export function HomeSectionPanel({
  as: Comp = 'div',
  className,
  children,
  paddingClassName,
  ...rest
}) {
  const resolvedPaddingClassName =
    paddingClassName ||
    'px-5 pt-6 pb-8 sm:px-7 sm:pt-6 sm:pb-9 md:px-10 md:pt-7 md:pb-10 lg:px-12 lg:pt-8 lg:pb-11 xl:px-14 xl:pt-9 xl:pb-12'

  return (
    <Comp
      className={cn(
        'mx-auto w-full max-w-6xl overflow-hidden rounded-md border border-zinc-800/50',
        'bg-zinc-950 text-zinc-100 shadow-sm shadow-zinc-950/15',
        resolvedPaddingClassName,
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  )
}
