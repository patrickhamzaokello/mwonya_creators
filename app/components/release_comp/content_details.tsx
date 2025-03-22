'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Share2, Settings, Pencil, Clock, Calendar, Tag, Music2, User, ExternalLink, Plus, Download, ChevronLeft, CheckCircle2, Loader2, MoreHorizontal, Info } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getContentDetails, publish_content } from '@/actions/getArtists'
import { TrackRow } from './track-row'
import { AddTrackDialog } from './add-Track-Dialog'
import { Howl } from 'howler'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Progress } from '../ui/progress'
import { useToast } from '../ui/use-toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { ShareComponent } from '../ShareComponent'

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
    tracks: Track[]
}

interface Track {
    id: string
    title: string
    duration: string
    trackFilePath: string
    explicit?: boolean
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

function TrackListSkeleton() {
    return (
        <div className="divide-y">
            {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="flex items-center gap-4 p-4">
                    <div className="flex items-center gap-3 flex-1">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-3 w-[100px]" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-[100px]" />
                </div>
            ))}
        </div>
    )
}

function HeaderSkeleton() {
    return (
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Left section with back button and album info skeleton */}
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100" disabled>
                            <ChevronLeft className="h-5 w-5 text-muted-foreground/50" />
                            <span className="sr-only">Back to My Albums</span>
                        </Button>

                        <div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                                <Skeleton className="h-4 w-28" />
                                <div className="h-4 w-1 opacity-40">•</div>
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </div>

                    {/* Right section with artist actions skeleton */}
                    <div className="flex items-center gap-2">
                        <div className="mr-2 flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <div className="w-32">
                                <div className="flex justify-between text-xs">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-8" />
                                </div>
                                <Skeleton className="mt-1 h-2 w-full" />
                            </div>
                        </div>

                        <Skeleton className="h-9 w-32" />
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-36" />
                    </div>
                </div>
            </div>
        </header>
    )
}

export function AlbumAndTrackDetails({ id }: { id: string }) {
    const [content, setContent] = useState<AlbumContent | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [currentTrack, setCurrentTrack] = useState<number | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentTime, setCurrentTime] = useState('0:00')
    const howlRef = useRef<Howl | null>(null)

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentReleaseStatus, setCurrentReleaseStatus] = useState(false);

    const { toast } = useToast();


    const handleRemoveFromLive = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            // Make API request to take album for offline
            const data = await publish_content(id, 0);

            if (data.status === 'success' && data.data.success) {
                // Update local state
                setCurrentReleaseStatus(false);
                // Show success toast
                toast({
                    title: "Release is offline",
                    description: data.data.message || "You can edit your release now while its not live, don't forget to submit it again once you're ready.",
                    variant: "default",
                });

                const updatedContent = await getContentDetails(id);
                setContent(updatedContent.content_info);
            } else {
                throw new Error(data.data?.message || "Unknown error");
            }
        } catch (error) {
            console.error('Error deactivating release:', error);

            // Show error toast
            toast({
                title: "Submission failed",
                description: "There was an error  deactivating release. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }

    }

    const handleSubmitForReview = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            // Make API request to submit album for review
            const data = await publish_content(id, 1);

            if (data.status === 'success' && data.data.success) {
                // Update local state
                setCurrentReleaseStatus(true);
                // Show success toast
                toast({
                    title: "Release submitted for review",
                    description: data.data.message || "Our team will review your release and get back to you within 2 business days.",
                    variant: "default",
                });
                const updatedContent = await getContentDetails(id);
                setContent(updatedContent.content_info);
            } else {
                throw new Error(data.data?.message || "Unknown error");
            }
        } catch (error) {
            console.error('Error submitting release for review:', error);

            // Show error toast
            toast({
                title: "Submission failed",
                description: "There was an error submitting your release. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true)
            try {
                const response = await getContentDetails(id)
                setContent(response.content_info)
                setCurrentReleaseStatus(response.content_info.available)
            } catch (error) {
                console.error('Error fetching content:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchContent()
    }, [id])

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

    const initializeHowl = (index: number) => {
        if (howlRef.current) {
            howlRef.current.stop()
            howlRef.current.unload()
        }

        howlRef.current = new Howl({
            src: [content!.tracks[index].trackFilePath],
            html5: true,
            onload: () => {
                howlRef.current?.play()
            },
            onplay: () => setIsPlaying(true),
            onpause: () => setIsPlaying(false),
            onstop: () => {
                setIsPlaying(false)
                setProgress(0)
                setCurrentTime('0:00')
            },
            onend: () => {
                setIsPlaying(false)
                setProgress(0)
                setCurrentTime('0:00')
            },
            onseek: () => {
                if (howlRef.current) {
                    const seek = howlRef.current.seek() as number
                    const duration = howlRef.current.duration()
                    setProgress((seek / duration) * 100)
                    setCurrentTime(formatTime(seek))
                }
            },
        })
    }

    const handlePlayToggle = (index: number) => {
        if (currentTrack === index) {
            if (isPlaying) {
                howlRef.current?.pause()
            } else {
                howlRef.current?.play()
            }
        } else {
            setCurrentTrack(index)
            initializeHowl(index)
        }
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const calculateTotalDuration = (tracks: Track[]): string => {
        // Add actual duration calculation logic here
        return tracks.reduce((acc, track) => {
            const [minutes, seconds] = track.duration.split(':').map(Number)
            return acc + minutes * 60 + seconds
        }, 0).toString()
    }

    const handleSeek = (index: number, percent: number) => {
        if (currentTrack === index && howlRef.current) {
            const duration = howlRef.current.duration();
            howlRef.current.seek(duration * (percent / 100));
        }
    };

    const handleUploadSuccess = () => {
        const fetchContent = async () => {
            setIsLoading(true)
            const response = await getContentDetails(id)
            setContent(response.content_info)
            setIsLoading(false)
        }
        fetchContent()
    }

    if (isLoading) return (
        <div>
            <div className='mb-6'>
                <HeaderSkeleton />
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
                <AlbumDetailsSkeleton />
                <div className="lg:col-span-2">
                    <TrackListSkeleton />
                </div>
            </div>
        </div>

    )

    if (!content) return null

    return (
        <div>
            <div className='mb-6'>
                <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-slate-100">
                    <div className="container mx-auto px-4">
                        <div className="flex h-14 items-center justify-between">
                            {/* Left section - simplified with just back button and title */}
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <ChevronLeft className="h-5 w-5" />
                                    <span className="sr-only">Back</span>
                                </Button>

                                <h1 className="text-base font-semibold truncate max-w-xs">{content.title}</h1>

                                {content.exclusive && (
                                    <Badge className="bg-primary text-xs">Exclusive</Badge>
                                )}
                            </div>

                            {/* Right section - focused on primary actions only */}
                            <div className="flex items-center gap-3">
                                {/* Release status indicator - simplified */}
                                {!content.available && (
                                    <div className="flex items-center gap-2">
                                        <Progress value={80} className="w-20 h-1.5" />
                                        <span className="text-xs text-muted-foreground">80%</span>
                                    </div>
                                )}


                                {currentReleaseStatus && (
                                    // <ShareComponent triggerClassName="bg-primary hover:bg-primary text-black hover:text-black"
                                    //     triggerStyle={{ borderRadius: '8px' }} mediaId={content.content_id} mediaType="collection"

                                    //     className="bg-secondary p-6 rounded-lg"
                                    //     style={{ border: '2px solid #e2e8f0' }}
                                    // />
                                    <ShareComponent triggerClassName="bg-primary hover:bg-primary text-black hover:text-black"
                                    triggerStyle={{ borderRadius: '8px' }} mediaId={content.content_id} mediaType="collection"

                                  
                                />

                                )}


                                {
                                    content.tracks.length > 0 && (

                                        <div className='flex items-center gap-2'>

                                            <Button
                                                variant={content.available ? "destructive" : "default"} // Red background if content is available
                                                size="sm"
                                                className="h-8"
                                                onClick={
                                                    content.available
                                                        ? handleRemoveFromLive // Function to remove from live
                                                        : currentReleaseStatus === false
                                                            ? handleSubmitForReview // Function to submit for review
                                                            : undefined
                                                }
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                                ) : content.available ? (
                                                    <CheckCircle2 className="mr-1 h-4 w-4" />
                                                ) : null}
                                                {isSubmitting
                                                    ? "Submitting..."
                                                    : content.available
                                                        ? "Unpublish"
                                                        : "Publish The Release"}
                                            </Button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </header>

                {/* Conditional Note */}
                {/* Status Tip Message */}
                <div className="mt-4 mb-6">
                    {currentReleaseStatus ? (
                        <div className="flex items-start gap-2.5 p-2.5 rounded-md border-l-2 border-success bg-success/5">
                            <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-medium text-success-dark">Content Published</h4>
                                <p className="text-xs text-success-dark/80">
                                    Your content is live on the platform. To make changes, unpublish first, then edit and republish when done.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-2.5 p-2.5 rounded-md border-l-2 border-primary bg-primary/5">
                            <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-medium text-primary-dark">Action Required</h4>
                                <p className="text-xs text-primary-dark/80">
                                    To make your content available on Mwonya streaming platform, click the <span className="font-medium">Publish</span> button above.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Album Details Section */}
                <div className="lg:col-span-1">
                    <Card className="overflow-hidden shadow-sm border-0">
                        {/* Album Cover - Completely minimal */}
                        <div className="relative">
                            <div className="relative aspect-square">
                                <Image
                                    src={content.imageUrl || "/album_placeholder.svg"}
                                    alt={content.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>

                        <CardContent className="p-5">
                            {/* Artist only - Title moved to header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-sm">
                                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>{content.artist}</span>
                                </div>
                                <Badge variant="secondary">{content.genre_name}</Badge>
                            </div>

                            {/* Description - Only if available and kept short */}
                            {content.description && (
                                <p className="text-sm text-muted-foreground mt-4 line-clamp-3">
                                    {content.description}
                                </p>
                            )}

                            {/* Track count and release date */}
                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
                                <div className="flex items-center">
                                    <Music2 className="h-3.5 w-3.5 mr-1.5" />
                                    <span>{content.releasetype}</span>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                    <span>{formatDate(content.releaseDate)}</span>
                                </div>
                            </div>
                        </CardContent>

                    </Card>
                </div>

                {/* Track List Section */}
                <div className="lg:col-span-2">
                    <div className="rounded-lg border bg-card">
                        <div className="flex items-center justify-between border-b p-4">
                            <div>
                                <h3 className="text-lg font-semibold">Tracks</h3>
                                <p className="text-sm text-muted-foreground">
                                    {content.tracks.length} songs, {calculateTotalDuration(content.tracks)}
                                </p>
                            </div>
                            <AddTrackDialog
                                onUploadSuccess={handleUploadSuccess}
                                artist_id={content.artist_id}
                                album_id={content.content_id}
                                genre_id={content.genre_id}
                                album_tag={content.releasetype}
                                album_release_date={content.releaseDate}
                                album_available={currentReleaseStatus}
                            />
                        </div>

                        <div className="divide-y">
                            {content.tracks.map((track, index) => (
                                <TrackRow
                                    key={index}
                                    track={track}
                                    index={index}
                                    isPlaying={currentTrack === index && isPlaying}
                                    onPlayToggle={() => handlePlayToggle(index)}
                                    progress={currentTrack === index ? progress : 0}
                                    currentTime={currentTrack === index ? currentTime : '0:00'}
                                    onSeek={(percent) => handleSeek(index, percent)}
                                    isLoading={currentTrack === index && isLoading}
                                    releasesStatus={currentReleaseStatus}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}