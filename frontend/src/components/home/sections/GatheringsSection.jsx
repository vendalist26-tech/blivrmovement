import { useMemo, useState } from 'react'
import { Play } from 'lucide-react'
import { Reveal } from '@/components/home/Reveal'
import { HomeSectionPanel } from '@/components/home/HomeSectionPanel'
import { SectionDivider } from '../SectionDivider'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { YouTubeModal } from '@/components/home/YouTubeModal'
import { parseYoutubeVideoId } from '@/lib/youtube'
import { cn } from '@/lib/cn'
import { siteImageSrc } from '@/lib/siteImage'

/** Default Sunday Pop-up episode — override via Site Admin → Gatherings → youtubeUrl */
const DEFAULT_GATHERINGS_YOUTUBE_URL = 'https://youtu.be/aAEFu5cBAf4'

/**
 * @param {{ gatherings: object }} props
 */
export function GatheringsSection({ gatherings }) {
  const [videoOpen, setVideoOpen] = useState(false)
  const videoId = useMemo(() => {
    const fromCms = parseYoutubeVideoId(gatherings?.youtubeUrl?.trim())
    if (fromCms) return fromCms
    return parseYoutubeVideoId(DEFAULT_GATHERINGS_YOUTUBE_URL)
  }, [gatherings?.youtubeUrl])

  if (!gatherings) return null
  const coverSrc = siteImageSrc(gatherings, '/BSEP01-cover.jpg')

  return (
    <section id="gatherings" className="scroll-mt-20 sm:scroll-mt-24">
      <Reveal delay={70}>
        <HomeSectionPanel>
        <SectionHeading
          // eyebrow="Section 6"
          title={gatherings.title}
          subtitle={gatherings.lede}
          subtitleClass="text-base text-zinc-400"
        />
        <SectionDivider />

        <div className="mt-6 grid items-center gap-8 sm:mt-7 sm:gap-10 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-5">
            {videoId ? (
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className={cn(
                  'group relative block w-full overflow-hidden rounded-md border border-white/10 shadow-2xl shadow-black/40',
                  'cursor-pointer transition ring-offset-2 ring-offset-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/80',
                )}
                aria-label="Play Sunday Pop-up video"
              >
                <img
                  src="/BSEP01-cover.jpg"
                  alt=""
                  className="aspect-video w-full object-cover object-center transition duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <span
                  className="absolute inset-0 flex items-center justify-center bg-black/40 transition group-hover:bg-black/50"
                  aria-hidden
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-zinc-900 shadow-lg ring-2 ring-white/60 sm:h-16 sm:w-16">
                    <Play className="ml-0.5 h-7 w-7 shrink-0 fill-zinc-900 text-zinc-900 sm:h-8 sm:w-8" strokeWidth={1.5} />
                  </span>
                </span>
              </button>
            ) : (
              <div className="overflow-hidden rounded-md border border-white/10 shadow-2xl shadow-black/40">
                <img
                  src={coverSrc}
                  alt=""
                  className="aspect-video w-full object-cover object-center"
                  loading="lazy"
                />
              </div>
            )}
          </div>
          <div className="order-1 space-y-6 sm:space-y-7 lg:order-2 lg:col-span-7">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Expect</p>
            <ul className="space-y-2 text-zinc-200">
              {gatherings.expect?.map((e) => (
                <li key={e} className="flex gap-2 text-sm sm:text-base">
                  <span className="text-amber-200/80">·</span>
                  {e}
                </li>
              ))}
            </ul>
            <dl className="rounded-md border border-white/10 bg-white/[0.04] p-4 text-sm sm:p-5">
              <div className="grid gap-1 sm:grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] sm:gap-x-4 sm:gap-y-4">
                <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-zinc-400 sm:pt-0.5">
                  Location
                </dt>
                <dd className="min-w-0 text-[0.875rem] leading-relaxed text-zinc-200 sm:text-[0.9rem]">
                  {gatherings.location}
                </dd>
                {/* <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-zinc-400 sm:pt-0.5">
                  Date & time
                </dt>
                <dd className="min-w-0 text-[0.875rem] leading-relaxed text-zinc-200 sm:text-[0.9rem]">
                  <span className="whitespace-pre-wrap">{gatherings.time}</span>
                </dd> */}
              </div>
            </dl>
            {gatherings.cta?.label ? (
              <ButtonLink href={gatherings.cta.href} variant="hero" className="w-full sm:w-auto">
                {gatherings.cta.label}
              </ButtonLink>
            ) : null}
          </div>
        </div>
        </HomeSectionPanel>
      </Reveal>

      <YouTubeModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoId={videoId}
        title={gatherings.title ? `${gatherings.title} — video` : 'Video'}
      />
    </section>
  )
}
