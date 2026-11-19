import { Reveal } from '@/components/home/Reveal'
import { HomeSectionPanel } from '@/components/home/HomeSectionPanel'
import { SectionDivider } from '../SectionDivider'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { siteImageSrc } from '@/lib/siteImage'

export function WhoSection({ who }) {
  if (!who) return null
  const imageSrc = siteImageSrc(who, '/1.jpg')

  return (
    <section id="who" className="scroll-mt-20 sm:scroll-mt-24">
      <Reveal>
        <HomeSectionPanel>
          <SectionHeading
            // eyebrow="Section 2"
            title={who.title}
            // subtitle={`A home in ${brand} for your calling.`}
            subtitleClass="text-sm text-zinc-400"
          />
          <SectionDivider />

          <div className="mt-7 grid items-start gap-8 sm:mt-8 sm:gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="overflow-hidden rounded-md border border-white/10 lg:col-span-5">
              <img
                src={imageSrc}
                alt=""
                className="aspect-3/4 w-full object-cover sm:aspect-4/5 lg:min-h-88 lg:object-cover"
                loading="lazy"
              />
            </div>
            <div className="lg:col-span-7">
              <ul className="space-y-4 text-left text-base text-zinc-200 sm:space-y-5 sm:text-lg">
                {who.lines?.map((line) => (
                  <li key={line} className="flex gap-3">
                    {/* <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-amber-200/60" /> */}
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-xs font-medium uppercase tracking-widest text-zinc-500 sm:mt-10">
                {who.intro}
              </p>
              <ul className="mt-3 space-y-2 text-zinc-300">
                {who.roles?.map((r) => (
                  <li key={r} className="pl-1 text-sm sm:pl-2 sm:text-base">
                    – {r}
                  </li>
                ))}
              </ul>
              <p className="mt-6 font-display text-xl text-white sm:mt-8 sm:text-2xl">
                {who.closing}
              </p>
            </div>
          </div>
        </HomeSectionPanel>
      </Reveal>
    </section>
  )
}
