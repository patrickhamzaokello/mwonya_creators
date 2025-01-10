import Image from "next/image"
import { CheckCircle } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    Card,
    CardContent,
} from "@/components/ui/card"

interface ArtistProfileHeroProps {
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
}: ArtistProfileHeroProps) {
    return (
        <Card className="w-full overflow-hidden">
            <div className="relative h-40">
                <Image
                    src={coverArt}
                    alt={name}
                    layout="fill"
                    objectFit="cover"
                    className="object-center"
                />
            </div>
            <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden">
                        <Image
                            src={profileImage}
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


                                            {isVerified && (
                                                <div

                                                    className="mr-2 ml-2"
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
                        </h2>
                        <p className="text-sm text-muted-foreground">{monthlyListeners} Listeners</p>
                    </div>
                    <Button className="ml-auto">Edit Profile</Button>
                </div>
            </CardContent>
        </Card>
    )
}
