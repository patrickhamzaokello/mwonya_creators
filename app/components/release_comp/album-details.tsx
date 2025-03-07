'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Share2, Settings, Pencil, Clock, Calendar, Tag, Music2, User, ExternalLink } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getContentDetails } from '@/actions/getArtists'

interface AlbumContent {
  content_id: string
  title: string
  artist: string
  artist_id: string
  genre_id: number
  imageUrl: string
  releasetype: string
  genre_name: string
  description: string
  releaseDate: string
  tags: string
  exclusive: boolean
  available: boolean
  duration: string
}

// Skeleton loader component
function AlbumDetailsSkeleton() {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-6">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Separator />
          <div className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-40" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function AlbumDetails({ id }: { id: string }) {
  const [content, setContent] = useState<AlbumContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true)
      try {
        const response = await getContentDetails(id)
        setContent(response.content_info)
      } catch (error) {
        console.error('Error fetching content:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchContent()
  }, [id])

  if (isLoading) return <AlbumDetailsSkeleton />
  if (!content) return null

  const formatDuration = (duration: string) => {
    const match = duration.match(/(\d{2}):(\d{2}):(\d{2})/)
    if (match) {
      const [, hours, minutes, seconds] = match
      return `${minutes}:${seconds.split('.')[0]}`
    }
    return duration
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getTags = (tags: string) => {
    return tags.split(',').filter(tag => tag.trim() !== '')
  }

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-24">
        <CardContent className="p-6 space-y-6">
          {/* Image Section */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group ring-1 ring-muted">
                <Image
                  src={content.imageUrl || "/album_placeholder.svg"}
                  alt={content.title}
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-105"
                  priority
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Pencil className="h-6 w-6 text-white" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Album Artwork</DialogTitle>
              </DialogHeader>
              {/* Add upload functionality here */}
            </DialogContent>
          </Dialog>

          {/* Title and Artist Section */}
          <div className="space-y-3">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">{content.title}</h2>
              <Button variant="link" className="h-auto p-0 text-lg text-muted-foreground hover:no-underline">
                <User className="h-4 w-4 mr-2" />
                {content.artist}
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Primary Metadata */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm">
              <Music2 className="h-3 w-3 mr-1" />
              {content.releasetype}
            </Badge>
            <Badge variant="secondary">{content.genre_name}</Badge>
            {content.exclusive && (
              <Badge className='bg-primary'>
                Exclusive
              </Badge>
            )}
          </div>

          <Separator className="my-4" />

          {/* Secondary Metadata */}
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{formatDuration(content.duration)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{formatDate(content.releaseDate)}</span>
              </div>
            </div>
            {content.description && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-muted-foreground leading-relaxed">
                  {content.description}
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          {content.tags && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {getTags(content.tags).map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs hover:bg-muted transition-colors"
                  >
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant={content.available ? "default" : "outline"}
              className="w-full"
              disabled={!content.available}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}