"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <AlertTriangle className="w-24 h-24 text-destructive mb-8" />
      <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
      <p className="text-xl mb-8 text-center max-w-md">
        We hit a sour note. Don't worry, it happens to the best of us!
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={reset} className="flex items-center">
          <RefreshCcw className="mr-2" />
          Try Again
        </Button>
        <Button asChild variant="outline">
          <Link href="/studio" className="flex items-center">
            <Home className="mr-2" />
            Back to Your Studio
          </Link>
        </Button>
      </div>
    </div>
  )
}

