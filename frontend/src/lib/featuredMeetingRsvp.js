/** @typedef {'text' | 'email' | 'tel' | 'number' | 'textarea'} RsvpFieldType */

/**
 * @typedef {Object} RsvpField
 * @property {string} id
 * @property {RsvpFieldType} type
 * @property {string} label
 * @property {string} [placeholder]
 * @property {boolean} required
 * @property {boolean} visible
 * @property {number} [min]
 * @property {number} [max]
 * @property {boolean} [custom]
 */

export const RSVP_FIELD_ID_PATTERN = /^[a-z][a-z0-9_]{0,63}$/

export const RSVP_FIELD_TYPES = ['text', 'email', 'tel', 'number', 'textarea']

/** Built-in field keys (quick-add presets in admin). */
export const BUILTIN_FIELD_IDS = [
  'full_name',
  'email',
  'phone',
  'guest_count',
  'notes',
  'instagram_handle',
  'church_name',
]

export const RSVP_FIELD_PRESETS = {
  full_name: { type: 'text', label: 'Full name', placeholder: 'Your name' },
  email: { type: 'email', label: 'Email', placeholder: 'you@example.com' },
  phone: { type: 'tel', label: 'Phone', placeholder: '5555555555' },
  guest_count: { type: 'number', label: 'Additional guests', placeholder: '0', min: 0, max: 10 },
  notes: { type: 'textarea', label: 'Notes', placeholder: 'Anything we should know?' },
  instagram_handle: { type: 'text', label: 'Instagram', placeholder: '@yourhandle' },
  church_name: { type: 'text', label: 'Church', placeholder: 'Your church name' },
}

export const DEFAULT_RSVP_CONFIG = {
  enabled: true,
  buttonLabel: 'RSVP',
  modalEyebrow: 'Featured gathering',
  modalTitle: 'Reserve your spot',
  modalSubtitle: 'Let us know you are coming so we can plan ahead.',
  submitLabel: 'Submit RSVP',
  successTitle: 'You are on the list!',
  successMessage: 'Thanks for RSVPing. We will be in touch with any updates.',
  fields: [
    { id: 'full_name', ...RSVP_FIELD_PRESETS.full_name, required: true, visible: true },
    { id: 'email', ...RSVP_FIELD_PRESETS.email, required: true, visible: true },
    { id: 'phone', ...RSVP_FIELD_PRESETS.phone, required: false, visible: true },
    { id: 'guest_count', ...RSVP_FIELD_PRESETS.guest_count, required: false, visible: true },
    { id: 'notes', ...RSVP_FIELD_PRESETS.notes, required: false, visible: true },
  ],
}

/**
 * @param {string} text
 */
export function slugifyRsvpFieldId(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/^(\d)/, 'field_$1')
    .slice(0, 64) || 'custom_field'
}

/**
 * @param {string} id
 */
export function isValidRsvpFieldId(id) {
  return typeof id === 'string' && RSVP_FIELD_ID_PATTERN.test(id)
}

/**
 * @param {unknown} row
 * @returns {RsvpField | null}
 */
export function normalizeRsvpField(row) {
  if (!row || typeof row !== 'object' || !row.id) return null
  const id = String(row.id).trim()
  if (!isValidRsvpFieldId(id)) return null

  const preset = RSVP_FIELD_PRESETS[id] ?? {}
  const types = RSVP_FIELD_TYPES
  let type = String(row.type ?? preset.type ?? 'text')
  if (!types.includes(type)) type = preset.type ?? 'text'

  const field = {
    id,
    type,
    label: String(row.label ?? preset.label ?? id),
    placeholder: String(row.placeholder ?? preset.placeholder ?? ''),
    required: Boolean(row.required),
    visible: row.visible !== false,
    custom: !BUILTIN_FIELD_IDS.includes(id),
  }

  if (type === 'number') {
    if (row.min != null) field.min = Number(row.min)
    else if (preset.min != null) field.min = preset.min
    if (row.max != null) field.max = Number(row.max)
    else if (preset.max != null) field.max = preset.max
  }

  return field
}

/**
 * @param {unknown} rsvp
 * @returns {typeof DEFAULT_RSVP_CONFIG}
 */
export function normalizeRsvpConfig(rsvp) {
  const base = {
    ...DEFAULT_RSVP_CONFIG,
    fields: DEFAULT_RSVP_CONFIG.fields.map((f) => ({ ...f })),
  }
  if (!rsvp || typeof rsvp !== 'object') return base

  const incoming = /** @type {Record<string, unknown>} */ (rsvp)
  const rawFields = Array.isArray(incoming.fields) ? incoming.fields : []
  const fields = rawFields.map(normalizeRsvpField).filter(Boolean)

  return {
    ...base,
    ...incoming,
    enabled: incoming.enabled !== false,
    fields: fields.length ? fields : base.fields,
  }
}

/**
 * @param {typeof DEFAULT_RSVP_CONFIG} config
 * @returns {RsvpField[]}
 */
export function visibleRsvpFields(config) {
  if (!config?.enabled) return []
  return (config.fields ?? []).filter((f) => f.visible !== false)
}

/**
 * @param {RsvpField} field
 */
export function formatRsvpFieldLabel(field) {
  const label = String(field.label ?? '').trim()
  if (!label) return field.id
  if (field.required) return label
  if (/\(optional\)/i.test(label)) return label
  return `${label} (optional)`
}

/**
 * @param {RsvpFieldType | string} type
 */
export function isDigitsOnlyRsvpField(type) {
  return type === 'number' || type === 'tel'
}

/**
 * @param {RsvpFieldType | string} type
 * @param {string} value
 */
export function filterRsvpFieldValue(type, value) {
  if (!isDigitsOnlyRsvpField(type)) return value
  return value.replace(/\D/g, '')
}

/**
 * @param {{ label?: string, type?: RsvpFieldType }} [options]
 * @returns {RsvpField}
 */
export function createRsvpField(options = {}) {
  const label = options.label?.trim() || 'New question'
  const baseId = slugifyRsvpFieldId(label)
  const id = BUILTIN_FIELD_IDS.includes(baseId) ? `${baseId}_custom` : baseId

  return {
    id,
    type: options.type ?? 'text',
    label,
    placeholder: '',
    required: false,
    visible: true,
    custom: true,
  }
}

/**
 * Ensure unique field ids when adding.
 * @param {RsvpField[]} fields
 * @param {RsvpField} field
 */
export function uniqueRsvpFieldId(fields, field) {
  let id = field.id
  let n = 2
  const ids = new Set(fields.map((f) => f.id))
  while (ids.has(id)) {
    id = `${field.id}_${n}`
    n += 1
  }
  return { ...field, id }
}
