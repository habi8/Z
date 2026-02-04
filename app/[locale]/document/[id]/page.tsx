import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DocumentEditor } from '@/components/document/document-editor'

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/auth/login`)
  }

  // Fetch document
  const { data: document, error: documentError } = await supabase
    .from('documents')
    .select('*, workspaces(*)')
    .eq('id', id)
    .single()

  if (documentError || !document) {
    redirect(`/${locale}/dashboard`)
  }

  return <DocumentEditor user={user} document={document} />
}
