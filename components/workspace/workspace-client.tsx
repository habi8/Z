'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  FileText,
  Settings,
  LogOut,
  User,
  ArrowLeft,
  MoreVertical,
  Trash2,
  Languages,
} from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface Workspace {
  id: string
  name: string
  description: string | null
  created_at: string
}

interface Document {
  id: string
  title: string
  content: any
  workspace_id: string
  created_at: string
  updated_at: string
  source_language: string
}

interface WorkspaceClientProps {
  user: SupabaseUser
  workspace: Workspace
  initialDocuments: Document[]
}

export function WorkspaceClient({
  user,
  workspace,
  initialDocuments,
}: WorkspaceClientProps) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('workspace')
  const th = useTranslations('header')
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newDocTitle, setNewDocTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}/auth/login`)
    router.refresh()
  }

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('documents')
        .insert({
          title: newDocTitle,
          content: { blocks: [] },
          workspace_id: workspace.id,
          user_id: user.id,
          source_language: 'en',
        })
        .select()
        .single()

      if (error) throw error

      setDocuments([data, ...documents])
      setNewDocTitle('')
      setIsCreateDialogOpen(false)
      router.push(`/document/${data.id}`)
    } catch (error: any) {
      console.error('[v0] Error creating document:', error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm(t('delete_confirm'))) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('documents').delete().eq('id', docId)

      if (error) throw error

      setDocuments(documents.filter((doc) => doc.id !== docId))
    } catch (error: any) {
      console.error('[v0] Error deleting document:', error)
      alert(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-muted/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/${locale}/dashboard`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Image
                src="/z-logo.png"
                alt="Z Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <h1 className="text-xl font-bold">{workspace.name}</h1>
                {workspace.description && (
                  <p className="text-xs text-muted-foreground">
                    {workspace.description}
                  </p>
                )}
              </div>
            </div>
          </div>

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
              <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard`)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('back_to_dashboard')}
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
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Actions Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{t('title')}</h2>
              <p className="text-muted-foreground">
                {t('subtitle', { count: documents.length })}
              </p>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('new_document')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('create_title')}</DialogTitle>
                  <DialogDescription>
                    {t('create_description')}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateDocument} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t('doc_title')}</Label>
                    <Input
                      id="title"
                      placeholder={t('title_placeholder')}
                      value={newDocTitle}
                      onChange={(e) => setNewDocTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      disabled={loading}
                    >
                      {t('cancel')}
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? t('creating') : t('create')}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Lingo.dev Integration Notice */}
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Languages className="h-5 w-5 text-primary mt-1" />
                <div>
                  <CardTitle className="text-lg">Lingo.dev Integration Ready</CardTitle>
                  <CardDescription>
                    This workspace is structured for Lingo.dev integration. Add Lingo.dev locally
                    to enable translation workflows, glossary management, and multi-language
                    distribution.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Documents Grid */}
          {documents.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('no_documents')}</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  {t('no_documents_description')}
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('create_first')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  className="hover:shadow-lg transition-all cursor-pointer border-border group"
                  onClick={() => router.push(`/${locale}/document/${doc.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteDocument(doc.id)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="mt-4 line-clamp-2">{doc.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {t('last_updated', { date: new Date(doc.updated_at).toLocaleDateString() })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Languages className="h-4 w-4" />
                        <span className="uppercase text-xs">{doc.source_language}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
