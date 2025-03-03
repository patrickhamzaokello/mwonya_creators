import Image from "next/image"
import type { ProfileArtist } from "@/types/artist"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Calendar, Play, Users } from "lucide-react"
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"


export function ProfileView({ data: artistData, onEdit }: { data: ProfileArtist; onEdit: () => void }) {

  const tags = artistData.tag.split(",")
  const formattedDate = new Date(artistData.releaseDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (

    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Card className="overflow-hidden border-none shadow-lg">
        {/* Cover Image */}
        <div className="relative h-64 md:h-80 w-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${artistData.cover_image})` }}
          >
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        </div>

        <CardContent className="relative px-6 pt-0 pb-6">
          {/* Profile Photo */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start -mt-16 md:-mt-20">
              <div className="relative">
                <img
                  src={artistData.profilephoto || "/placeholder.svg"}
                  alt={artistData.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background object-cover"
                />
                {artistData.featured && (
                  <div className="absolute bottom-0 right-0 bg-yellow-500 text-white p-1 rounded-full">
                    <span className="sr-only">Featured Artist</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 mt-4 md:mt-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{artistData.name}</h1>
                    {artistData.verified && <CheckCircle className="h-5 w-5 text-blue-500" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <span>{artistData.genre}</span>
                    <span>•</span>
                    <span>{artistData.isIndependent ? "Independent" : artistData.RecordLable}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button variant="outline" size="sm">
                    Follow
                  </Button>
                  <Button size="sm">Join Circle (${artistData.circle_cost}/mo)</Button>
                  <Button onClick={onEdit}>Edit Profile</Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                {artistData.facebookurl && (
                  <a
                    href={artistData.facebookurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-blue-600"
                  >
                    <FaFacebook className="h-5 w-5" />
                    <span className="sr-only">Facebook</span>
                  </a>
                )}
                {artistData.twitterurl && (
                  <a
                    href={artistData.twitterurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-blue-400"
                  >
                    <FaTwitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </a>
                )}
                {artistData.instagramurl && (
                  <a
                    href={artistData.instagramurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-pink-600"
                  >
                    <FaInstagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </a>
                )}
                {artistData.youtubeurl && (
                  <a
                    href={artistData.youtubeurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-red-600"
                  >
                    <FaYoutube className="h-5 w-5" />
                    <span className="sr-only">YouTube</span>
                  </a>
                )}
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">About</h2>
                  <p className="text-muted-foreground">{artistData.bio}</p>

                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="capitalize">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-4 flex items-center gap-3">
                      <Play className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Total Plays</div>
                        <div className="font-semibold">{artistData.overalplays.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="bg-muted rounded-lg p-4 flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Release Date</div>
                        <div className="font-semibold">{formattedDate}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-2">Circle Membership</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Exclusive content for fans</span>
                        </div>
                        <div className="mt-1 font-medium">
                          ${artistData.circle_cost} - ${artistData.circle_cost_maximum}/month
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Learn More
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-2">Contact</h3>
                    {artistData.available ? (
                      <div className="space-y-1 text-sm">
                        <div className="text-muted-foreground">For bookings and inquiries:</div>
                        <div>{artistData.email}</div>
                        <div>{artistData.phone}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        This artist is not currently available for bookings.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

