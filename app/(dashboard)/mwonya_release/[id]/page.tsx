import { Suspense } from 'react'
import { AlbumDetails } from '@/components/release_comp/album-details'
import { TrackList } from '@/components/release_comp/track-list'
import { PageHeader } from '@/components/release_comp/page-header'
import { ContentSkeleton } from '@/components/release_comp/content-skeleton'

interface PageProps {
  params: {
    id: string
  }
}

export default function ReleasePage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <PageHeader id={params.id} />
        <div className="grid gap-8 lg:grid-cols-3 mt-3">
          <Suspense fallback={<ContentSkeleton />}>
            <AlbumDetails id={params.id} />
          </Suspense>
          <Suspense fallback={<ContentSkeleton />}>
            <TrackList id={params.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

