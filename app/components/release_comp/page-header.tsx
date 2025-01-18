import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ExternalLink } from 'lucide-react'

export function PageHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
          </Button>
          <div>
            <h1 className="text-sm font-medium md:text-base">Album Details</h1>
            <p className="text-xs text-muted-foreground">Editing mode</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">Draft</Badge>
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="default">Publish</Button>
        </div>
      </div>
    </header>
  )
}

