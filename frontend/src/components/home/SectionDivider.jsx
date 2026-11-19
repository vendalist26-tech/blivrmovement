export function SectionDivider({ tone = 'ink' }) {
  const paper = tone === 'paper'
  return (
    <div className="mx-auto flex w-full max-w-3xl items-center justify-center gap-3 py-2.5 sm:py-3">
      <div
        className={
          paper
            ? 'h-px flex-1 bg-gradient-to-r from-transparent via-slate-300/80 to-slate-200/40'
            : 'h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-white/5'
        }
      />
      <div
        className={paper ? 'h-1 w-1 rotate-45 bg-slate-400/80' : 'h-1 w-1 rotate-45 bg-white/30'}
      />
      <div
        className={
          paper
            ? 'h-px flex-1 bg-gradient-to-l from-transparent via-slate-300/80 to-slate-200/40'
            : 'h-px flex-1 bg-gradient-to-l from-transparent via-white/20 to-white/5'
        }
      />
    </div>
  )
}
