import { Spinner } from '@/components/ui/Spinner'

/**
 * Reusable branded loading screen with letter-by-letter reveal.
 */
export function BrandLoadingScreen({
  wordmark = 'BLiVR Movement',
  label = 'Loading',
  className = '',
}) {
  let letterStep = 0

  return (
    <div
      className={`flex min-h-dvh flex-col items-center justify-center gap-5 bg-white px-6 text-zinc-500 ${className}`}
    >
      <p className="text-center font-display text-[clamp(1.75rem,2.2vw+1rem,3rem)] tracking-[0.08em] text-zinc-900">
        {Array.from(wordmark).map((char, i) => {
          if (char === ' ') {
            return <span key={`space-${i}`} className="inline-block w-[0.45ch]" />
          }
          const delay = letterStep * 90
          letterStep += 1
          return (
            <span
              key={`${char}-${i}`}
              className="blivr-loading-letter inline-block"
              style={{ animationDelay: `${delay}ms` }}
            >
              {char}
            </span>
          )
        })}
      </p>
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
      <Spinner className="h-6 w-6 border-zinc-200 border-t-zinc-800" />
      <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{label}</p>
    </div>
  )
}

