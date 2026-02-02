'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Save,
  User,
  Settings,
  LogOut,
  Languages,
  FileText,
  Clock,
} from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface Document {
  id: string
  title: string
  content: any
  workspace_id: string
  created_at: string
  updated_at: string
  source_language: string
  workspaces: {
    id: string
    name: string
  }
}

interface DocumentEditorProps {
  user: SupabaseUser
  document: Document
}

export function DocumentEditor({ user, document: initialDocument }: DocumentEditorProps) {
  const router = useRouter()
  const [document, setDocument] = useState(initialDocument)
  const [title, setTitle] = useState(initialDocument.title)
  const [content, setContent] = useState(
    initialDocument.content?.text || ''
  )
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('documents')
        .update({
          title,
          content: { text: content },
          updated_at: new Date().toISOString(),
        })
        .eq('id', document.id)

      if (error) throw error

      setLastSaved(new Date())
      console.log('[v0] Document saved successfully')
    } catch (error: any) {
      console.error('[v0] Error saving document:', error)
      alert('Failed to save document')
    } finally {
      setIsSaving(false)
    }
  }

  // Auto-save every 30 seconds if there are changes
  useEffect(() => {
    const timer = setInterval(() => {
      if (title !== document.title || content !== (document.content?.text || '')) {
        handleSave()
      }
    }, 30000)

    return () => clearInterval(timer)
  }, [title, content, document])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/workspace/${document.workspace_id}`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Image
                src="/z-logo.png"
                alt="Z Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{document.workspaces.name}</span>
                <span>/</span>
                <FileText className="h-3 w-3" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lastSaved && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}

            <Badge variant="secondary" className="gap-1">
              <Languages className="h-3 w-3" />
              <span className="uppercase text-xs">{document.source_language}</span>
            </Badge>

            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Title */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Document"
            className="text-4xl font-bold border-none focus-visible:ring-0 px-0 h-auto py-2"
          />

          {/* Lingo.dev Integration Notice */}
          <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Languages className="h-4 w-4 text-primary" />
              <span>Translation Ready</span>
            </div>
            <p className="text-sm text-muted-foreground">
              This document is structured for Lingo.dev integration. Add Lingo.dev locally to
              enable translation workflows, context management, and multi-language variants.
            </p>
          </div>

          {/* Content Editor */}
          <div className="min-h-[600px]">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your content here..."
              className="min-h-[600px] text-lg leading-relaxed border-none focus-visible:ring-0 px-0 resize-none"
            />
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-8 border-t border-border">
            <div>
              Created {new Date(document.created_at).toLocaleDateString()}
            </div>
            <div>{content.split(/\s+/).filter(Boolean).length} words</div>
          </div>
        </div>
      </main>
    </div>
  )
}
