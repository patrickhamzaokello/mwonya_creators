'use client'

import { useState, useEffect, useRef } from 'react'
import { Howl } from 'howler'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TrackRow } from './track-row'
import { getContentDetails } from '@/actions/getArtists'
import { AddTrackDialog } from './add-Track-Dialog'

import { Skeleton } from '@/components/ui/skeleton'

interface Track {
    title: string
    duration: string
    trackFilePath: string
    explicit?: boolean
}

export function TrackList({ id }: { id: string }) {
    const [tracks, setTracks] = useState<Track[]>([])
    const [artistId, setArtistId] = useState('')
    const [albumId, setAlbumId] = useState('')
    const [genreId, setGenreId] = useState<number>(0)
    const [albumTag, setAlbumTag] = useState('')
    const [albumReleaseDate, setAlbumReleaseDate] = useState('')
    const [currentTrack, setCurrentTrack] = useState<number | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentTime, setCurrentTime] = useState('0:00')
    const howlRef = useRef<Howl | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

    const LoadingSkeleton = () => (
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

    const handleUploadSuccess = () => {
        const fetchContent = async () => {
            setIsFetching(true)
            const response = await getContentDetails(id)
            setTracks(response.content_info.tracks || [])
            setIsFetching(false)
        }
        fetchContent()
    }

    const cleanup = () => {
        if (howlRef.current) {
            howlRef.current.stop()
            howlRef.current.unload()
            howlRef.current = null
        }
        setIsPlaying(false)
        setCurrentTrack(null)
        setProgress(0)
        setCurrentTime('0:00')
        setIsLoading(false)
    }

    useEffect(() => {
        return () => cleanup()
    }, [id])

    useEffect(() => {
        const fetchContent = async () => {
            setIsFetching(true)
            cleanup()
            const response = await getContentDetails(id)
            setTracks(response.content_info.tracks || [])
            setArtistId(response.content_info.artist_id || '')
            setAlbumId(response.content_info.content_id || '')
            setGenreId(response.content_info.genre_id || 0)
            setAlbumTag(response.content_info.releasetype || '')
            setAlbumReleaseDate(response.content_info.releaseDate || '')
            setIsFetching(false)
        }
        fetchContent()
    }, [id])

    const initializeHowl = (index: number) => {
        if (howlRef.current) {
            howlRef.current.stop()
            howlRef.current.unload()
        }

        setIsLoading(true)

        howlRef.current = new Howl({
            src: [tracks[index].trackFilePath],
            html5: true,
            onload: () => {
                setIsLoading(false)
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

    // Handle progress updates
    useEffect(() => {
        let progressInterval: NodeJS.Timeout | null = null

        if (isPlaying && howlRef.current) {
            progressInterval = setInterval(() => {
                if (howlRef.current) {
                    const seek = howlRef.current.seek() as number
                    const duration = howlRef.current.duration()
                    setProgress((seek / duration) * 100)
                    setCurrentTime(formatTime(seek))
                }
            }, 1000)
        }

        return () => {
            if (progressInterval) {
                clearInterval(progressInterval)
            }
        }
    }, [isPlaying])

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const calculateTotalDuration = (tracks: Track[]): string => {
        // Add actual duration calculation logic here
        return "1 hr 23 min"
    }

    const handleSeek = (index: number, percent: number) => {
        if (currentTrack === index && howlRef.current) {
            const duration = howlRef.current.duration();
            howlRef.current.seek(duration * (percent / 100));
        }
    };

    return (
        <div className="lg:col-span-2">
            <div className="rounded-lg border bg-card">
                <div className="flex items-center justify-between border-b p-4">
                    <div>
                        <h3 className="text-lg font-semibold">Tracks</h3>
                        <p className="text-sm text-muted-foreground">
                            {tracks.length} songs, {calculateTotalDuration(tracks)}
                        </p>
                    </div>
                 
                    <AddTrackDialog 
                        onUploadSuccess={handleUploadSuccess}                         
                        artist_id={artistId}
                        album_id={albumId}
                        genre_id={genreId}
                        album_tag={albumTag}
                        album_release_date={albumReleaseDate}
                    />
                </div>

                {isFetching ? (
                    <LoadingSkeleton />
                ) : (
                    <div className="divide-y">
                        {tracks.map((track, index) => (
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
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

