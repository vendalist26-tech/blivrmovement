import { useEffect } from 'react'
import { useSiteContent } from '@/hooks/useSiteContent'
import { Button } from '@/components/ui/Button'
import { BrandLoadingScreen } from '@/components/ui/BrandLoadingScreen'
import { SiteThemeSync } from '@/components/home/SiteThemeSync'
import { TopNav } from '@/components/home/TopNav'
import { HeroSection } from '@/components/home/sections/HeroSection'
import { WhoSection } from '@/components/home/sections/WhoSection'
import { BelieveSection } from '@/components/home/sections/BelieveSection'
import { MissionSection } from '@/components/home/sections/MissionSection'
import { GrowthSection } from '@/components/home/sections/GrowthSection'
import { MayInfoSection } from '@/components/home/sections/MayInfoSection'
import { UpcomingMeetingsSection } from '@/components/home/sections/UpcomingMeetingsSection'
import { GatheringsSection } from '@/components/home/sections/GatheringsSection'
import { normalizeMeeting } from '@/lib/meetingImage'

/** Max meetings shown in the homepage carousel; full list lives on /upcoming-meetings */
const HOME_UPCOMING_MEETINGS_LIMIT = 5
import { FinalCtaSection } from '@/components/home/sections/FinalCtaSection'
import { SiteFooter } from '@/components/home/sections/SiteFooter'

export function HomePage() {
  const { data, isLoading, isError, refetch } = useSiteContent()

  useEffect(() => {
    if (data?.meta?.title) {
      document.title = data.meta.title
    }
  }, [data])

  if (isLoading) {
    return (
      <>
        <SiteThemeSync />
        <BrandLoadingScreen />
      </>
    )
  }

  if (isError || !data) {
    return (
      <>
        <SiteThemeSync />
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-white px-6 text-center text-zinc-900">
          <p className="text-zinc-600">We could not load site content. Is the API running?</p>
          <Button
            type="button"
            variant="primary"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      </>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-white text-zinc-900">
      <SiteThemeSync />
      <TopNav brand={data.brand} />
      <HeroSection hero={data.hero} brand={data.brand} />
      <main className="mt-10 flex-1 space-y-10 bg-white px-3 min-[400px]:px-4 sm:mt-12 sm:space-y-12 sm:px-5 md:mt-14 md:space-y-14 md:px-8 lg:px-10">
        <WhoSection who={data.who} brand={data.brand} />
        <BelieveSection believe={data.believe} />
        <MissionSection mission={data.mission} />
        {data.upcomingMeetings?.page?.homepageSectionVisible !== false ? (
          <UpcomingMeetingsSection
            meetings={(data.upcomingMeetings?.meetings ?? [])
              .map(normalizeMeeting)
              .filter(Boolean)
              .slice(0, HOME_UPCOMING_MEETINGS_LIMIT)}
            page={data.upcomingMeetings?.page}
          />
        ) : null}
        <GrowthSection growth={data.growth} />
        {data.mayInfo?.enabled !== false ? (
          <div className="md:-mx-8 lg:-mx-10">
            <MayInfoSection
              title={data.mayInfo?.title ?? ''}
              videoUrl={data.mayInfo?.videoUrl ?? ''}
              panelPaddingClassName="pt-3 px-3 pb-3 sm:pt-3 sm:px-3 sm:pb-3"
            />
          </div>
        ) : null}
        
        <GatheringsSection gatherings={data.gatherings} />
      </main>
      <FinalCtaSection finalCta={data.finalCta} />
      <SiteFooter footer={data.footer} brand={data.brand} />
    </div>
  )
}
