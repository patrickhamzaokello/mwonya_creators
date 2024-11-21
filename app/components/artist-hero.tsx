import { Badge } from "@/components/ui/badge"
import { CheckCircle } from 'lucide-react'
import Image from "next/image"

interface ArtistProfileHeroProps {
  name: string
  coverArt: string
  profileImage: string
  followers: string
  isVerified: boolean
}

export default function ArtistProfileHero({
  name,
  coverArt,
  profileImage,
  followers,
  isVerified,
}: ArtistProfileHeroProps) {
  return (
    <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
      {/* Cover Art */}
      <Image
        src={coverArt}
        alt={`${name}'s cover art`}
        fill
        className="object-cover"
        priority
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      
      {/* Content Container */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
        <div className="flex flex-col items-center md:flex-row md:items-end">
          {/* Profile Image */}
          <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg md:mb-0 md:mr-6">
            <Image
              src={profileImage}
              alt={`${name}'s profile picture`}
              fill
              className="object-cover"
            />
          </div>
          
          {/* Artist Info */}
          <div className="text-center md:text-left">
            <h1 className="mb-2 flex items-center justify-center text-4xl font-bold text-white md:justify-start">
              {name}
              {isVerified && (
                <Badge variant="secondary" className="ml-2">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Verified
                </Badge>
              )}
            </h1>
            <p className="text-lg text-gray-300">
              {followers.toLocaleString()} followers
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

