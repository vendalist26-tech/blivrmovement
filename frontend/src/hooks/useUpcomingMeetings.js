import { useQuery } from '@tanstack/react-query'
import { fetchPublicUpcomingMeetings } from '@/api/client'
import { normalizeRsvpConfig } from '@/lib/featuredMeetingRsvp'
import { normalizeMeeting } from '@/lib/meetingImage'

export function useUpcomingMeetings() {
  return useQuery({
    queryKey: ['upcoming-meetings', 'public'],
    queryFn: fetchPublicUpcomingMeetings,
    select: (data) => ({
      page: data?.page ?? {},
      meetings: (data?.meetings ?? []).map(normalizeMeeting).filter(Boolean),
      options: data?.options ?? [],
      rsvp: normalizeRsvpConfig(data?.page?.rsvp),
    }),
  })
}
