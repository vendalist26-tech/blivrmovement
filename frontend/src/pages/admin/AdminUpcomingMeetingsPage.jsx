import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { UpcomingMeetingsEditor } from '@/components/admin/upcomingMeetings/UpcomingMeetingsEditor'

export function AdminUpcomingMeetingsPage() {
  return (
    <AdminPageShell
      title="Upcoming meetings"
      description="Manage meeting cards, images, homepage carousel visibility, page copy, RSVP settings, and the public /upcoming-meetings page."
    >
      <UpcomingMeetingsEditor />
    </AdminPageShell>
  )
}
