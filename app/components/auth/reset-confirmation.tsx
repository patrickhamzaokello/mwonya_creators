"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Mail, ArrowLeft } from "lucide-react"

import { CardWrapper } from "@/components/auth/CardWrapper"
import { Button } from "@/components/ui/button"

export const ResetConfirmation = () => {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "your email"

  return (
    <CardWrapper headerTitle="Check Your Email" backButtonLabel="Back to login" backButtonHref="/auth/login">
      <div className="flex flex-col items-center justify-center space-y-6 py-4">
        <div className="rounded-full bg-primary/10 p-3">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium">Reset link sent!</h3>
          <p className="text-sm text-muted-foreground">
            We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 w-full">
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Next steps:</p>
              <ol className="text-xs text-muted-foreground list-decimal pl-4 space-y-1">
                <li>Check your email inbox for the reset link</li>
                <li>Click the link in the email to reset your password</li>
                <li>Create a new secure password</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Didn't receive an email? Check your spam folder or
          <Link href="/auth/reset" className="text-primary hover:underline ml-1">
            try again
          </Link>
        </div>

        <Button variant="outline" className="w-full" asChild>
          <Link href="/auth/login" className="flex items-center justify-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to login
          </Link>
        </Button>
      </div>
    </CardWrapper>
  )
}

