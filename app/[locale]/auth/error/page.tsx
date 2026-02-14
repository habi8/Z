import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function AuthErrorPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'auth.error_page' })
  const th = await getTranslations({ locale: params.locale, namespace: 'header' })
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image
            src="/z-logo.png"
            alt={th('logo_alt')}
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <XCircle className="h-16 w-16 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              {t('title')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href={`/${params.locale}/auth/login`}>{t('button')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
