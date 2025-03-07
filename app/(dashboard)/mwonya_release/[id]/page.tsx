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
    <div className="min-h-screen bg-background">
      <PageHeader id={params.id} />
      <main className="container mx-auto py-8 px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          <Suspense fallback={<ContentSkeleton />}>
            <AlbumDetails id={params.id} />
          </Suspense>
          <Suspense fallback={<ContentSkeleton />}>
            <TrackList id={params.id} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

