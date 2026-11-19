import { useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminTabs } from '@/components/admin/AdminTabs'
import { SiteImageUpload } from '@/components/admin/site/SiteImageUpload'
import { TextField, TextAreaField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

/** Homepage editor tabs — add or reorder entries here. */
const HOMEPAGE_TAB_DEFS = [
  { id: 'brand', label: 'Brand & SEO' },
  { id: 'hero', label: 'Hero' },
  { id: 'who', label: 'Who' },
  { id: 'believe', label: 'Believe' },
  { id: 'mission', label: 'Mission' },
  { id: 'meetings', label: 'Meetings' },
  { id: 'growth', label: 'Growth' },
  { id: 'video', label: 'Video' },
  { id: 'gatherings', label: 'Gatherings' },
  { id: 'final-cta', label: 'Final CTA' },
  { id: 'footer', label: 'Footer' },
]

function sectionTitleClass(className = '') {
  return cn('text-sm font-semibold text-slate-800 dark:text-zinc-100', className)
}

function StringListEditor({
  label,
  items,
  onChange,
  addLabel = 'Add line',
  removeLabel = 'Remove',
}) {
  const list = Array.isArray(items) ? items : []
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400">
        {label}
      </p>
      <ul className="space-y-2">
        {list.map((line, i) => (
          <li key={i} className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <TextField
              className="min-w-0 flex-1"
              value={line}
              onChange={(e) => {
                const n = [...list]
                n[i] = e.target.value
                onChange(n)
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={() => onChange(list.filter((_, j) => j !== i))}
            >
              {removeLabel}
            </Button>
          </li>
        ))}
      </ul>
      <Button type="button" variant="secondary" size="sm" onClick={() => onChange([...list, ''])}>
        {addLabel}
      </Button>
    </div>
  )
}

function CtaFields({ value, onChange, idBase }) {
  const v = value && typeof value === 'object' ? value : {}
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <TextField
        id={`${idBase}-label`}
        label="Button label"
        value={v.label ?? ''}
        onChange={(e) => onChange({ ...v, label: e.target.value })}
      />
      <TextField
        id={`${idBase}-href`}
        label="URL / anchor (e.g. /get-connected)"
        value={v.href ?? ''}
        onChange={(e) => onChange({ ...v, href: e.target.value })}
      />
    </div>
  )
}

function TabPanel({ title, description, children, contentClassName = 'space-y-4' }) {
  return (
    <div className={cn('space-y-4', contentClassName)}>
      {title || description ? (
        <div>
          {title ? <h3 className={sectionTitleClass()}>{title}</h3> : null}
          {description ? (
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  )
}

/**
 * @param {{ defaultData: Record<string, unknown>, onSave: (v: Record<string, unknown>) => void, isSaving?: boolean }} props
 */
export function SiteContentForm({ defaultData, onSave, isSaving = false }) {
  const [data, setData] = useState(() => structuredClone(defaultData))
  const rid = useId()
  const p = (path, partial) => {
    setData((d) => {
      const n = { ...d }
      if (path === 'hero') n.hero = { ...(d.hero || {}), ...partial }
      else if (path === 'who') n.who = { ...(d.who || {}), ...partial }
      else if (path === 'believe') n.believe = { ...(d.believe || {}), ...partial }
      else if (path === 'mission') n.mission = { ...(d.mission || {}), ...partial }
      else if (path === 'growth') n.growth = { ...(d.growth || {}), ...partial }
      else if (path === 'gatherings') n.gatherings = { ...(d.gatherings || {}), ...partial }
      else if (path === 'finalCta') n.finalCta = { ...(d.finalCta || {}), ...partial }
      else if (path === 'mayInfo') n.mayInfo = { ...(d.mayInfo || {}), ...partial }
      else if (path === 'footer') n.footer = { ...(d.footer || {}), ...partial }
      else if (path === 'meta') n.meta = { ...(d.meta || {}), ...partial }
      return n
    })
  }

  const hero = data.hero ?? {}
  const who = data.who ?? {}
  const believe = data.believe ?? {}
  const mission = data.mission ?? {}
  const growth = data.growth ?? { items: [] }
  const gatherings = data.gatherings ?? {}
  const finalCta = data.finalCta ?? {}
  const mayInfo = data.mayInfo ?? { enabled: true, title: '', videoUrl: '' }
  const footer = data.footer ?? {}
  const meta = data.meta ?? {}

  const growthItems = Array.isArray(growth.items) ? growth.items : []

  const [activeTab, setActiveTab] = useState('brand')

  const tabs = useMemo(
    () =>
      HOMEPAGE_TAB_DEFS.map((tab) =>
        tab.id === 'growth'
          ? { ...tab, badge: growthItems.length || undefined }
          : tab,
      ),
    [growthItems.length],
  )

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-slate-200/90 px-4 py-4 dark:border-white/10 sm:px-6">
        <Alert variant="info">
        <p className="text-sm">
          <strong>Upcoming meetings</strong> (carousel + full page) →{' '}
          <Link to="/admin/upcoming-meetings" className="font-medium underline">
            Admin → Upcoming meetings
          </Link>
          . Homepage order: Hero → Who → Believe → Mission → Upcoming meetings → Growth → Video →
          Gatherings → Final CTA.
        </p>
      </Alert>
      </div>

      <div className="px-4 sm:px-6">
        <AdminTabs tabs={tabs} activeId={activeTab} onChange={setActiveTab}>
          {activeTab === 'brand' && (
            <TabPanel title="Brand & SEO"
              description="Site name, title tag, and meta description.">

        <TextField
          id={`${rid}-brand`}
          label="Brand (header wordmark)"
          value={data.brand ?? ''}
          onChange={(e) => setData((d) => ({ ...d, brand: e.target.value }))}
        />
        <TextField
          id={`${rid}-meta-title`}
          label="Page title (browser / SEO)"
          value={meta.title ?? ''}
          onChange={(e) => p('meta', { title: e.target.value })}
        />
        <TextAreaField
          id={`${rid}-meta-desc`}
          label="Meta description"
          value={meta.description ?? ''}
          onChange={(e) => p('meta', { description: e.target.value })}
          rows={3}
        />
            </TabPanel>
          )}

          {activeTab === 'hero' && (
            <TabPanel title="Hero"
              description="Full-viewport hero: separate images for mobile (portrait) and desktop (landscape).">

          <TextField
            id={`${rid}-hero-headline`}
            label="Headline"
            value={hero.headline ?? ''}
            onChange={(e) => p('hero', { headline: e.target.value })}
          />
          <TextField
            id={`${rid}-hero-subhead`}
            label="Subhead (italic line)"
            value={hero.subhead ?? ''}
            onChange={(e) => p('hero', { subhead: e.target.value })}
          />
          <TextAreaField
            id={`${rid}-hero-body`}
            label="Body copy"
            value={hero.body ?? ''}
            onChange={(e) => p('hero', { body: e.target.value })}
            rows={4}
          />
          <SiteImageUpload
            label="Mobile hero image (phones)"
            folder="hero-mobile"
            image={hero.mobileImage ?? hero.image}
            imagePath={hero.mobileImagePath}
            imageUrl={hero.mobileImageUrl}
            aspectClass="aspect-[9/16] max-w-[12rem]"
            fallback="/HERO1Mobile3.jpg"
            onChange={(patch) =>
              p('hero', {
                mobileImage: patch.image,
                mobileImagePath: patch.imagePath,
                mobileImageUrl: patch.imageUrl,
              })
            }
          />
          <SiteImageUpload
            label="Desktop hero image (tablet & up)"
            folder="hero-desktop"
            image={hero.desktopImage}
            imagePath={hero.desktopImagePath}
            imageUrl={hero.desktopImageUrl}
            aspectClass="aspect-video max-w-lg"
            fallback="/HERO1copy.jpg"
            onChange={(patch) =>
              p('hero', {
                desktopImage: patch.image,
                desktopImagePath: patch.imagePath,
                desktopImageUrl: patch.imageUrl,
              })
            }
          />
          <p className={cn('text-xs font-medium uppercase tracking-wider', 'text-slate-500 dark:text-zinc-400')}>
            Primary button
          </p>
          <CtaFields
            idBase={`${rid}-hero-p`}
            value={hero.primaryCta}
            onChange={(v) => p('hero', { primaryCta: v })}
          />
          <p className={cn('text-xs font-medium uppercase tracking-wider', 'text-slate-500 dark:text-zinc-400')}>
            Secondary button
          </p>
        <CtaFields
          idBase={`${rid}-hero-s`}
          value={hero.secondaryCta}
          onChange={(v) => p('hero', { secondaryCta: v })}
        />
            </TabPanel>
          )}

          {activeTab === 'who' && (
            <TabPanel title="Who (Section 2)">

        <TextField
          id={`${rid}-who-title`}
          label="Section title"
          value={who.title ?? ''}
          onChange={(e) => p('who', { title: e.target.value })}
        />
        <StringListEditor
          label="Main bullet lines"
          items={who.lines}
          onChange={(lines) => p('who', { lines })}
          addLabel="Add line"
        />
        <TextField
          id={`${rid}-who-intro`}
          label="Intro (e.g. “Whether you’re a:”)"
          value={who.intro ?? ''}
          onChange={(e) => p('who', { intro: e.target.value })}
        />
        <StringListEditor
          label="Roles / list under intro"
          items={who.roles}
          onChange={(roles) => p('who', { roles })}
          addLabel="Add role line"
        />
        <TextAreaField
          id={`${rid}-who-closing`}
          label="Closing line"
          value={who.closing ?? ''}
          onChange={(e) => p('who', { closing: e.target.value })}
          rows={2}
        />
        <SiteImageUpload
          label="Section image"
          folder="who"
          image={who.image}
          imagePath={who.imagePath}
          imageUrl={who.imageUrl}
          aspectClass="aspect-[3/4] max-w-xs"
          fallback="/1.jpg"
          onChange={(patch) =>
            p('who', {
              image: patch.image,
              imagePath: patch.imagePath,
              imageUrl: patch.imageUrl,
            })
          }
        />
            </TabPanel>
          )}

          {activeTab === 'believe' && (
            <TabPanel title="Believe (Manifesto)">

        <TextField
          id={`${rid}-believe-title`}
          label="Title"
          value={believe.title ?? ''}
          onChange={(e) => p('believe', { title: e.target.value })}
        />
        <StringListEditor
          label="Paragraphs"
          items={believe.paragraphs}
          onChange={(paragraphs) => p('believe', { paragraphs })}
          addLabel="Add paragraph"
        />
        <SiteImageUpload
          label="Manifesto photo"
          folder="believe"
          image={believe.image}
          imagePath={believe.imagePath}
          imageUrl={believe.imageUrl}
          aspectClass="aspect-[3/4] max-w-sm"
          fallback="/GnaTA01.jpg"
          onChange={(patch) =>
            p('believe', {
              image: patch.image,
              imagePath: patch.imagePath,
              imageUrl: patch.imageUrl,
            })
          }
        />
            </TabPanel>
          )}

          {activeTab === 'mission' && (
            <TabPanel title="Mission & vision">

          <TextField
            id={`${rid}-m-vt`}
            label="Vision title"
            value={mission.visionTitle ?? ''}
            onChange={(e) => p('mission', { visionTitle: e.target.value })}
          />
          <TextAreaField
            id={`${rid}-m-v`}
            label="Vision text"
            value={mission.vision ?? ''}
            onChange={(e) => p('mission', { vision: e.target.value })}
            rows={4}
          />
          <TextField
            id={`${rid}-m-mt`}
            label="Mission title"
            value={mission.missionTitle ?? ''}
            onChange={(e) => p('mission', { missionTitle: e.target.value })}
          />
          <TextAreaField
            id={`${rid}-m-m`}
            label="Mission text"
            value={mission.mission ?? ''}
            onChange={(e) => p('mission', { mission: e.target.value })}
            rows={4}
          />
        <SiteImageUpload
          label="Section image"
          folder="mission"
          image={mission.image}
          imagePath={mission.imagePath}
          imageUrl={mission.imageUrl}
          aspectClass="aspect-[4/5] max-w-sm"
          fallback="/VSMS01.jpg"
          onChange={(patch) =>
            p('mission', {
              image: patch.image,
              imagePath: patch.imagePath,
              imageUrl: patch.imageUrl,
            })
          }
        />
            </TabPanel>
          )}

          {activeTab === 'meetings' && (
            <TabPanel title="Upcoming meetings (homepage block)"
              description="Carousel copy is edited under Admin → Upcoming meetings. This section only appears on the homepage.">

        <p className="text-sm text-slate-600 dark:text-zinc-400">
          Manage meeting cards, carousel text, stat cards, and the full{' '}
          <Link to="/admin/upcoming-meetings" className="font-medium underline">
            /upcoming-meetings
          </Link>{' '}
          page in the Upcoming meetings admin.
        </p>
            </TabPanel>
          )}

          {activeTab === 'growth' && (
            <TabPanel title="Growth (pillars / cards)"
              contentClassName="space-y-6">

          <TextField
            id={`${rid}-g-title`}
            label="Section title"
            value={growth.title ?? ''}
            onChange={(e) => p('growth', { title: e.target.value })}
          />
          <TextField
            id={`${rid}-g-sub`}
            label="Subtitle"
            value={growth.subtitle ?? ''}
            onChange={(e) => p('growth', { subtitle: e.target.value })}
          />
          {growthItems.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200/80 p-4 dark:border-white/10"
            >
              <p className="mb-3 text-xs font-medium uppercase text-slate-500 dark:text-zinc-400">
                Card {i + 1}
              </p>
              <div className="space-y-3">
                <TextField
                  id={`${rid}-g-icon-${i}`}
                  label="Icon (emoji)"
                  value={item?.icon ?? ''}
                  onChange={(e) => {
                    const next = growthItems.map((it, j) =>
                      j === i ? { ...it, icon: e.target.value } : it,
                    )
                    p('growth', { items: next })
                  }}
                />
                <TextField
                  id={`${rid}-g-ct-${i}`}
                  label="Title"
                  value={item?.title ?? ''}
                  onChange={(e) => {
                    const next = growthItems.map((it, j) =>
                      j === i ? { ...it, title: e.target.value } : it,
                    )
                    p('growth', { items: next })
                  }}
                />
                <TextAreaField
                  id={`${rid}-g-cx-${i}`}
                  label="Text"
                  value={item?.text ?? ''}
                  onChange={(e) => {
                    const next = growthItems.map((it, j) =>
                      j === i ? { ...it, text: e.target.value } : it,
                    )
                    p('growth', { items: next })
                  }}
                  rows={2}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    p('growth', { items: growthItems.filter((_, j) => j !== i) })
                  }}
                >
                  Remove card
                </Button>
              </div>
            </div>
          ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            p('growth', {
              items: [...growthItems, { icon: '', title: '', text: '' }],
            })
          }
        >
          Add card
        </Button>
            </TabPanel>
          )}

          {activeTab === 'video' && (
            <TabPanel title="Video embed"
              description="Vimeo or YouTube between Growth and Gatherings.">

        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={mayInfo.enabled !== false}
            onChange={(e) => p('mayInfo', { enabled: e.target.checked })}
          />
          Show video section on homepage
        </label>
        <TextField
          id={`${rid}-may-title`}
          label="Optional title above video"
          value={mayInfo.title ?? ''}
          onChange={(e) => p('mayInfo', { title: e.target.value })}
        />
        <TextField
          id={`${rid}-may-video`}
          label="Video URL (Vimeo or YouTube)"
          value={mayInfo.videoUrl ?? ''}
          onChange={(e) => p('mayInfo', { videoUrl: e.target.value })}
          placeholder="https://vimeo.com/…"
        />
            </TabPanel>
          )}

          {activeTab === 'gatherings' && (
            <TabPanel title="Gatherings">

        <TextField
            id={`${rid}-ga-title`}
            label="Title"
            value={gatherings.title ?? ''}
            onChange={(e) => p('gatherings', { title: e.target.value })}
          />
          <TextAreaField
            id={`${rid}-ga-lede`}
            label="Intro (lede)"
            value={gatherings.lede ?? ''}
            onChange={(e) => p('gatherings', { lede: e.target.value })}
            rows={3}
          />
          <StringListEditor
            label="“Expect” bullet list"
            items={gatherings.expect}
            onChange={(expect) => p('gatherings', { expect })}
            addLabel="Add bullet"
          />
          <TextField
            id={`${rid}-ga-loc`}
            label="Location"
            value={gatherings.location ?? ''}
            onChange={(e) => p('gatherings', { location: e.target.value })}
          />
          <TextField
            id={`${rid}-ga-time`}
            label="Time"
            value={gatherings.time ?? ''}
            onChange={(e) => p('gatherings', { time: e.target.value })}
          />
          <SiteImageUpload
            label="Video cover thumbnail"
            folder="gatherings"
            image={gatherings.image}
            imagePath={gatherings.imagePath}
            imageUrl={gatherings.imageUrl}
            aspectClass="aspect-video max-w-md"
            fallback="/BSEP01-cover.jpg"
            onChange={(patch) =>
              p('gatherings', {
                image: patch.image,
                imagePath: patch.imagePath,
                imageUrl: patch.imageUrl,
              })
            }
          />
          <TextField
            id={`${rid}-ga-youtube`}
            label="Gatherings cover video (YouTube URL or 11-char ID)"
            value={gatherings.youtubeUrl ?? ''}
            onChange={(e) => p('gatherings', { youtubeUrl: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=…"
          />
          <p className={cn('text-xs font-medium uppercase tracking-wider', 'text-slate-500 dark:text-zinc-400')}>
            CTA button
          </p>
        <CtaFields
          idBase={`${rid}-ga-cta`}
          value={gatherings.cta}
          onChange={(v) => p('gatherings', { cta: v })}
        />
            </TabPanel>
          )}

          {activeTab === 'final-cta' && (
            <TabPanel title="Final CTA">

        <TextField
            id={`${rid}-fc-title`}
            label="Title"
            value={finalCta.title ?? ''}
            onChange={(e) => p('finalCta', { title: e.target.value })}
          />
          <TextAreaField
            id={`${rid}-fc-body`}
            label="Body"
            value={finalCta.body ?? ''}
            onChange={(e) => p('finalCta', { body: e.target.value })}
            rows={4}
          />
          <SiteImageUpload
            label="Background image (optional)"
            folder="final-cta"
            image={finalCta.image ?? ''}
            imagePath={finalCta.imagePath}
            imageUrl={finalCta.imageUrl}
            aspectClass="aspect-[21/9] max-w-lg"
            onChange={(patch) =>
              p('finalCta', {
                image: patch.image,
                imagePath: patch.imagePath,
                imageUrl: patch.imageUrl,
              })
            }
          />
          <p className={cn('text-xs font-medium uppercase tracking-wider', 'text-slate-500 dark:text-zinc-400')}>
            Primary button
          </p>
          <CtaFields
            idBase={`${rid}-fc-p`}
            value={finalCta.primary}
            onChange={(v) => p('finalCta', { primary: v })}
          />
          <p className={cn('text-xs font-medium uppercase tracking-wider', 'text-slate-500 dark:text-zinc-400')}>
            Secondary button
          </p>
        <CtaFields
            idBase={`${rid}-fc-s`}
            value={finalCta.secondary}
            onChange={(v) => p('finalCta', { secondary: v })}
          />
            </TabPanel>
          )}

          {activeTab === 'footer' && (
            <TabPanel title="Footer">

        <TextField
            id={`${rid}-ft-l1`}
            label="Line 1 (title)"
            value={footer.line1 ?? ''}
            onChange={(e) => p('footer', { line1: e.target.value })}
          />
          <TextField
            id={`${rid}-ft-l2`}
            label="Line 2 (subtitle)"
            value={footer.line2 ?? ''}
            onChange={(e) => p('footer', { line2: e.target.value })}
          />
          <TextField
            id={`${rid}-ft-tag`}
            label="Tagline"
            value={footer.tagline ?? ''}
            onChange={(e) => p('footer', { tagline: e.target.value })}
          />
          <TextField
            id={`${rid}-ft-ig`}
            label="Instagram URL"
            value={footer.instagram ?? ''}
            onChange={(e) => p('footer', { instagram: e.target.value })}
          />
          <TextField
            id={`${rid}-ft-mail`}
            label="Email"
            type="email"
            value={footer.email ?? ''}
            onChange={(e) => p('footer', { email: e.target.value })}
          />
        <TextField
            id={`${rid}-ft-loc`}
            label="Location (one line)"
            value={footer.location ?? ''}
            onChange={(e) => p('footer', { location: e.target.value })}
          />
            </TabPanel>
          )}
        </AdminTabs>
      </div>

      <div
        className={cn(
          'sticky bottom-0 z-10 flex justify-end border-t border-slate-200/90 bg-white/95 px-4 py-4 backdrop-blur-sm',
          'dark:border-white/10 dark:bg-zinc-950/95 sm:px-6',
        )}
      >
        <Button
          type="button"
          variant="primary"
          onClick={() => onSave(structuredClone(data))}
          disabled={isSaving}
        >
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </Card>
  )
}
