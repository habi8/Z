import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DocumentEditor } from '@/components/document/document-editor'

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch document
  const { data: document, error: documentError } = await supabase
    .from('documents')
    .select('*, workspaces(*)')
    .eq('id', id)
    .single()

  if (documentError || !document) {
    redirect('/dashboard')
  }

  return <DocumentEditor user={user} document={document} />
}
