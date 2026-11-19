/** @typedef {'total' | 'in-person' | 'online'} StatCountType */
/** @typedef {'calendar' | 'users'} StatIcon */

/**
 * @typedef {Object} UpcomingMeetingStat
 * @property {string} id
 * @property {string} label
 * @property {string} suffix
 * @property {StatCountType} countType
 * @property {StatIcon} icon
 * @property {boolean} visible
 */

export const DEFAULT_UPCOMING_MEETING_STATS = [
  {
    id: 'calendar',
    label: 'On the calendar',
    suffix: 'gatherings',
    countType: 'total',
    icon: 'calendar',
    visible: true,
  },
  {
    id: 'in-person',
    label: 'In person',
    suffix: 'spaces',
    countType: 'in-person',
    icon: 'users',
    visible: true,
  },
  {
    id: 'online',
    label: 'Online',
    suffix: 'prayer calls',
    countType: 'online',
    icon: 'users',
    visible: true,
  },
]

/**
 * @param {unknown} stats
 * @returns {UpcomingMeetingStat[]}
 */
export function normalizeUpcomingMeetingStats(stats) {
  if (!Array.isArray(stats) || stats.length === 0) {
    return DEFAULT_UPCOMING_MEETING_STATS.map((s) => ({ ...s }))
  }

  const byId = Object.fromEntries(
    stats
      .filter((s) => s && typeof s === 'object' && s.id)
      .map((s) => [s.id, s]),
  )

  return DEFAULT_UPCOMING_MEETING_STATS.map((def) => {
    const row = byId[def.id] ?? {}
    const countType = ['total', 'in-person', 'online'].includes(row.countType)
      ? row.countType
      : def.countType
    const icon = ['calendar', 'users'].includes(row.icon) ? row.icon : def.icon
    return {
      id: def.id,
      label: typeof row.label === 'string' && row.label.trim() ? row.label.trim() : def.label,
      suffix: typeof row.suffix === 'string' && row.suffix.trim() ? row.suffix.trim() : def.suffix,
      countType,
      icon,
      visible: row.visible !== false,
    }
  })
}

/**
 * @param {UpcomingMeetingStat} stat
 * @param {{ total: number, inPerson: number, online: number }} counts
 */
export function formatStatValue(stat, counts) {
  const n =
    stat.countType === 'in-person'
      ? counts.inPerson
      : stat.countType === 'online'
        ? counts.online
        : counts.total
  return `${n} ${stat.suffix}`.trim()
}

/**
 * @param {unknown} page
 * @param {{ total: number, inPerson: number, online: number }} counts
 * @returns {Array<UpcomingMeetingStat & { value: string }>}
 */
export function visibleUpcomingMeetingStats(page, counts) {
  if (page?.statsSectionVisible === false) return []
  return normalizeUpcomingMeetingStats(page?.stats)
    .filter((s) => s.visible)
    .map((s) => ({ ...s, value: formatStatValue(s, counts) }))
}
