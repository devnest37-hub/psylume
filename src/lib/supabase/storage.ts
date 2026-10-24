import { isSupabaseConfigured, supabase } from './client'

export type StorageBucket = 'lecture-videos' | 'lecture-documents' | 'thumbnails' | 'support-attachments'

export interface UploadResult {
  publicUrl: string
  sizeMB: number
  path: string
}

/**
 * Uploads a binary file directly to a Supabase storage bucket with progress tracking and resilience.
 */
export async function uploadLectureFile(
  file: File,
  bucket: StorageBucket,
  onProgress?: (percentage: number) => void,
): Promise<UploadResult> {
  const sizeMB = Number((file.size / (1024 * 1024)).toFixed(2))

  // If Supabase is offline or not configured, provide a resilient local Object URL
  if (!isSupabaseConfigured || !supabase) {
    onProgress?.(30)
    await new Promise((r) => setTimeout(r, 200))
    onProgress?.(70)
    await new Promise((r) => setTimeout(r, 200))
    onProgress?.(100)

    const blobUrl = URL.createObjectURL(file)
    return {
      publicUrl: blobUrl,
      sizeMB,
      path: `local-${file.name}`,
    }
  }

  // 1. Sanitize filename and create unique timestamped path
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const path = `${Date.now()}-${cleanName}`

  try {
    onProgress?.(15)

    // 2. Perform direct binary upload to the specified bucket
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      contentType: file.type || 'application/octet-stream',
      upsert: true,
    })

    if (error) {
      console.error(`[Storage Upload Failed] Bucket: ${bucket}, Path: ${path}`, error)
      throw new Error(`Upload to ${bucket} failed: ${error.message}`)
    }

    onProgress?.(85)

    // 3. Retrieve persistent cloud public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    onProgress?.(100)

    return {
      publicUrl,
      sizeMB,
      path: data.path,
    }
  } catch (err: unknown) {
    console.error('Storage upload exception:', err)
    const message = err instanceof Error ? err.message : 'Unknown network storage error'
    throw new Error(message)
  }
}
