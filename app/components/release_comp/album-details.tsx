'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Share2, Settings, Pencil } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getContentDetails } from '@/actions/getArtists'

interface AlbumContent {
  title: string
  artist: string
  imageUrl: string
}

export function AlbumDetails({ id }: { id: string }) {
  const [content, setContent] = useState<AlbumContent | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      const response = await getContentDetails(id)
      setContent(response.content_info)
    }
    fetchContent()
  }, [id])

  if (!content) return null

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-6">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-card cursor-pointer group">
              <Image
                src={content.imageUrl || "/placeholder.svg"}
                alt={content.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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

        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold">{content.title}</h2>
            <p className="text-lg text-muted-foreground">{content.artist}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

