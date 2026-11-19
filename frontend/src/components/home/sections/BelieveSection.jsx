import { Reveal } from '@/components/home/Reveal'
import { siteImageSrc } from '@/lib/siteImage'

export function BelieveSection({ believe }) {
  if (!believe) return null
  const paragraphs = believe.paragraphs ?? []
  const imageSrc = siteImageSrc(believe, '/GnaTA01.jpg')

  return (
    <section id="believe" className="scroll-mt-20 sm:scroll-mt-24">
      <Reveal delay={40}>
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid items-stretch gap-6 sm:gap-7 lg:grid-cols-2 lg:gap-8">
            <div className="flex w-full flex-col">
              <Reveal delay={20} className="h-full min-h-[34rem] sm:min-h-[40rem]">
                <div className="relative h-full overflow-hidden rounded-md border border-black/85 shadow-sm shadow-zinc-950/35">
                  <img
                    src={imageSrc}
                    alt=""
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-black/38" />
                </div>
              </Reveal>
            </div>

            <article className="flex w-full flex-col">
              <Reveal
                delay={60}
                className="flex h-full min-h-[34rem] flex-col rounded-md border border-white/10 bg-black px-8 py-10 shadow-sm shadow-zinc-950/35 sm:min-h-[40rem] sm:px-10 sm:py-12"
              >
                <img
                  src="/blvr-logo.jpeg"
                  alt=""
                  className="h-14 w-14 rounded-sm object-contain"
                />
                <h2 className="mt-7 text-left font-display text-4xl leading-[1.05] text-white sm:text-5xl">
                  {believe.title}
                </h2>

                <div className="mt-10 space-y-6">
                  {paragraphs.map((line, i) => (
                    <Reveal
                      key={line}
                      as="p"
                      delay={100 + i * 45}
                      className="border-b border-white/15 pb-4 text-left text-base leading-7 text-white/92"
                    >
                      {line}
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </article>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
