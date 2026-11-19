import { resolveApiAssetUrl } from '@/lib/apiAssetUrl'

/**
 * Resolve a homepage section image (API storage, legacy URL, or public path).
 * @param {{ image?: string | null, imageUrl?: string | null, imagePath?: string | null }} source
 * @param {string | null} [fallback]
 */
export function siteImageSrc(source, fallback = null) {
  if (!source) return fallback
  const fromUrl = resolveApiAssetUrl(source.imageUrl)
  if (fromUrl) return fromUrl
  const fromPath = resolveApiAssetUrl(source.imagePath)
  if (fromPath) return fromPath
  if (source.image) return source.image
  return fallback
}

/**
 * @param {{ mobileImage?: string, mobileImageUrl?: string, mobileImagePath?: string, image?: string, imageUrl?: string, imagePath?: string }} hero
 */
export function heroMobileImageSrc(hero, fallback = '/HERO1Mobile3.jpg') {
  return (
    siteImageSrc(
      {
        image: hero?.mobileImage,
        imageUrl: hero?.mobileImageUrl,
        imagePath: hero?.mobileImagePath,
      },
      null,
    ) ||
    siteImageSrc(hero, null) ||
    fallback
  )
}

/**
 * @param {{ desktopImage?: string, desktopImageUrl?: string, desktopImagePath?: string, image?: string, imageUrl?: string, imagePath?: string }} hero
 */
export function heroDesktopImageSrc(hero, fallback = '/HERO1copy.jpg') {
  return (
    siteImageSrc(
      {
        image: hero?.desktopImage,
        imageUrl: hero?.desktopImageUrl,
        imagePath: hero?.desktopImagePath,
      },
      null,
    ) ||
    siteImageSrc(hero, null) ||
    fallback
  )
}
