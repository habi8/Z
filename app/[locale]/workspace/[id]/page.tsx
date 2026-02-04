import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WorkspaceClient } from '@/components/workspace/workspace-client'

export default async function WorkspacePage({
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

  // Fetch workspace
  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .select('*')
    .eq('id', id)
    .single()

  if (workspaceError || !workspace) {
    redirect('/dashboard')
  }

  // Fetch documents in this workspace
  const { data: documents, error: documentsError } = await supabase
    .from('documents')
    .select('*')
    .eq('workspace_id', id)
    .order('updated_at', { ascending: false })

  if (documentsError) {
    console.error('[v0] Error fetching documents:', documentsError)
  }

  return (
    <WorkspaceClient
      user={user}
      workspace={workspace}
      initialDocuments={documents || []}
    />
  )
}
