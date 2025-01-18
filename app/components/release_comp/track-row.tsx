import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Pencil, Play, Pause, Heart, Download, Share2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface Track {
  title: string
  duration: string
  trackFilePath: string
  explicit?: boolean
}

interface TrackRowProps {
  track: Track
  index: number
  isPlaying: boolean
  onPlayToggle: (index: number) => void
  audioRef: React.RefObject<HTMLAudioElement>
}

export function TrackRow({ track, index, isPlaying, onPlayToggle, audioRef }: TrackRowProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      const duration = audio.duration
      const currentTime = audio.currentTime
      setProgress((currentTime / duration) * 100)
      setCurrentTime(formatTime(currentTime))
    }

    audio.addEventListener('timeupdate', updateProgress)
    return () => audio.removeEventListener('timeupdate', updateProgress)
  }, [audioRef])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div
      className="group flex flex-col gap-2 p-4 hover:bg-accent/50 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-4">
        <div className="w-8 flex items-center justify-center">
          {isHovered || isPlaying ? (
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
            <span className="sr-only">Like</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
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
      {isPlaying && (
        <div className="flex items-center gap-2 pl-8">
          <Progress value={progress} className="flex-1" />
          <span className="text-xs text-muted-foreground">{currentTime}</span>
        </div>
      )}
    </div>
  )
}

