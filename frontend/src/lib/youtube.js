/** @param {unknown} input */
export function parseYoutubeVideoId(input) {
  if (input == null || typeof input !== 'string') return null
  const s = input.trim()
  if (!s) return null
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s
  try {
    const u = new URL(s.startsWith('//') ? `https:${s}` : s)
    if (u.hostname === 'youtu.be' || u.hostname.endsWith('.youtu.be')) {
      const id = u.pathname.replace(/^\//, '').split('/')[0]
      return id?.slice(0, 11) || null
    }
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return v.slice(0, 11)
      const embed = u.pathname.match(/\/embed\/([^/?]+)/)
      if (embed?.[1]) return embed[1].slice(0, 11)
      const shorts = u.pathname.match(/\/shorts\/([^/?]+)/)
      if (shorts?.[1]) return shorts[1].slice(0, 11)
    }
  } catch {
    /* ignore */
  }
  return null
}
