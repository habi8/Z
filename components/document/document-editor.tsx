'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/editor/editor'
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
  const locale = useLocale()
  const t = useTranslations('document')
  const th = useTranslations('header')
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
    router.push(`/${locale}/auth/login`)
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
      alert(t('save_failed'))
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
              onClick={() => router.push(`/${locale}/workspace/${document.workspace_id}`)}
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
                <span>{t('saved_at', { time: lastSaved.toLocaleTimeString() })}</span>
              </div>
            )}



            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? t('saving') : t('save')}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" suppressHydrationWarning>
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
                <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard`)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {th('how_it_works')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/${locale}/settings`)}>
                  <Settings className="mr-2 h-4 w-4" />
                  {th('user_menu.settings')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {th('user_menu.sign_out')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <LocaleSwitcher />
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title */}
          <div className="group relative">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('title_placeholder')}
              className="!text-5xl !font-black tracking-tight border-transparent px-2 !h-auto py-4 bg-transparent placeholder:text-muted-foreground/30 focus-visible:ring-2 focus-visible:border-input hover:bg-muted/30 transition-all rounded-md"
            />
          </div>



          {/* Content Editor */}
          <div className="min-h-[600px]">
            <RichTextEditor
              content={content}
              onChange={setContent}
            />
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-8 border-t border-border">
            <div>
              {t('created_at', { date: new Date(document.created_at).toLocaleDateString() })}
            </div>
            <div>{t('words', { count: content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length })}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
