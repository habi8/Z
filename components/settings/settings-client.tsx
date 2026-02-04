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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface Profile {
  id: string
  full_name: string | null
}

interface SettingsClientProps {
  user: SupabaseUser
  profile: Profile | null
}


export function SettingsClient({ user, profile }: SettingsClientProps) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('settings')
  const [displayName, setDisplayName] = useState(profile?.full_name || user.user_metadata?.full_name || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: displayName,
        })
        .eq('id', user.id)

      if (error) throw error

      setMessage(t('success'))
      router.refresh()
    } catch (error: any) {
      console.error('[v0] Error saving settings:', error)
      setMessage('Error saving settings: ' + error.message)
    } finally {
      setLoading(false)
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
            <Link href={`/${locale}/dashboard`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Image
                src="/z-logo.png"
                alt="Z Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-2xl font-bold">{t('title')}</span>
            </div>
          </div>
          <LocaleSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile_settings')}</CardTitle>
              <CardDescription>
                {t('profile_description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('email_description')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">{t('display_name')}</Label>
                  <Input
                    id="displayName"
                    placeholder={t('display_name_placeholder')}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>


                {message && (
                  <p className={`text-sm ${message.includes('Error') ? 'text-destructive' : 'text-green-600'}`}>
                    {message}
                  </p>
                )}

                <Button type="submit" disabled={loading} className="gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? t('saving') : t('save_changes')}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('lingo_integration')}</CardTitle>
              <CardDescription>
                {t('lingo_description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <p className="text-muted-foreground mb-2">
                  {t('lingo_configured')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('lingo_docs')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
