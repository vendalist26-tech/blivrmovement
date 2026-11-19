/* eslint-disable no-unused-vars */
import { Reveal } from '@/components/home/Reveal'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { cn } from '@/lib/cn'
import { heroDesktopImageSrc, heroMobileImageSrc } from '@/lib/siteImage'

/** Hero secondary CTA should open the meetings page, not scroll to the homepage section. */
function heroSecondaryHref(href, label = '') {
  const value = (href ?? '').trim()
  const normalized = value.toLowerCase()
  if (
    normalized === '#upcoming-meetings' ||
    normalized === '/#upcoming-meetings' ||
    normalized === '#upcoming-meetings/' ||
    normalized.includes('upcoming-meeting')
  ) {
    return '/upcoming-meetings'
  }
  if (/upcoming\s*meetings?/i.test(label) && (!value || value.startsWith('#'))) {
    return '/upcoming-meetings'
  }
  return value || '/upcoming-meetings'
}

/**
 * @param {{ hero: object, brand?: string }} props
 */
export function HeroSection({ hero, brand }) {
  if (!hero) return null
  const secondaryHref = hero.secondaryCta?.label
    ? heroSecondaryHref(hero.secondaryCta.href, hero.secondaryCta.label)
    : null
  const mobileBg = heroMobileImageSrc(hero)
  const desktopBg = heroDesktopImageSrc(hero)

  return (
    <section
      id="top"
      className={cn(
        'relative isolate max-w-[100vw] overflow-hidden bg-black',
        'min-h-svh sm:min-h-dvh',
        'border-b border-zinc-800',
        'shadow-[0_1px_0_0_rgba(0,0,0,0.45)]',
      )}
    >
      {/* Portrait crop for phones */}
      <div
        className={cn(
          'absolute inset-0 bg-cover bg-center bg-no-repeat sm:hidden',
        )}
        style={{ backgroundImage: `url(${mobileBg})` }}
        aria-hidden
      />
      <div
        className={cn(
          'absolute inset-0 hidden bg-cover bg-no-repeat sm:block',
          'bg-position-[center_20%] md:bg-center',
        )}
        style={{ backgroundImage: `url(${desktopBg})` }}
        aria-hidden
      />
      {/* Mobile/tablet: bottom scrim so copy stays readable over busy photo */}
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 z-1 h-[58%]',
          'bg-linear-to-t from-black/82 via-black/48 to-transparent max-sm:from-black/88',
          'sm:h-[52%] sm:from-black/72 sm:via-black/38',
          'md:from-black/60 md:via-black/28',
        )}
        aria-hidden
      />

      <Reveal
        className={cn(
          'relative z-10 mx-auto flex min-h-svh w-full max-w-6xl flex-col items-center sm:min-h-dvh',
          'px-5 pt-[max(4.75rem,calc(3.35rem+env(safe-area-inset-top,0px)))] pb-0 text-center sm:px-8',
        )}
      >
        <div
          className="w-full min-h-[min(18vh,8rem)] flex-1 shrink max-[380px]:min-h-[min(14vh,6.5rem)] sm:min-h-0"
          aria-hidden
        />
        <div
          className={cn(
            'flex w-full min-w-0 max-w-full flex-col items-center px-1 sm:max-w-3xl sm:px-0',
            'pb-[max(1.5rem,calc(0.65rem+env(safe-area-inset-bottom,0px)))] sm:pb-10 md:pb-11',
          )}
        >
          {/* <h1 className="font-display text-[clamp(2.25rem,5vw+1rem,4.5rem)] font-medium leading-[1.08] tracking-tight text-white drop-shadow-[0_1px_24px_rgba(0,0,0,0.65)]">
            {headline}
          </h1> */}
          {hero.subhead && (
            <p
              className={cn(
                'w-full min-w-0 max-w-full hyphens-auto text-balance text-zinc-100',
                '[overflow-wrap:anywhere] break-words font-display italic tracking-tight',
                'max-sm:leading-tight max-sm:tracking-normal',
                'max-sm:text-[clamp(0.5625rem,2.85vw+0.42rem,0.75rem)]',
                'sm:leading-snug sm:text-xl md:text-2xl lg:text-3xl md:leading-tight',
                'mt-3 sm:mt-5 md:mt-6',
                'drop-shadow-[0_2px_20px_rgba(0,0,0,0.65)]',
              )}
            >
              {hero.subhead}
            </p>
          )}
          {/* <div
            className="mx-auto mt-7 h-px w-16 bg-linear-to-r from-transparent via-zinc-500 to-transparent sm:mt-8 sm:w-24"
            aria-hidden
          /> */}
          {hero.body && (
            <p
              className={cn(
                'w-full min-w-0 max-w-full text-pretty text-zinc-200 [overflow-wrap:anywhere] break-words',
                'text-[clamp(0.75rem,2.2vw+0.55rem,1rem)] sm:text-base md:text-sm',
                'mt-5 leading-relaxed sm:mt-5 md:mt-6',
                'drop-shadow-[0_1px_16px_rgba(0,0,0,0.55)]',
              )}
            >
              {hero.body}
            </p>
          )}

          {(hero.primaryCta?.label || hero.secondaryCta?.label) && (
            <div
              className={cn(
                'mt-5 flex w-full max-w-md flex-col gap-2.5 sm:mx-auto sm:mt-7 sm:max-w-2xl sm:flex-row sm:justify-center sm:gap-4',
                '[&_a]:min-h-12 [&_a]:touch-manipulation [&_button]:min-h-12 [&_button]:touch-manipulation sm:[&_a]:min-h-0 sm:[&_button]:min-h-0',
              )}
            >
              {hero.primaryCta?.label && (
                <ButtonLink href={hero.primaryCta.href} variant="primary">
                  {hero.primaryCta.label}
                </ButtonLink>
              )}
              {hero.secondaryCta?.label && secondaryHref ? (
                <ButtonLink href={secondaryHref} variant="secondary">
                  {hero.secondaryCta.label}
                </ButtonLink>
              ) : null}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  )
}
