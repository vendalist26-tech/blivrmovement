import { useEffect, useRef, useState } from 'react'
import { uploadSiteImage } from '@/api/client'
import { resolveApiAssetUrl } from '@/lib/apiAssetUrl'
import { siteImageSrc } from '@/lib/siteImage'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/cn'

/**
 * @param {{
 *   label: string
 *   folder: string
 *   image?: string
 *   imagePath?: string
 *   imageUrl?: string
 *   onChange: (patch: { image?: string, imagePath?: string, imageUrl?: string }) => void
 *   aspectClass?: string
 *   fallback?: string
 * }} props
 */
export function SiteImageUpload({
  label,
  folder,
  image = '',
  imagePath = '',
  imageUrl = '',
  onChange,
  aspectClass = 'aspect-video max-w-md',
  fallback = '/blvr-logo.jpeg',
}) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [localPreview, setLocalPreview] = useState(null)

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview)
    }
  }, [localPreview])

  const resolvedUrl = resolveApiAssetUrl(imageUrl)
  const previewSrc =
    localPreview ||
    siteImageSrc({ image, imageUrl, imagePath }, null) ||
    resolvedUrl ||
    fallback

  const onFile = async (file) => {
    if (!file) return
    setError('')

    if (localPreview) URL.revokeObjectURL(localPreview)
    setLocalPreview(URL.createObjectURL(file))

    setUploading(true)
    try {
      const result = await uploadSiteImage(file, folder)
      onChange({
        imagePath: result.path,
        imageUrl: result.url,
        image: result.url,
      })
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const clearImage = () => {
    if (localPreview) URL.revokeObjectURL(localPreview)
    setLocalPreview(null)
    onChange({ imagePath: '', imageUrl: '', image: '' })
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-slate-700 dark:text-zinc-300">{label}</p>
      <div
        className={cn(
          'relative overflow-hidden rounded-lg border border-slate-200/90 bg-slate-100 dark:border-white/10 dark:bg-zinc-900/40',
          aspectClass,
        )}
      >
        <img
          key={previewSrc}
          src={previewSrc}
          alt=""
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = fallback
          }}
        />
        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Spinner className="text-white" />
          </div>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
          e.target.value = ''
        }}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? 'Uploading…' : imagePath || image ? 'Replace image' : 'Upload image'}
        </Button>
        {imagePath || image ? (
          <Button type="button" variant="secondary" disabled={uploading} onClick={clearImage}>
            Remove
          </Button>
        ) : null}
      </div>
      {resolvedUrl ? (
        <p className="break-all text-[0.65rem] text-slate-500 dark:text-zinc-500">{resolvedUrl}</p>
      ) : null}
      {error ? <p className="text-xs text-red-600 dark:text-red-400">{error}</p> : null}
    </div>
  )
}
