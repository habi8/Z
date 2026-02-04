'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
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
import { Plus, FileText, Settings, LogOut, Folder, User } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface Workspace {
  id: string
  name: string
  description: string | null
  created_at: string
}

interface DashboardClientProps {
  user: SupabaseUser
  initialWorkspaces: Workspace[]
}

export function DashboardClient({ user, initialWorkspaces }: DashboardClientProps) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('dashboard')
  const th = useTranslations('header')
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}/auth/login`)
    router.refresh()
  }

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          name: newWorkspaceName,
          description: newWorkspaceDescription || null,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      setWorkspaces([data, ...workspaces])
      setNewWorkspaceName('')
      setNewWorkspaceDescription('')
      setIsCreateDialogOpen(false)
    } catch (error: any) {
      console.error('[v0] Error creating workspace:', error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/z-logo.png"
              alt="Z Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-2xl font-bold">Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" suppressHydrationWarning>
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.user_metadata?.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {t('welcome', { name: user.user_metadata?.full_name?.split(' ')[0] || 'there' })}
              </h1>
              <p className="text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('new_workspace')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('create_title')}</DialogTitle>
                  <DialogDescription>
                    {t('create_description')}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateWorkspace} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('workspace_name')}</Label>
                    <Input
                      id="name"
                      placeholder={t('name_placeholder')}
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">{t('workspace_description')}</Label>
                    <Input
                      id="description"
                      placeholder={t('desc_placeholder')}
                      value={newWorkspaceDescription}
                      onChange={(e) => setNewWorkspaceDescription(e.target.value)}
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

          {/* Workspaces Grid */}
          {workspaces.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Folder className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('no_workspaces')}</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  {t('no_workspaces_description')}
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('create_first')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((workspace) => (
                <Card
                  key={workspace.id}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer border-border/50 bg-card/50 hover:bg-card group relative overflow-hidden"
                  onClick={() => router.push(`/${locale}/workspace/${workspace.id}`)}
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Folder className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle settings
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="mt-4">{workspace.name}</CardTitle>
                    {workspace.description && (
                      <CardDescription className="line-clamp-2">
                        {workspace.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{t('docs_count', { count: 0 })}</span>
                      </div>
                      <div className="text-xs">
                        {t('created_at', { date: new Date(workspace.created_at).toLocaleDateString() })}
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
