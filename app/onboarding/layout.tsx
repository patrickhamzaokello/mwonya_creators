import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { loginRoleChecks } from "@/actions/loginRoleCheck"

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  // Redirect if session is null
  if (!session?.user.id) {
    redirect("/auth/login")
  }

  const roleCheckResult = await loginRoleChecks(session)

  // If user already has profiles, redirect to dashboard
  if (!roleCheckResult.needsProfileCreation) {
    redirect("/studio")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center">
            <Image src="/mwonya_logo_white.svg" alt="Creator Studio" width={32} height={32} className="mr-2" />
            <span className="font-bold text-foreground">Creator Studio</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Help Center
            </Link>
            <Link href="/auth/logout" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">{children}</main>

      <footer className="border-t py-6 bg-card">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Creator Studio" width={24} height={24} />
              <span className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Creator Studio. All rights reserved.
              </span>
            </div>
            <div className="flex gap-4">
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

