import Image from "next/image"
import type { ProfileArtist } from "@/types/artist"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, CheckCircleIcon, PlayCircleIcon } from "lucide-react"

export function ProfileView({ data, onEdit }: { data: ProfileArtist; onEdit: () => void }) {
  return (
    <div className="space-y-6">
      <div className="relative h-48 rounded-lg overflow-hidden">
        <Image src={data.coverimage || "/placeholder.svg"} alt="Cover" layout="fill" objectFit="cover" />
      </div>
      <div className="flex items-center space-x-4">
        <Image
          src={data.profilephoto || "/placeholder.svg"}
          alt={data.name}
          width={100}
          height={100}
          className="rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold">{data.name}</h2>
          <p className="text-gray-600">{data.genre}</p>
          {data.verified && (
            <Badge variant="secondary" className="mt-1">
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              Verified
            </Badge>
          )}
        </div>
      </div>
      <p className="text-gray-700">{data.bio}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Email</h3>
          <p>{data.email}</p>
        </div>
        <div>
          <h3 className="font-semibold">Phone</h3>
          <p>{data.phone}</p>
        </div>
        <div>
          <h3 className="font-semibold">Record Label</h3>
          <p>{data.RecordLable}</p>
        </div>
        <div>
          <h3 className="font-semibold">Status</h3>
          <p>{data.status}</p>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Social Media</h3>
        <div className="flex space-x-4">
          {data.facebookurl && (
            <a
              href={data.facebookurl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Facebook
            </a>
          )}
          {data.twitterurl && (
            <a
              href={data.twitterurl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Twitter
            </a>
          )}
          {data.instagramurl && (
            <a
              href={data.instagramurl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Instagram
            </a>
          )}
          {data.youtubeurl && (
            <a
              href={data.youtubeurl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              YouTube
            </a>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <PlayCircleIcon className="w-5 h-5 mr-2" />
          <span>{data.overalplays} plays</span>
        </div>
        <div className="flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2" />
          <span>Joined {new Date(data.datecreated).toLocaleDateString()}</span>
        </div>
      </div>
      <Button onClick={onEdit}>Edit Profile</Button>
    </div>
  )
}

