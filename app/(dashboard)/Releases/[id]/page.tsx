import React, { Suspense, useState } from 'react';
import Image from 'next/image';
import { getContentDetails } from '@/actions/getArtists';
import {
  MoreVertical, Pencil, Plus, GripVertical, ExternalLink,
  ChevronLeft, Settings, Play, Pause, Clock, Download,
  Share2, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

function ContentSkeleton() {
  return (
    <div className="grid h-full w-full place-items-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex gap-6">
          <Skeleton className="aspect-square w-48 h-48" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  );
}

const TrackRow = ({ track, index, isPlaying, onPlayToggle }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-8 flex items-center justify-center">
        {isHovered ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onPlayToggle(index)}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium">{track.title}</p>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <span>{track.duration}</span>
          {track.explicit && (
            <Badge variant="outline" className="text-xs">
              Explicit
            </Badge>
          )}
        </p>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Heart className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Download className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Track Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="mr-2 h-4 w-4" />
              Share Track
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Remove Track
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default async function ContentPage({
  params
}: {
  params: { id: string }
}) {
  const response = await getContentDetails(params.id);
  const content = response.content_info;

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<ContentSkeleton />}>
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-sm font-medium md:text-base">Album Details</h1>
                <p className="text-xs text-muted-foreground">Editing mode</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">Draft</Badge>
              <Button>
                <ExternalLink className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button variant="default">Publish</Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Album Info */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative aspect-square overflow-hidden rounded-lg border bg-card cursor-pointer group">
                      <Image
                        src={content.imageUrl}
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
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracks Section */}
            <div className="lg:col-span-2">
              <div className="rounded-lg border bg-card">
                <div className="flex items-center justify-between border-b p-4">
                  <div>
                    <h3 className="text-lg font-semibold">Tracks</h3>
                    <p className="text-sm text-muted-foreground">
                      {content.tracks?.length || 0} songs, {calculateTotalDuration(content.tracks)}
                    </p>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Track
                  </Button>
                </div>

                <div className="divide-y">
                  {content.tracks?.map((track, index) => (
                    <TrackRow
                      key={index}
                      track={track}
                      index={index}
                      isPlaying={false}
                      onPlayToggle={() => {}}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Playback Bar */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto p-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Play className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <Progress value={33} className="h-1" />
              </div>
              <span className="text-sm text-muted-foreground">1:23 / 3:45</span>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}

function calculateTotalDuration(tracks) {
  // Add actual duration calculation logic here
  return "1 hr 23 min";
}