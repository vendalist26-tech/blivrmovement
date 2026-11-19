import { useEffect, useRef, useState } from 'react'
import { uploadUpcomingMeetingImage } from '@/api/client'
import { resolveApiAssetUrl } from '@/lib/apiAssetUrl'
import { meetingImageSrc } from '@/lib/meetingImage'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { TextField } from '@/components/ui/TextField'
import { cn } from '@/lib/cn'

export function MeetingImageUpload({
  imagePath,
  imageUrl,
  imageAlt,
  onImagePathChange,
  onImageUrlChange,
  onImageAltChange,
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
  const previewSrc = localPreview || resolvedUrl || meetingImageSrc({ imageUrl: null, image: null })

  const onFile = async (file) => {
    if (!file) return
    setError('')

    if (localPreview) URL.revokeObjectURL(localPreview)
    setLocalPreview(URL.createObjectURL(file))

    setUploading(true)
    try {
      const result = await uploadUpcomingMeetingImage(file)
      onImagePathChange(result.path)
      onImageUrlChange(result.url)
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const clearImage = () => {
    if (localPreview) URL.revokeObjectURL(localPreview)
    setLocalPreview(null)
    onImagePathChange('')
    onImageUrlChange('')
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-slate-700 dark:text-zinc-300">Meeting image</p>
      <div
        className={cn(
          'relative overflow-hidden rounded-lg border border-slate-200/90 bg-slate-100 dark:border-white/10 dark:bg-zinc-900/40',
          'aspect-video max-w-sm',
        )}
      >
        <img
          key={previewSrc}
          src={previewSrc}
          alt={imageAlt || 'Preview'}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = meetingImageSrc({ imageUrl: null, image: null })
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
          {uploading ? 'Uploading…' : imagePath ? 'Replace image' : 'Upload image'}
        </Button>
        {imagePath ? (
          <Button type="button" variant="secondary" disabled={uploading} onClick={clearImage}>
            Remove
          </Button>
        ) : null}
      </div>
      {resolvedUrl ? (
        <p className="break-all text-[0.65rem] text-slate-500 dark:text-zinc-500">{resolvedUrl}</p>
      ) : null}
      {error ? <p className="text-xs text-red-600 dark:text-red-400">{error}</p> : null}
      <TextField label="Image alt text" value={imageAlt} onChange={(e) => onImageAltChange(e.target.value)} />
    </div>
  )
}
