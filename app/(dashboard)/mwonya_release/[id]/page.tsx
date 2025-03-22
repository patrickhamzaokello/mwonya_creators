import { Suspense } from 'react'
import { ContentSkeleton } from '@/components/release_comp/content-skeleton'
import { AlbumAndTrackDetails } from '@/components/release_comp/content_details'

interface PageProps {
  params: {
    id: string
  }
}

export default function ReleasePage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<ContentSkeleton />}>
          <AlbumAndTrackDetails id={params.id} />
        </Suspense>
      </div>
    </div>
  )
}

