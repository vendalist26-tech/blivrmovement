import { useQuery } from '@tanstack/react-query'
import { fetchPublicSite } from '@/api/client'

const MIN_PUBLIC_LOADING_MS = 1800

async function fetchPublicSiteWithMinimumLoading() {
  const [site] = await Promise.all([
    fetchPublicSite(),
    new Promise((resolve) => {
      setTimeout(resolve, MIN_PUBLIC_LOADING_MS)
    }),
  ])
  return site
}

export function useSiteContent() {
  return useQuery({
    queryKey: ['site', 'public'],
    queryFn: fetchPublicSiteWithMinimumLoading,
    staleTime: 60_000,
  })
}
