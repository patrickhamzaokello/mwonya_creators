import { Suspense } from 'react'
import Image from 'next/image'
import { getContentDetails } from '@/actions/getArtists'
import { MoreVertical, Pencil, Plus, GripVertical, ExternalLink, ChevronLeft, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

function ContentSkeleton() {
  return (
    <div className="grid h-full w-full place-items-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="aspect-square w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

export default async function ContentPage({
  params
}: {
  params: { id: string }
}) {
  console.log(params.id)
  const response = await getContentDetails(params.id)
  console.log(response)
  const content:AlbumContent = response.content_info

  console.log(content)



  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<ContentSkeleton />}>
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="md:hidden">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-sm font-medium md:text-base">Album Details</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="hidden md:inline-flex">Draft</Badge>
              <Button className="hidden md:inline-flex">Publish</Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto grid max-w-[1400px] gap-6 p-4 md:grid-cols-2 md:gap-8 md:p-6 lg:grid-cols-3">
          {/* Album Info Section */}
          <div className="space-y-6 md:sticky md:top-20 md:h-fit">
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-card">
              <Image
                src={content.imageUrl}
                alt={content.title}
                fill
                className="object-cover"
                priority
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute right-3 top-3"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold">{content.title}</h2>
                    <p className="text-muted-foreground">{content.artist}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:hidden">
                <Button>Publish Album</Button>
                <Button variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </div>
            </div>
          </div>

          {/* Tracks Section */}
          <div className="md:col-span-1 lg:col-span-2">
            <div className="rounded-lg border bg-card">
              <div className="flex items-center justify-between border-b p-4">
                <div>
                  <h3 className="font-medium">Tracks</h3>
                  <p className="text-sm text-muted-foreground">
                    {content.tracks?.length || 0} songs
                  </p>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Track
                </Button>
              </div>

              <div className="divide-y">
                {content.tracks?.map((track, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-4 p-4 hover:bg-accent/50"
                  >
                    <GripVertical className="hidden h-4 w-4 text-muted-foreground md:block" />
                    <span className="w-6 text-sm font-medium text-muted-foreground md:w-8">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{track.title}</p>
                      <p className="text-sm text-muted-foreground">{track.duration}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="hidden md:group-hover:inline-flex"
                      >
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>Edit Track Details</DropdownMenuItem>
                          <DropdownMenuItem>Replace Audio File</DropdownMenuItem>
                          <DropdownMenuItem>Reorder Track</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Remove Track
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </Suspense>
    </div>
  )
}