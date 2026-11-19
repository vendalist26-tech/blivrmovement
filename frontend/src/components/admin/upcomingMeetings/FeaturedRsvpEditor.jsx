/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import {
  BUILTIN_FIELD_IDS,
  DEFAULT_RSVP_CONFIG,
  RSVP_FIELD_PRESETS,
  RSVP_FIELD_TYPES,
  createRsvpField,
  isValidRsvpFieldId,
  normalizeRsvpConfig,
  normalizeRsvpField,
  slugifyRsvpFieldId,
  uniqueRsvpFieldId,
} from '@/lib/featuredMeetingRsvp'
import { TextField, TextAreaField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const FIELD_TYPE_LABELS = {
  text: 'Text',
  email: 'Email',
  tel: 'Phone (digits only)',
  number: 'Number (digits only)',
  textarea: 'Long text',
}

/**
 * @param {{ rsvp: object, onChange: (rsvp: object) => void }} props
 */
export function FeaturedRsvpEditor({ rsvp, onChange }) {
  const [config, setConfig] = useState(() => normalizeRsvpConfig(DEFAULT_RSVP_CONFIG))
  const [fieldList, setFieldList] = useState(() => normalizeRsvpConfig(DEFAULT_RSVP_CONFIG).fields)

  useEffect(() => {
    const normalized = normalizeRsvpConfig(rsvp)
    setConfig(normalized)
    setFieldList(normalized.fields)
  }, [rsvp])

  const pushChange = (nextConfig, nextFields) => {
    setConfig(nextConfig)
    setFieldList(nextFields)
    onChange({ ...nextConfig, fields: nextFields })
  }

  const sync = (patch) => {
    const next = { ...config, ...patch }
    pushChange(next, fieldList)
  }

  const setFields = (updater) => {
    setFieldList((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      onChange({ ...config, fields: next })
      return next
    })
  }

  const setField = (id, patch) => {
    setFields((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)))
  }

  const moveField = (index, direction) => {
    setFields((prev) => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const addField = () => {
    const field = uniqueRsvpFieldId(fieldList, createRsvpField())
    setFields((prev) => [...prev, field])
  }

  const addPreset = (presetId) => {
    if (fieldList.some((f) => f.id === presetId)) return
    const preset = RSVP_FIELD_PRESETS[presetId]
    if (!preset) return
    const field = normalizeRsvpField({
      id: presetId,
      ...preset,
      required: presetId === 'full_name' || presetId === 'email',
      visible: true,
    })
    if (!field) return
    setFields((prev) => [...prev, field])
  }

  const removeField = (id) => {
    setFields((prev) => prev.filter((f) => f.id !== id))
  }

  const updateFieldId = (oldId, rawId) => {
    const id = slugifyRsvpFieldId(rawId)
    if (!isValidRsvpFieldId(id) || id === oldId) {
      setField(oldId, { id: slugifyRsvpFieldId(rawId) || oldId })
      return
    }
    if (fieldList.some((f) => f.id === id && f.id !== oldId)) return
    setFields((prev) =>
      prev.map((row) =>
        row.id === oldId ? { ...row, id, custom: !BUILTIN_FIELD_IDS.includes(id) } : row,
      ),
    )
  }

  const unusedPresets = BUILTIN_FIELD_IDS.filter((id) => !fieldList.some((f) => f.id === id))

  return (
    <div className="space-y-5">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={config.enabled !== false}
            onChange={(e) => sync({ enabled: e.target.checked })}
          />
          Show RSVP button on featured meeting
        </label>

        <p className="text-xs text-slate-500 dark:text-zinc-500">
          <Link
            to="/admin/meeting-rsvps"
            className="font-medium text-slate-700 underline-offset-2 hover:underline dark:text-zinc-300"
          >
            View all RSVP submissions →
          </Link>
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Button label"
            value={config.buttonLabel ?? ''}
            onChange={(e) => sync({ buttonLabel: e.target.value })}
          />
          <TextField
            label="Submit button label"
            value={config.submitLabel ?? ''}
            onChange={(e) => sync({ submitLabel: e.target.value })}
          />
          <TextField
            label="Modal eyebrow"
            value={config.modalEyebrow ?? ''}
            onChange={(e) => sync({ modalEyebrow: e.target.value })}
          />
          <TextField
            label="Modal title"
            value={config.modalTitle ?? ''}
            onChange={(e) => sync({ modalTitle: e.target.value })}
          />
          <TextAreaField
            className="sm:col-span-2"
            label="Modal subtitle"
            rows={2}
            value={config.modalSubtitle ?? ''}
            onChange={(e) => sync({ modalSubtitle: e.target.value })}
          />
          <TextField
            label="Success title"
            value={config.successTitle ?? ''}
            onChange={(e) => sync({ successTitle: e.target.value })}
          />
          <TextAreaField
            className="sm:col-span-2"
            label="Success message"
            rows={2}
            value={config.successMessage ?? ''}
            onChange={(e) => sync({ successMessage: e.target.value })}
          />
        </div>

        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Form fields
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                Add, reorder, and configure fields. Phone and number types accept digits only on the public form.
              </p>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={addField} className="shrink-0">
              <Plus className="mr-1.5 h-4 w-4" aria-hidden />
              Add field
            </Button>
          </div>

          {unusedPresets.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {unusedPresets.map((id) => (
                <Button key={id} type="button" variant="ghost" size="sm" onClick={() => addPreset(id)}>
                  + {RSVP_FIELD_PRESETS[id]?.label ?? id}
                </Button>
              ))}
            </div>
          ) : null}

          <ul className="mt-3 space-y-3">
            {fieldList.map((field, index) => (
              <li
                key={field.id}
                className={cn(
                  'rounded-lg border p-4',
                  field.visible
                    ? 'border-slate-200/90 dark:border-white/10'
                    : 'border-dashed border-slate-200/60 opacity-70 dark:border-white/10',
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-zinc-100">
                    {field.label || field.id}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => moveField(index, -1)}
                    >
                      Up
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={index >= fieldList.length - 1}
                      onClick={() => moveField(index, 1)}
                    >
                      Down
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(field.id)}
                      aria-label={`Remove ${field.label}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <TextField
                    label="Label"
                    value={field.label}
                    onChange={(e) => setField(field.id, { label: e.target.value })}
                  />
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                      Field type
                    </label>
                    <select
                      value={field.type}
                      onChange={(e) => setField(field.id, { type: e.target.value })}
                      className="w-full rounded-xl border border-slate-200/90 bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 dark:border-white/12 dark:bg-zinc-950/80 dark:text-zinc-100"
                    >
                      {RSVP_FIELD_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {FIELD_TYPE_LABELS[type] ?? type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <TextField
                    label="Field key"
                    value={field.id}
                    disabled={!field.custom && BUILTIN_FIELD_IDS.includes(field.id)}
                    onChange={(e) => updateFieldId(field.id, e.target.value)}
                    onBlur={(e) => updateFieldId(field.id, e.target.value)}
                  />
                  <TextField
                    label="Placeholder"
                    value={field.placeholder}
                    onChange={(e) => setField(field.id, { placeholder: e.target.value })}
                  />
                  {field.type === 'number' ? (
                    <>
                      <TextField
                        label="Min"
                        type="number"
                        value={field.min ?? ''}
                        onChange={(e) =>
                          setField(field.id, {
                            min: e.target.value === '' ? undefined : Number(e.target.value),
                          })
                        }
                      />
                      <TextField
                        label="Max"
                        type="number"
                        value={field.max ?? ''}
                        onChange={(e) =>
                          setField(field.id, {
                            max: e.target.value === '' ? undefined : Number(e.target.value),
                          })
                        }
                      />
                    </>
                  ) : null}
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.visible}
                      onChange={(e) => setField(field.id, { visible: e.target.checked })}
                    />
                    Show on form
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.required}
                      disabled={!field.visible}
                      onChange={(e) => setField(field.id, { required: e.target.checked })}
                    />
                    Required
                  </label>
                </div>
              </li>
            ))}
          </ul>

          {fieldList.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">Add at least one field for the RSVP form.</p>
          ) : null}
        </div>
    </div>
  )
}
