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

    
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Optional logo area */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-baseContent">MWONYA APP</h1>
      </div>
      
      <Card className="w-full max-w-xl shadow-lg rounded-xl border-baseContent/10">
        <CardHeader className="space-y-3 pb-6">
          <Header title={headerTitle} />
        </CardHeader>

        <CardContent className="pb-6">
          {children}
        </CardContent>

        <CardFooter className="flex justify-center border-t border-baseContent/10 pt-6">
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </CardFooter>
      </Card>
      
    
    </div>
  )
}