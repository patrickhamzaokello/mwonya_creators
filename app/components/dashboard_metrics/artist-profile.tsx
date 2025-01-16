'use client'

import Image from "next/image"
import { Edit3, Users, Music, Share2 } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ArtistSummaryMetrics from "./artist-profile-sub"

interface ArtistProfileProps {
    name: string
    coverArt: string
    profileImage: string
    followers: string
    monthlyListeners: string
    isVerified: boolean
}

export function ArtistProfile({
    name,
    coverArt,
    profileImage,
    followers,
    monthlyListeners,
    isVerified,
}: ArtistProfileProps) {
    return (
        <Card className="w-full overflow-hidden">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-1/3 h-64 md:h-auto">
                        <Image
                            src={coverArt || "/placeholder.svg"}
                            alt={`${name}'s cover art`}
                            layout="fill"
                            objectFit="cover"
                            className="object-center"
                        />
                    </div>
                    <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="relative h-24 w-24 rounded-full overflow-hidden ring-2 ring-primary/20">
                                    <Image
                                        src={profileImage || "/placeholder.svg"}
                                        alt={name}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold flex items-center">
                                        {name}
                                        {isVerified && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <div className="ml-2">
                                                            <Image src="/verified_white.svg" alt="Verified Artist" width={20} height={20} />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Verified Artist</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">Artist</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                                <Button variant="default" size="sm">
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <ArtistSummaryMetrics />                          
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

