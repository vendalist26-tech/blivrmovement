/** Fallback when API options are unavailable. */
export const UPCOMING_MEETING_OPTIONS_FALLBACK = [
  { value: 'may-10-sunday-popup', label: '10th May Sunday Pop-up' },
  { value: 'thursday-weekly-meetings', label: 'Thursday Weekly meetings' },
  { value: 'tuesday-5am-zoom-prayers', label: 'Tuesday 5am Zoom prayers' },
  { value: 'wednesday-8pm-zoom-prayers', label: 'Wednesday 8pm Zoom prayers' },
  { value: 'may-31-mega-popup', label: '31st May BLiVR Mega Pop-up' },
]

/** @deprecated Use `UPCOMING_MEETING_OPTIONS_FALLBACK` or API `options`. */
export const UPCOMING_MEETING_OPTIONS = UPCOMING_MEETING_OPTIONS_FALLBACK

export function formatUpcomingMeetings(values, options = UPCOMING_MEETING_OPTIONS_FALLBACK) {
  if (!Array.isArray(values) || values.length === 0) return '—'
  const map = Object.fromEntries((options ?? []).map((o) => [o.value, o.label]))
  return values.map((v) => map[v] ?? v).join(', ')
}
