'use client'

import React from 'react'
import { MoreHorizontal, ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from 'next/image'

interface Song {
  song_title: string
  total_plays: number
  album_cover: string
  url: string
}

interface TopTracksProps {
  songs: Song[]
}

export function TopTracks({ songs }: TopTracksProps) {
  if (!Array.isArray(songs) || songs.length === 0) {
    return null
  }

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-medium">Top Tracks</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-sm">
              Last 30 Days
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
            <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
            <DropdownMenuItem>Last 6 Months</DropdownMenuItem>
            <DropdownMenuItem>All Time</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {songs.map((song, index) => (
            <div
              key={index}
              className="group flex items-center justify-between gap-4 py-3 border-b last:border-b-0 border-border"
            >
              <a
                href={song.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 flex-1 min-w-0 hover:bg-accent/50 rounded-md p-2 transition-colors"
                aria-label={`View details for ${song.song_title}`}
              >
                <span className="w-5 text-sm font-medium text-muted-foreground">
                  {index + 1}
                </span>
                <div className="relative w-10 h-10 overflow-hidden rounded-sm">
                  <Image
                    src={song.album_cover || "/album_placeholder.svg"}
                    alt={`${song.song_title} cover`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">
                    {song.song_title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {song.total_plays.toLocaleString()} plays
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options for {song.song_title}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit track info</DropdownMenuItem>
                    <DropdownMenuItem>View analytics</DropdownMenuItem>
                    <DropdownMenuItem>Share track</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

