import { Reveal } from '@/components/home/Reveal'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { siteImageSrc } from '@/lib/siteImage'

export function FinalCtaSection({ finalCta }) {
  if (!finalCta) return null
  const bgImage = siteImageSrc(finalCta, null)

  return (
    <section
      id="cta"
      className="mt-10 w-full scroll-mt-20 sm:mt-12 sm:scroll-mt-24 md:mt-14"
    >
      <Reveal className="w-full" delay={30}>
        <div className="relative w-full overflow-hidden bg-zinc-950 text-zinc-100">
          {bgImage ? (
            <div className="absolute inset-0" aria-hidden>
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{ backgroundImage: `url(${bgImage})` }}
              />
              <div className="absolute inset-0 bg-zinc-950/85" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
            </div>
          ) : null}

          <div className="relative z-10 mx-auto w-full max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-14 md:px-8 md:py-16 lg:py-22">
            <h2 className="font-display text-2xl text-white sm:text-3xl sm:text-4xl md:text-5xl">
              {finalCta.title}
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-zinc-300 sm:mt-5 sm:text-lg">
              {finalCta.body}
            </p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
              {finalCta.primary?.label && (
                <ButtonLink href={finalCta.primary.href} variant="hero">
                  {finalCta.primary.label}
                </ButtonLink>
              )}
              {finalCta.secondary?.label && (
                <ButtonLink href={finalCta.secondary.href} variant="heroSecondary">
                  {finalCta.secondary.label}
                </ButtonLink>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
