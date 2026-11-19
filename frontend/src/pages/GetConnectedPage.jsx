import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { useSiteContent } from '@/hooks/useSiteContent'
import { Reveal } from '@/components/home/Reveal'
import { SiteFooter } from '@/components/home/sections/SiteFooter'
import { BrandLoadingScreen } from '@/components/ui/BrandLoadingScreen'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { TextField, TextAreaField } from '@/components/ui/TextField'
import { SelectSearch } from '@/components/ui/SelectSearch'
import { CustomDatePicker } from '@/components/ui/CustomDatePicker'
import { SuccessModal } from '@/components/ui/SuccessModal'
import { cn } from '@/lib/cn'
import { UPCOMING_MEETING_OPTIONS_FALLBACK } from '@/lib/upcomingMeetings'
import { submitGetConnected } from '@/api/client'

const CHURCH_STATUS_OPTIONS = [
  { value: 'no-church', label: "I don't have a church" },
  { value: 'not-frequent', label: "I have a church but don't attend frequently" },
  { value: 'started', label: 'Just started going to church' },
  { value: 'committed', label: 'Fully committed to a church' },
]

const INTEREST_OPTIONS = [
  'Music',
  'Photography',
  'Videography',
  'Fashion',
  'Graphic Design',
  'Writing',
  'Content Creation',
  'Entrepreneurship',
  'Tech / Product',
  'Public Speaking',
  'Ministry / Discipleship',
].map((label) => ({ value: label.toLowerCase().replace(/\s+/g, '-'), label }))

const YES_NO_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

function labelWithOptional(mainLabel) {
  return (
    <>
      {mainLabel}{' '}
      <span className="font-semibold">(optional)</span>
    </>
  )
}

function createEmptyForm() {
  return {
    fullName: '',
    age: '',
    dateOfBirth: '',
    location: '',
    phone: '',
    email: '',
    category: '',
    instagramHandle: '',
    occupation: '',
    isStudent: '',
    schoolName: '',
    program: '',
    yearOfStudy: '',
    churchStatus: '',
    talents: '',
    interests: [],
    upcomingMeetings: [],
    extraNotes: '',
    acceptedJesus: '',
    prayerRequests: '',
  }
}

function normalizeHandle(handle) {
  return handle.trim().replace(/^@+/, '')
}

/**
 * Rounded card + accordion: click header to expand/collapse (same idea as site content admin form).
 * Chevron rotation uses .site-content-accordion__* from index.css.
 * `open` is controlled so the default is reliably expanded (HTML `defaultOpen` is not valid on `<details>`).
 */
function FormSectionGroup({
  title,
  description,
  children,
  defaultOpen = true,
  open: openProp,
  onOpenChange,
}) {
  const [openInternal, setOpenInternal] = useState(defaultOpen)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : openInternal

  const handleToggle = (e) => {
    const next = e.currentTarget.open
    if (isControlled) onOpenChange?.(next)
    else setOpenInternal(next)
  }

  return (
    <details
      className="site-content-accordion__panel group rounded-xl border border-slate-200/90 bg-slate-50/50 dark:border-white/10 dark:bg-zinc-900/20"
      open={open}
      onToggle={handleToggle}
    >
      <summary
        className={cn(
          'flex cursor-pointer list-none items-start justify-between gap-3 p-4 sm:p-5 md:px-6',
          '[-webkit-tap-highlight-color:transparent] [&::-webkit-details-marker]:hidden',
          'hover:bg-slate-100/50 dark:hover:bg-white/4',
          'focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
          'dark:focus-visible:ring-offset-zinc-900',
        )}
      >
        <div className="min-w-0 flex-1 space-y-1 pr-2 text-left">
          <h2 className="font-display text-base font-semibold tracking-tight text-slate-900 sm:text-lg dark:text-zinc-100">
            {title}
          </h2>
          {description ? (
            <p className="max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-zinc-400">
              {description}
            </p>
          ) : null}
        </div>
        <span
          className={cn(
            'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
            'border border-slate-200/80 bg-slate-100/80 text-slate-500',
            'shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
            'transition-[background-color,border-color] duration-200',
            'group-hover:border-slate-200 group-hover:bg-white',
            'dark:border-white/10 dark:bg-zinc-800/50 dark:text-zinc-300 dark:shadow-none',
            'dark:group-hover:border-white/15 dark:group-hover:bg-zinc-800/80',
          )}
        >
          <ChevronDown
            className="site-content-accordion__chev h-4 w-4 transition-transform duration-200"
            aria-hidden
            strokeWidth={2}
          />
        </span>
      </summary>
      <div
        className={cn(
          'border-t border-slate-200/80 px-4 pb-4 pt-4 sm:px-5 sm:pb-5 md:px-6 dark:border-white/10',
        )}
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">{children}</div>
      </div>
    </details>
  )
}

export function GetConnectedPage() {
  const [searchParams] = useSearchParams()
  const meetingFromUrl = searchParams.get('meeting')
  const appliedMeetingFromUrl = useRef(false)
  const { data, isLoading } = useSiteContent()
  const categoryOptions = useMemo(
    () =>
      (data?.getConnected?.categories ?? []).map((c) => ({
        value: c.value,
        label: c.label,
      })),
    [data?.getConnected?.categories],
  )
  const meetingOptions = useMemo(() => {
    const fromApi = data?.upcomingMeetings?.options
    if (fromApi?.length) return fromApi
    return UPCOMING_MEETING_OPTIONS_FALLBACK
  }, [data?.upcomingMeetings?.options])
  const [form, setForm] = useState(createEmptyForm)
  const [errors, setErrors] = useState({})
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' })
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    if (!meetingFromUrl || isLoading || appliedMeetingFromUrl.current) return
    const isValid = meetingOptions.some((o) => o.value === meetingFromUrl)
    if (!isValid) return
    appliedMeetingFromUrl.current = true
    // Deep-link prefill from /upcoming-meetings modal
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL param after options load
    setForm((prev) => ({ ...prev, upcomingMeetings: [meetingFromUrl] }))
    window.setTimeout(() => {
      document.getElementById('upcoming-meetings-field')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 150)
  }, [meetingFromUrl, meetingOptions, isLoading])

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
  const numbersOnly = (value) => value.replace(/\D+/g, '')

  const validate = () => {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Full name is required.'
    if (!form.age.trim()) next.age = 'Age is required.'
    if (!form.location.trim()) next.location = 'Location is required.'
    if (!form.phone.trim()) next.phone = 'Phone number is required.'
    if (!form.email.trim()) next.email = 'Email is required.'
    if (!form.category) next.category = 'Please select how you connect with us.'
    if (!form.churchStatus) next.churchStatus = 'Please select your church status.'
    if (!form.acceptedJesus) next.acceptedJesus = 'Please choose Yes or No.'
    if (!form.interests.length) next.interests = 'Select at least one interest.'
    if (form.isStudent === 'yes' && !form.schoolName.trim()) {
      next.schoolName = 'School name is required for students.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const payload = {
      ...form,
      instagramHandle: normalizeHandle(form.instagramHandle),
    }
    setSubmitState({ status: 'saving', message: '' })
    submitGetConnected({
      full_name: payload.fullName,
      age: payload.age,
      date_of_birth: payload.dateOfBirth || null,
      location: payload.location,
      phone: payload.phone,
      email: payload.email,
      category: payload.category,
      instagram_handle: payload.instagramHandle || null,
      occupation: payload.occupation || null,
      is_student: payload.isStudent || null,
      school_name: payload.schoolName || null,
      program: payload.program || null,
      year_of_study: payload.yearOfStudy || null,
      church_status: payload.churchStatus,
      talents: payload.talents || null,
      interests: payload.interests,
      upcoming_meetings: payload.upcomingMeetings?.length ? payload.upcomingMeetings : null,
      extra_notes: payload.extraNotes || null,
      accepted_jesus: payload.acceptedJesus,
      prayer_requests: payload.prayerRequests || null,
    })
      .then(() => {
        setForm(createEmptyForm())
        setErrors({})
        setSubmitState({
          status: 'success',
          message: 'Saved successfully. Your profile has been sent to BLiVR admin.',
        })
        setShowSuccessModal(true)
      })
      .catch((err) => {
        setSubmitState({
          status: 'error',
          message: err?.response?.data?.message || 'Could not submit right now. Please try again.',
        })
      })
  }

  if (isLoading) {
    return <BrandLoadingScreen />
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white text-slate-900">
      <main className="mx-auto w-full max-w-6xl px-4 pb-14 pt-6 sm:px-6 sm:pt-7 lg:px-8 lg:pt-8">
        <Reveal delay={0}>
          <div className="mb-5">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back
            </Link>
          </div>
        </Reveal>

        <Reveal delay={30}>
          <div
            className={cn(
              'mb-8 rounded-2xl border border-white/20 p-6 text-zinc-100 sm:p-7',
              'bg-zinc-950/95 shadow-[0_4px_14px_-10px_rgba(0,0,0,0.28)]',
              'backdrop-blur-xl supports-backdrop-filter:bg-zinc-950/90',
              'transition-[background-color,box-shadow,border-color] duration-300',
            )}
          >
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="relative mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center sm:h-14 sm:w-14">
                <img
                  src="/blvr-logo.jpeg"
                  alt="BLiVR logo"
                  className="h-10 w-10 rounded-xl border border-white/20 object-cover sm:h-11 sm:w-11"
                />
              </div>
              <div className="min-w-0">
                {/* <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">BLiVR Movement</p> */}
                <h1 className="mt-1.5 font-display text-4xl text-white sm:text-5xl">Join Us</h1>
                <p className="mt-3 max-w-2xl text-sm text-zinc-300 sm:text-base">
                  Fill this profile so we can know you, serve you better, and connect you with the right
                  people and opportunities.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={70}>
        <form
          onSubmit={submit}
          className="flex w-full flex-col gap-5 sm:gap-6"
        >
          {!isLoading && categoryOptions.length === 0 && (
            <Alert variant="error" role="alert">
              Connection categories are not available. Please try again later or contact the team.
            </Alert>
          )}

          <div
            className={cn(
              'rounded-2xl border border-slate-200/90 bg-white shadow-sm shadow-slate-200/25',
              'dark:border-white/10 dark:bg-zinc-900/30 dark:shadow-none',
            )}
          >
            <div className="space-y-4 p-4 sm:space-y-5 sm:p-6 md:p-8">
          <FormSectionGroup
            title="About you"
            description="Basic details so we know who you are."
          >
            <TextField
              label="Full Name"
              value={form.fullName}
              onChange={(e) => setField('fullName', e.target.value)}
              error={errors.fullName}
            />
            <TextField
              label="Age"
              value={form.age}
              onChange={(e) => setField('age', numbersOnly(e.target.value))}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={3}
              error={errors.age}
            />
            <CustomDatePicker
              label={labelWithOptional('Date of Birth')}
              value={form.dateOfBirth}
              onChange={(v) => setField('dateOfBirth', v)}
            />
            <TextField
              label="Location (city & country)"
              value={form.location}
              onChange={(e) => setField('location', e.target.value)}
              error={errors.location}
            />
            <div className="grid grid-cols-1 gap-4 sm:col-span-2 sm:grid-cols-2 sm:gap-5">
              <TextField
                className="min-w-0"
                label={labelWithOptional('Occupation')}
                value={form.occupation}
                onChange={(e) => setField('occupation', e.target.value)}
              />
              <SelectSearch
                className="min-w-0"
                label={labelWithOptional('Are you a Student?')}
                options={YES_NO_OPTIONS}
                value={form.isStudent}
                onChange={(v) => setField('isStudent', v)}
                placeholder="Select one"
              />
            </div>
            {form.isStudent === 'yes' && (
              <>
                <TextField
                  className="sm:col-span-2"
                  label="College / University / School"
                  value={form.schoolName}
                  onChange={(e) => setField('schoolName', e.target.value)}
                  error={errors.schoolName}
                />
                <TextField
                  className="sm:col-span-2"
                  label={labelWithOptional('Program & Year of Study')}
                  value={form.program}
                  onChange={(e) => setField('program', e.target.value)}
                  placeholder="e.g. BSc Computer Science, Year 2"
                />
              </>
            )}
          </FormSectionGroup>

          <FormSectionGroup
            title="Contact"
            description="How we can reach you."
          >
            <TextField
              label="Phone Number"
              value={form.phone}
              onChange={(e) => setField('phone', numbersOnly(e.target.value))}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={15}
              error={errors.phone}
            />
            <TextField
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              error={errors.email}
            />
            <TextField
              className="sm:col-span-2"
              label={labelWithOptional('Instagram Handle')}
              value={form.instagramHandle}
              onChange={(e) => setField('instagramHandle', e.target.value)}
              placeholder="@yourhandle"
            />
          </FormSectionGroup>

          <FormSectionGroup
            title="How you connect"
            description="Your role and the way you want to plug in with BLiVR."
          >
            <SelectSearch
              className="sm:col-span-2"
              label="How do you want to connect?"
              options={categoryOptions}
              value={form.category}
              onChange={(v) => setField('category', v)}
              placeholder="Select a category"
              error={errors.category}
            />
          </FormSectionGroup>

          <FormSectionGroup
            title="Upcoming Meetings"
            description="Let us know which gatherings you’re interested in attending."
          >
            <div id="upcoming-meetings-field" className="sm:col-span-2">
              <SelectSearch
                label={labelWithOptional('Which upcoming meeting would you like to attend?')}
                options={meetingOptions}
                value={form.upcomingMeetings}
                onChange={(v) => setField('upcomingMeetings', v)}
                multiple
                placeholder="Select meeting(s)"
                searchPlaceholder="Search meetings..."
              />
            </div>
          </FormSectionGroup>

          <FormSectionGroup
            title="Church & faith"
            description="Help us understand your church life and walk with Christ."
          >
            <SelectSearch
              className="sm:col-span-2"
              label="Church Status"
              options={CHURCH_STATUS_OPTIONS}
              value={form.churchStatus}
              onChange={(v) => setField('churchStatus', v)}
              placeholder="Select church status"
              error={errors.churchStatus}
            />
            <SelectSearch
              className="sm:col-span-2"
              label="Accepted Jesus Christ as your Lord & Saviour?"
              options={YES_NO_OPTIONS}
              value={form.acceptedJesus}
              onChange={(v) => setField('acceptedJesus', v)}
              placeholder="Select one"
              error={errors.acceptedJesus}
            />
          </FormSectionGroup>

          <FormSectionGroup
            title="Interests & gifts"
            description="What you care about and how you’re wired to serve."
          >
            <SelectSearch
              className="sm:col-span-2"
              label="Interests"
              options={INTEREST_OPTIONS}
              value={form.interests}
              onChange={(v) => setField('interests', v)}
              multiple
              placeholder="Select interests"
              searchPlaceholder="Search interests..."
              error={errors.interests}
            />
            <TextAreaField
              className="sm:col-span-2"
              label={labelWithOptional('Special Talents / Gifts')}
              value={form.talents}
              onChange={(e) => setField('talents', e.target.value)}
              rows={3}
            />
          </FormSectionGroup>

          <FormSectionGroup
            title="Notes & prayer"
            description="Optional — share more about yourself or ask for prayer."
          >
            <TextAreaField
              className="sm:col-span-2"
              label={labelWithOptional('Extra notes about yourself')}
              value={form.extraNotes}
              onChange={(e) => setField('extraNotes', e.target.value)}
              rows={3}
            />
            <TextAreaField
              className="sm:col-span-2"
              label={labelWithOptional('Prayer Requests')}
              value={form.prayerRequests}
              onChange={(e) => setField('prayerRequests', e.target.value)}
              rows={3}
            />
          </FormSectionGroup>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200/80 bg-slate-50/40 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:px-6 sm:py-5 md:px-8 dark:border-white/10 dark:bg-zinc-950/40">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              disabled={submitState.status === 'saving' || categoryOptions.length === 0}
            >
              {submitState.status === 'saving' ? 'Submitting…' : 'Submit Profile'}
            </Button>
            <Link
              to="/"
              className={cn(
                'inline-flex w-full items-center justify-center rounded-2xl border border-slate-200/90 bg-white px-5 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto',
              )}
            >
              Back to Home
            </Link>
            </div>
          </div>

          {submitState.status === 'success' && (
            <p className="sr-only" aria-live="polite">
              {submitState.message}
            </p>
          )}
          {submitState.status === 'error' && (
            <p className="text-sm text-rose-700">{submitState.message}</p>
          )}
        </form>
        </Reveal>
      </main>

      <SiteFooter footer={data?.footer} brand={data?.brand || 'BLiVR Movement'} />

      <SuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
        message="Your profile has been submitted successfully and sent to BLiVR admin."
        continueLabel="Continue"
        homeHref="/"
        homeLabel="Back Home"
      />
    </div>
  )
}

