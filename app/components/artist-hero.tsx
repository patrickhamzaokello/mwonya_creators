import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle, Play, Share2, MoreHorizontal } from 'lucide-react'
import Image from "next/image"

interface ArtistProfileHeroProps {
    name: string
    coverArt: string
    profileImage: string
    followers: string
    monthlyListeners: string
    isVerified: boolean
}

export default function ArtistProfileHero({
    name,
    coverArt,
    profileImage,
    followers,
    monthlyListeners,
    isVerified,
}: ArtistProfileHeroProps) {
    return (
        <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden">
            {/* Cover Art Background */}
            <div className="absolute inset-0">
                <Image
                    src={coverArt}
                    alt={`${name}'s cover art`}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparen" /> {/* Overlay */}
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 flex items-end p-6 md:p-8">
                <div className="flex flex-col items-start md:flex-row md:items-center">
                    {/* Profile Image */}
                    <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full shadow-lg md:mb-0 md:mr-6">
                        <Image
                            src={profileImage}
                            alt={`${name}'s profile picture`}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Artist Info and Actions */}
                    <div>
                        <div className="mb-4">
                            <h1 className="mb-1 flex items-center text-3xl font-bold text-primary md:text-4xl">
                                {name}
                                {isVerified && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                               

                                                    {isVerified && (
                                                        <div

                                                            className="mr-2"
                                                        >
                                                            <Image src="/verified_white.svg" alt="omsdf" width={18} height={18} />

                                                        </div>
                                                    )}

                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Verified Artist</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </h1>
                            <p className="text-sm text-muted-foreground md:text-base">
                                {followers.toLocaleString()} followers · {monthlyListeners.toLocaleString()} monthly listeners
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2 md:space-x-4">
                            <Button size="sm" className="rounded-full md:size-lg">
                                <Play className="mr-2 h-4 w-4" />
                                Play
                            </Button>
                            <Button size="sm" variant="outline" className="rounded-full md:size-lg">
                                Follow
                            </Button>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size="icon" variant="ghost" className="rounded-full">
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Share</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size="icon" variant="ghost" className="rounded-full">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>More options</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

