import { cn } from '@/lib/cn'

export function Container({ as: Comp = 'div', className = '', children, ...rest }) {
  return (
    <Comp
      className={cn('mx-auto w-full max-w-6xl px-4 min-[400px]:px-6 sm:px-8 lg:px-10', className)}
      {...rest}
    >
      {children}
    </Comp>
  )
}
