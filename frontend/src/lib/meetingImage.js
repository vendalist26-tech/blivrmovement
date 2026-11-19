import { resolveApiAssetUrl } from '@/lib/apiAssetUrl'

const FALLBACK_IMAGE = '/blvr-logo.jpeg'

/**
 * Resolve meeting image for display (API storage URL or fallback).
 * @param {{ imageUrl?: string | null, image?: string | null, imagePath?: string | null }} meeting
 */
export function meetingImageSrc(meeting) {
  const fromUrl = resolveApiAssetUrl(meeting?.imageUrl)
  if (fromUrl) return fromUrl
  const fromPath = resolveApiAssetUrl(meeting?.imagePath)
  if (fromPath) return fromPath
  if (meeting?.image) return meeting.image
  return FALLBACK_IMAGE
}

/**
 * Map API meeting payload to MeetingCard props.
 * @param {object} m
 */
export function normalizeMeeting(m) {
  if (!m) return null
  return {
    value: m.value,
    title: m.title,
    tagline: m.tagline ?? '',
    schedule: m.schedule,
    cadence: m.cadence ?? '',
    location: m.location,
    format: m.format === 'zoom' ? 'zoom' : 'in-person',
    image: meetingImageSrc(m),
    imageAlt: m.imageAlt || m.title || 'Meeting',
    description: m.description ?? '',
    highlights: Array.isArray(m.highlights) ? m.highlights : [],
    featured: Boolean(m.featured),
    isActive: m.isActive !== false,
  }
}
