import { filterRsvpFieldValue, isDigitsOnlyRsvpField } from '@/lib/featuredMeetingRsvp'

/** Wrapper for each RSVP field (label margin handled via RSVP_FIELD_LABEL_CLASS). */
export const RSVP_FIELD_WRAPPER_CLASS = 'space-y-0'

/** Sentence-case labels for the public RSVP modal (no uppercase transform). */
export const RSVP_FIELD_LABEL_CLASS =
  'mb-2.5 block text-sm font-medium normal-case tracking-normal text-zinc-400 sm:mb-3'

/**
 * @param {import('@/lib/featuredMeetingRsvp').RsvpField} field
 */
export function rsvpInputType(field) {
  if (field.type === 'email') return 'email'
  if (field.type === 'number' || field.type === 'tel') return 'text'
  return 'text'
}

/**
 * @param {import('@/lib/featuredMeetingRsvp').RsvpField} field
 */
export function rsvpInputMode(field) {
  if (field.type === 'email') return 'email'
  if (isDigitsOnlyRsvpField(field.type)) return 'numeric'
  return 'text'
}

/**
 * @param {import('@/lib/featuredMeetingRsvp').RsvpField} field
 * @param {string} next
 */
export function sanitizeRsvpInputValue(field, next) {
  let value = filterRsvpFieldValue(field.type, next)
  if (field.type === 'number' && field.max != null && value !== '') {
    const num = Number(value)
    if (num > field.max) value = String(field.max)
  }
  if (field.type === 'number' && field.min != null && value !== '') {
    const num = Number(value)
    if (num < field.min) value = String(field.min)
  }
  return value
}
