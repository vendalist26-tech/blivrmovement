import { Reveal } from '@/components/home/Reveal'
import { HomeSectionPanel } from '@/components/home/HomeSectionPanel'
import { cn } from '@/lib/cn'

function getEmbedUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null
  const value = rawUrl.trim()
  if (!value) return null

  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase()

    if (host.includes('vimeo.com')) {
      const id = url.pathname.split('/').filter(Boolean).pop()
      if (!id) return null
      const params = new URLSearchParams({
        title: '0',
        byline: '0',
        portrait: '0',
        badge: '0',
        dnt: '1',
      })
      return `https://player.vimeo.com/video/${id}?${params.toString()}`
    }

    if (host.includes('youtube.com') || host === 'youtu.be') {
      let id = ''
      if (host === 'youtu.be') {
        id = url.pathname.replace('/', '').split('/')[0]
      } else {
        id = url.searchParams.get('v') || ''
        if (!id && url.pathname.includes('/embed/')) {
          id = url.pathname.split('/embed/')[1]?.split('/')[0] || ''
        }
      }
      if (!id) return null
      return `https://www.youtube-nocookie.com/embed/${id}`
    }
  } catch {
    return null
  }

  return null
}

export function MayInfoSection({
  title = '',
  videoUrl = 'https://vimeo.com/1190371963?fl=pl&fe=sh',
  panelClassName = '',
  panelPaddingClassName = '',
}) {
  const embedUrl = getEmbedUrl(videoUrl)
  if (!embedUrl) return null

  return (
    <section id="may-info" className="scroll-mt-20 sm:scroll-mt-24">
      <Reveal delay={55}>
        <HomeSectionPanel
          paddingClassName={panelPaddingClassName}
          className={cn(
            title ? 'space-y-2 sm:space-y-3' : '',
            panelClassName,
          )}
        >
          {title ? (
            <h2 className="text-center font-display text-2xl text-white sm:text-3xl">{title}</h2>
          ) : null}
          <div className="overflow-hidden rounded-md border border-white/10">
            <div className="aspect-video w-full bg-black">
            <iframe
              src={embedUrl}
              title={title}
              className="h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
            </div>
          </div>
        </HomeSectionPanel>
      </Reveal>
    </section>
  )
}
