import { Suspense } from "react"
import ArtistProfileEditorWithActions from "@/components/artistSettings/artist-profile-editor"

interface ArtistEditPageProps {
  params: {
    id: string
  }
}

export default function ArtistEditPage({ params }: ArtistEditPageProps) {
  return (


    <div className="min-h-screen text-foreground">
      <div className="max-w-7xl mx-auto flex flex-col space-y-4">
        <Suspense fallback={<div className="p-10 text-center">Loading artist profile...</div>}>
          <ArtistProfileEditorWithActions artistId={params.id} />
        </Suspense>
      </div>

    </div>
  )
}

