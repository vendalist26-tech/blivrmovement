import { Reveal } from '@/components/home/Reveal'
import { HomeSectionPanel } from '@/components/home/HomeSectionPanel'
// import { SectionDivider } from '../SectionDivider'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { siteImageSrc } from '@/lib/siteImage'

export function MissionSection({ mission }) {
  if (!mission) return null
  const imageSrc = siteImageSrc(mission, '/VSMS01.jpg')

  return (
    <section id="mission" className="scroll-mt-20 sm:scroll-mt-24">
      <Reveal delay={50}>
        <HomeSectionPanel>
        <SectionHeading 
        // eyebrow="Section 4" 
        // title="Mission & vision" 
        
        />
        {/* <SectionDivider /> */}

        <div className="mt-6 grid gap-8 sm:mt-7 sm:gap-10 lg:grid-cols-12 lg:items-stretch">
          <div className="h-full min-h-72 overflow-hidden rounded-md border border-white/10 sm:min-h-80 lg:col-span-5">
            <img
              src={imageSrc}
              alt=""
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
          </div>
          <div className="space-y-8 sm:space-y-10 lg:col-span-7">
            <div>
              <h3 className="font-display text-xl text-white sm:text-2xl">{mission.visionTitle}</h3>
              <p className="mt-3 text-pretty leading-[1.75] text-zinc-300">{mission.vision}</p>
            </div>
            <div>
              <h3 className="font-display text-xl text-white sm:text-2xl">{mission.missionTitle}</h3>
              <p className="mt-3 text-pretty leading-[1.75] text-zinc-300">{mission.mission}</p>
            </div>
          </div>
        </div>
        </HomeSectionPanel>
      </Reveal>
    </section>
  )
}
