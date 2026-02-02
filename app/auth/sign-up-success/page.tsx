import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image
            src="/z-logo.png"
            alt="Z Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Check your email
            </CardTitle>
            <CardDescription className="text-center">
              We've sent you a confirmation link. Click the link in your email to
              activate your account and start using Z.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/auth/login">Return to sign in</Link>
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Didn't receive the email? Check your spam folder or try signing up
              again.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
