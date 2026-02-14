import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export default function SignUpSuccessPage() {
  const locale = useLocale()
  const t = useTranslations('auth.signup_success')
  const th = useTranslations('header')
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href={`/${locale}`}>
            <Image
              src="/z-logo.png"
              alt={th('logo_alt')}
              width={120}
              height={120}
              className="object-contain cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              {t('title')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href={`/${locale}/auth/login`}>{t('button')}</Link>
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              {t('footer')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
