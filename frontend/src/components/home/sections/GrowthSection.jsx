import { Reveal } from '@/components/home/Reveal'
import { HomeSectionPanel } from '@/components/home/HomeSectionPanel'
import { SectionDivider } from '../SectionDivider'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function GrowthSection({ growth }) {
  if (!growth) return null
  return (
    <section id="growth" className="scroll-mt-20 sm:scroll-mt-24">
      <Reveal delay={60}>
        <HomeSectionPanel>
        <SectionHeading
          // eyebrow="Section 5"
          title={growth.title}
          subtitle={growth.subtitle}
          subtitleClass="text-zinc-400"
        />
        <SectionDivider />

        <ul className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {growth.items?.map((item) => (
            <li
              key={item.title}
              className="rounded-md border border-white/10 bg-white/[0.03] p-5 transition duration-500 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-black/20 sm:p-6"
            >
              <p className="text-2xl" aria-hidden>
                {item.icon}
              </p>
              <h3 className="mt-2 font-medium text-white">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">{item.text}</p>
            </li>
          ))}
        </ul>
        </HomeSectionPanel>
      </Reveal>
    </section>
  )
}
