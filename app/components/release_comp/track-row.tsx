import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Pencil, Play, Pause, Heart, Download, Share2, Trash2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { formatAudioDuration } from '@/utils/audioutils'
import { ArtistSearchPopup } from './artistSearch_popup'
import { ShareComponent } from '../ShareComponent'

interface Track {
    id: string
    title: string
    duration: string
    trackFilePath: string
    explicit?: boolean
}

interface TrackRowProps {
    track: Track;
    index: number;
    isPlaying: boolean;
    onPlayToggle: (index: number) => void;
    progress: number;
    currentTime: string;
    onSeek: (percent: number) => void;
    isLoading: boolean;
    releasesStatus: boolean;
}

export function TrackRow({ track, index, isPlaying, onPlayToggle, progress, currentTime, onSeek, isLoading, releasesStatus }: TrackRowProps) {
    const [isHovered, setIsHovered] = useState(false)

    const track_duration = formatAudioDuration(track.duration);

    return (
        <div
            className="group flex flex-col gap-2 p-4 hover:bg-accent/50 transition-colors"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center gap-4">
                <div className="w-8 flex items-center justify-center">
                    {isHovered || isPlaying || isLoading ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => onPlayToggle(index)}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                // Add a loading spinner or indicator here
                                <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                            ) : isPlaying ? (
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
                        <span>{track_duration}</span>
                        {track.explicit && (
                            <Badge variant="outline" className="text-xs">
                                Explicit
                            </Badge>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                    <ArtistSearchPopup />

                    {releasesStatus ? (
                        <ShareComponent mediaId={track.id} mediaType="track" triggerClassName="bg-primary hover:bg-primary text-black hover:text-black"/>

                    ) : (
                        <div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                            </Button>

                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                            </Button>
                        </div>
                    )}

                </div>
            </div>
            {(isPlaying || isHovered) && (
                <div className="flex items-center gap-2 pl-8 mt-2">
                    <div
                        className="relative flex-1 h-1 bg-background cursor-pointer group"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const percent = ((e.clientX - rect.left) / rect.width) * 100;
                            onSeek(percent);
                        }}
                    >
                        <div
                            className="absolute left-0 top-0 h-full bg-primary transition-all duration-300 ease-in-out"
                            style={{ width: `${progress}%` }}
                        />
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                            style={{ left: `${progress}%` }}
                        />
                    </div>
                    <span className="text-xs text-muted-foreground min-w-[40px] text-right">
                        {currentTime}
                    </span>
                </div>
            )}
        </div>
    )
}

