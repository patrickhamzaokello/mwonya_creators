'use client'

import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Header } from '@/components/auth/Header'
import { BackButton } from '@/components/auth/BackButton'

interface CardWrapperProps {
  children: React.ReactNode
  headerTitle: string
  backButtonLabel: string
  backButtonHref: string
  showSocial?: boolean
}

export const CardWrapper = ({
  children,
  showSocial,
  backButtonLabel,
  backButtonHref,
  headerTitle
}: CardWrapperProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center  px-4 py-12">
      <Card className="w-full max-w-xl bg-white shadow-lg rounded-xl border-0">
        <CardHeader className="space-y-3 pb-6">
          <Header title={headerTitle} />
        </CardHeader>

        <CardContent className="pb-8">
          {children}
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-6">
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </CardFooter>
      </Card>
    </div>
  )
}