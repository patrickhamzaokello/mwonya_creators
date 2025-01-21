import Link from 'next/link'
import { Headphones, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <Headphones className="w-24 h-24 text-primary mb-8" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8 text-center max-w-md">
        Oops! Looks like this page doesn't exist in our records.
      </p>
      <Button asChild>
        <Link href="/studio" className="flex items-center">
          <Home className="mr-2" />
          Back to Your Studio
        </Link>
      </Button>
    </div>
  )
}
