/**
 * Resolve image URLs returned by the API (storage paths, wrong APP_URL, etc.).
 * @param {string | null | undefined} url
 */
export function resolveApiAssetUrl(url) {
  if (!url) return null

  const apiRoot =
    import.meta.env.VITE_API_URL?.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '') || ''

  if (url.startsWith('/storage/')) {
    return apiRoot ? `${apiRoot}${url}` : url
  }

  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url)
      if (
        apiRoot &&
        (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') &&
        parsed.pathname.startsWith('/storage/')
      ) {
        return `${apiRoot}${parsed.pathname}`
      }
    } catch {
      return url
    }
    return url
  }

  if (apiRoot) {
    return `${apiRoot}/storage/${url.replace(/^\/+/, '')}`
  }

  return `/storage/${url.replace(/^\/+/, '')}`
}
