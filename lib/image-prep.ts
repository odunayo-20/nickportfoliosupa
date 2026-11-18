/**
 * Client-side preparation of files before they go to the `media` storage bucket.
 *
 * Per format:
 * - JPEG / PNG / WebP / AVIF / BMP  → resized to the slot's max size and re-encoded (WebP when the
 *   browser can encode it, else JPEG/PNG). The original is kept when it's already small enough and
 *   re-encoding wouldn't make it smaller.
 * - HEIC / HEIF (iPhone photos)       → decoded with heic2any (loaded only when needed), then as above.
 * - GIF                               → uploaded untouched (canvas would keep only the first frame).
 * - SVG                               → uploaded untouched if it contains no scripts/handlers; rejected otherwise.
 * - Video / PDF                       → uploaded untouched.
 * Everything is size-checked first.
 */

export type ConvertOptions = { maxWidth?: number; maxHeight?: number; quality?: number }

export type PreparedFile = {
  file: File
  /** 'image' | 'video' | 'application' — matches media.type */
  kind: string
  width?: number
  height?: number
  /** SHA-256 of the ORIGINAL file, for duplicate detection. */
  hash: string
  /** Human-readable note for the toast, e.g. "converted to WebP". */
  note?: string
}

const MB = 1024 * 1024
export const LIMITS = { image: 20 * MB, video: 200 * MB, application: 25 * MB }

export const ACCEPT =
  'image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml,image/bmp,image/heic,image/heif,.heic,.heif,video/mp4,video/webm,video/quicktime,application/pdf'

export function randomId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

const ext = (name: string) => name.split('.').pop()?.toLowerCase() ?? ''

/** Windows often reports HEIC files with an empty type, so look at the extension too. */
function detectType(file: File): string {
  if (file.type) return file.type
  const e = ext(file.name)
  return (
    {
      heic: 'image/heic', heif: 'image/heif', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
      webp: 'image/webp', avif: 'image/avif', gif: 'image/gif', svg: 'image/svg+xml', bmp: 'image/bmp',
      mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime', pdf: 'application/pdf',
    } as Record<string, string>
  )[e] ?? 'application/octet-stream'
}

/** crypto.subtle / randomUUID only exist in secure contexts (https or localhost). */
async function sha256(file: File): Promise<string> {
  if (!globalThis.crypto?.subtle) return `weak:${file.name}:${file.size}:${file.lastModified}`
  const buf = await crypto.subtle.digest('SHA-256', await file.arrayBuffer())
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')
}

function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(blob)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('This image could not be read by the browser.'))
    }
    img.src = url
  })
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

const EXT_FOR: Record<string, string> = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' }
const baseName = (name: string) => name.replace(/\.[^.]+$/, '') || 'image'

const SVG_DANGER = /<script|<foreignObject|\son[a-z]+\s*=|javascript:|<iframe|<embed|<object/i

export async function prepareUpload(original: File, opts: ConvertOptions = {}): Promise<PreparedFile> {
  const type = detectType(original)
  const kind = type.split('/')[0] === 'image' || type === 'image/svg+xml' ? 'image' : type.split('/')[0]
  const limit = LIMITS[kind as keyof typeof LIMITS] ?? LIMITS.application
  if (original.size > limit) {
    throw new Error(`${original.name} is ${(original.size / MB).toFixed(1)} MB — the limit for ${kind} files is ${limit / MB} MB.`)
  }
  if (!['image', 'video'].includes(kind) && type !== 'application/pdf') {
    throw new Error(`${original.name}: unsupported file type (${type}).`)
  }

  const hash = await sha256(original)

  if (kind !== 'image') return { file: original, kind, hash }

  if (type === 'image/svg+xml') {
    const text = await original.text()
    if (SVG_DANGER.test(text)) {
      throw new Error(`${original.name} contains scripts or event handlers and was not uploaded. Export it again as a plain SVG.`)
    }
    return { file: new File([original], original.name, { type: 'image/svg+xml' }), kind, hash, note: 'kept as SVG' }
  }

  if (type === 'image/gif') {
    const img = await loadImage(original).catch(() => null)
    return { file: original, kind, hash, width: img?.naturalWidth, height: img?.naturalHeight, note: 'kept as GIF (animation preserved)' }
  }

  // HEIC/HEIF → JPEG first (Safari can decode HEIC natively, other browsers can't).
  let source: Blob = original
  let note: string | undefined
  if (type === 'image/heic' || type === 'image/heif') {
    const native = await loadImage(original).then(() => true).catch(() => false)
    if (!native) {
      const { default: heic2any } = await import('heic2any')
      try {
        const out = await heic2any({ blob: original, toType: 'image/jpeg', quality: 0.92 })
        source = Array.isArray(out) ? out[0] : out
      } catch {
        throw new Error(`${original.name} couldn't be converted from HEIC. On iPhone, set Camera → Formats → Most Compatible, or export it as JPEG.`)
      }
    }
    note = 'converted from HEIC'
  }

  const img = await loadImage(source)
  const maxWidth = opts.maxWidth ?? 1920
  const maxHeight = opts.maxHeight
  const quality = opts.quality ?? 0.88

  let scale = img.naturalWidth > maxWidth ? maxWidth / img.naturalWidth : 1
  if (maxHeight && img.naturalHeight * scale > maxHeight) scale = maxHeight / img.naturalHeight
  const w = Math.max(1, Math.round(img.naturalWidth * scale))
  const h = Math.max(1, Math.round(img.naturalHeight * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not supported in this browser.')
  ctx.drawImage(img, 0, 0, w, h)

  // Use the format the browser actually produced (Safari < 17 can't encode WebP and silently
  // returns PNG). Fall back to JPEG for photos / PNG for formats that may have transparency.
  let blob = await toBlob(canvas, 'image/webp', quality)
  if (!blob || blob.type !== 'image/webp') {
    const fallback = type === 'image/png' || type === 'image/webp' || type === 'image/avif' ? 'image/png' : 'image/jpeg'
    blob = await toBlob(canvas, fallback, quality)
  }
  if (!blob) throw new Error('Could not encode the image.')

  // Already web-ready, not resized, and re-encoding didn't help → keep the original bytes.
  const webReady = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(type)
  if (webReady && scale === 1 && blob.size >= original.size) {
    return { file: original, kind, hash, width: w, height: h, note: 'kept original (already optimised)' }
  }

  const outExt = EXT_FOR[blob.type] ?? 'img'
  const file = new File([blob], `${baseName(original.name)}.${outExt}`, { type: blob.type })
  const parts = [note, `${outExt.toUpperCase()} ${w}×${h}`, `${Math.round(original.size / 1024)} → ${Math.round(blob.size / 1024)} KB`]
  return { file, kind, hash, width: w, height: h, note: parts.filter(Boolean).join(', ') }
}
