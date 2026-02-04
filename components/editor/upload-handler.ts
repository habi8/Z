import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export async function uploadFile(file: File): Promise<string> {
    const supabase = createClient()

    // Create a unique file path
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `uploads/${fileName}`

    // Upload to 'media' bucket
    // Note: Ensure the 'media' bucket exists in Supabase and has public read access.
    console.log('[Upload] Starting upload for', file.name, 'to', filePath)
    const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file)

    if (uploadError) {
        console.error('[Upload] Error uploading file:', uploadError)
        // Check for common error codes
        if ((uploadError as any).status === 404 || uploadError.message?.includes('bucket not found')) {
            console.error('[Upload] The "media" bucket does not exist. Please create it in Supabase storage.')
        }
        throw uploadError
    }

    // Get public URL
    const { data } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

    console.log('[Upload] Upload successful, public URL:', data.publicUrl)
    return data.publicUrl
}

export function triggerFileUpload(accept: string, onUpload: (url: string) => void) {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
            const toastId = toast.loading(`Uploading ${file.type.startsWith('image/') ? 'image' : 'file'}...`)
            try {
                const url = await uploadFile(file)
                toast.success('Upload complete', { id: toastId })
                onUpload(url)
            } catch (error: any) {
                toast.error(`Upload failed: ${error.message || 'Unknown error'}`, { id: toastId })
            }
        }
    }
    input.click()
}
