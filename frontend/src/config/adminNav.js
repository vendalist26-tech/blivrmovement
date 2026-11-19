import {
  CalendarRange,
  ClipboardList,
  Globe,
  Home,
  // Info,
  LayoutDashboard,
  Palette,
  Settings,
  Tags,
  Users,
} from 'lucide-react'

/**
 * Admin portal navigation — add entries as new tools are built.
 * `Icon` is a Lucide outline icon component.
 */
export const adminNavItems = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
  { to: '/admin/site', label: 'Homepage', Icon: Home },
  { to: '/admin/get-connected', label: 'Join Us', Icon: Users, end: true },
  { to: '/admin/get-connected/categories', label: 'Join Us categories', Icon: Tags, end: true },
  // { to: '/admin/get-connected/info', label: 'Join Us info modal', Icon: Info, end: true },
  { to: '/admin/upcoming-meetings', label: 'Upcoming meetings', Icon: CalendarRange, end: true },
  { to: '/admin/meeting-rsvps', label: 'Meeting RSVPs', Icon: ClipboardList, end: true },
  { to: '/admin/appearance', label: 'Appearance', Icon: Palette },
  { to: '/admin/seo', label: 'SEO & sharing', Icon: Globe },
  { to: '/admin/settings', label: 'Settings', Icon: Settings },
]

/** Thin stroke for a light, airy look (Lucide default is 2). */
export const adminNavIconProps = { strokeWidth: 1.5 }
