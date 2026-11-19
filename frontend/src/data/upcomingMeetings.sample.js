/**
 * Sample content for the Upcoming Meetings page.
 * `value` matches `UPCOMING_MEETING_OPTIONS` in `@/lib/upcomingMeetings` for future CMS wiring.
 */

/** @typedef {'in-person' | 'zoom'} MeetingFormat */

/**
 * @typedef {Object} UpcomingMeetingSample
 * @property {string} value
 * @property {string} title
 * @property {string} tagline
 * @property {string} schedule
 * @property {string} cadence
 * @property {string} location
 * @property {MeetingFormat} format
 * @property {string} image
 * @property {string} imageAlt
 * @property {string} description
 * @property {string[]} highlights
 * @property {boolean} [featured]
 */

/** @type {UpcomingMeetingSample[]} */
export const UPCOMING_MEETINGS_SAMPLE = [
  {
    value: 'may-31-mega-popup',
    title: 'BLiVR Mega Pop-up',
    tagline: 'Our biggest gathering of the season',
    schedule: 'Saturday 31 May 2026 · 2:00–6:00 PM',
    cadence: 'One-time event',
    location: '1377 The Queensway Unit 304, Etobicoke, ON',
    format: 'in-person',
    featured: true,
    image: '/HERO1copy.jpg',
    imageAlt: 'Crowd gathered for a BLiVR pop-up worship night',
    description:
      'A high-energy afternoon of worship, teaching, and community. Come expectant—bring a friend, wear comfortable shoes, and be ready to encounter God with boldness.',
    highlights: [
      'Live worship and a focused message',
      'Space to connect with leaders and new friends',
      'Merch, prayer, and next-step sign-ups on site',
    ],
  },
  {
    value: 'may-10-sunday-popup',
    title: 'Sunday Pop-up',
    tagline: 'Worship, community, and boldness',
    schedule: 'Sunday 10 May 2026 · 4:00–6:00 PM',
    cadence: 'Seasonal pop-up',
    location: '1377 The Queensway Unit 304, Etobicoke, ON',
    format: 'in-person',
    image: '/BSEP01-cover.jpg',
    imageAlt: 'BLiVR Sunday pop-up episode cover art',
    description:
      'Our signature in-person pop-up: an intimate but electric room where young adults gather to worship Jesus, grow in faith, and build real friendships.',
    highlights: [
      'Arrive 15 minutes early to settle in',
      'Open seating—come as you are',
      'Stay after for photos and connection time',
    ],
  },
  {
    value: 'thursday-weekly-meetings',
    title: 'Thursday Weekly',
    tagline: 'Mid-week reset with your people',
    schedule: 'Every Thursday · 7:00–9:00 PM',
    cadence: 'Weekly',
    location: '1377 The Queensway Unit 304, Etobicoke, ON',
    format: 'in-person',
    image: '/GnaTA01.jpg',
    imageAlt: 'Young adults worshiping together at a BLiVR gathering',
    description:
      'The rhythm that keeps us grounded: teaching, discussion, and prayer in a consistent weekly space. Perfect if you want steady discipleship between the big pop-ups.',
    highlights: [
      'Discussion groups after the message',
      'Prayer teams available each week',
      'Great entry point if you are new to BLiVR',
    ],
  },
  {
    value: 'tuesday-5am-zoom-prayers',
    title: 'Tuesday 5am Zoom Prayers',
    tagline: 'Start the week in the secret place',
    schedule: 'Every Tuesday · 5:00–5:45 AM (ET)',
    cadence: 'Weekly · Online',
    location: 'Zoom link shared after you register',
    format: 'zoom',
    image: '/VSMS01.jpg',
    imageAlt: 'Early morning prayer and scripture focus',
    description:
      'A quiet, focused prayer call before the city wakes up. We intercede for families, campuses, creatives, and the BLiVR family—then commission one another into the day.',
    highlights: [
      'Cameras optional—come as you are',
      'Guided prayer with space for personal petitions',
      'Recording not shared; what is prayed stays sacred',
    ],
  },
  {
    value: 'wednesday-8pm-zoom-prayers',
    title: 'Wednesday 8pm Zoom Prayers',
    tagline: 'Mid-week fire on your screen',
    schedule: 'Every Wednesday · 8:00–8:45 PM (ET)',
    cadence: 'Weekly · Online',
    location: 'Zoom link shared after you register',
    format: 'zoom',
    image: '/1.jpg',
    imageAlt: 'Community praying together online',
    description:
      'If mornings are not your season, join us in the evening for the same heart: worshipful prayer, scripture, and agreement over what God is doing in Toronto and beyond.',
    highlights: [
      'Ideal for students and night-shift workers',
      'Breakout prayer in pairs when numbers allow',
      'Invite a friend—link is easy to forward',
    ],
  },
]
