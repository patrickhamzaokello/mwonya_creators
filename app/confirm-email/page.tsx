"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SignupConfirmation() {
  const [email, setEmail] = useState("")

  useEffect(() => {
    const userEmail = "Check your inbox and click to confirm"
    setEmail(userEmail)
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-6 md:p-8 space-y-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-primary mb-2">Check Your Inbox</h2>
                <p className="text-muted-foreground">We've sent a confirmation link to:</p>
                <p className="text-lg font-medium text-foreground mt-1">{email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary mt-0.5" size={20} />
                  <p>Click the link in the email to confirm your account</p>
                </div>
                <div className="flex items-start space-x-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="text-primary mt-0.5" size={20} />
                  <p>If you don't see it, check your spam folder</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center md:text-left">
                  Didn't receive the email? You can try logging in or contact support.
                </p>
                <div className="flex space-x-2">
                  <Link href="/auth/login" className="w-full">
                    <Button type="button" className="w-full">
                      Go to Login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 relative h-48 md:h-auto">
              <Image
                src="https://assets.mwonya.com/images/artistprofiles/Lukas%C2%A0Blacc_profile_20230317135613_04099.JPG"
                alt="Confirmation Illustration"
                layout="fill"
                objectFit="cover"
                className="rounded-b-lg md:rounded-r-lg md:rounded-bl-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

