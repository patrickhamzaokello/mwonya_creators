import { ProfileArtist } from "@/types/artist"
import { ArtistProfile } from "@/components/artistSettings/ArtistProfile"

// In a real application, you would fetch this data from your database
const artistData: ProfileArtist = {
  no: 1,
  id: "artist123",
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "+1234567890",
  facebookurl: "https://facebook.com/janedoe",
  twitterurl: "https://twitter.com/janedoe",
  instagramurl: "https://instagram.com/janedoe",
  youtubeurl: "https://youtube.com/janedoe",
  meta_data: "",
  RecordLable: "Independent",
  isIndependent: true,
  password: "", // We won't display or edit this
  profilephoto: "/album_placeholder.svg?height=200&width=200",
  profile_image_id: "profile123",
  cover_image_id: "cover123",
  coverimage: "/album_placeholder.svg?height=400&width=1200",
  bio: "Jane is a contemporary artist known for her soulful vocals and introspective lyrics.",
  genre: "Indie Pop",
  datecreated: "2023-01-01",
  releaseDate: "2023-06-15",
  available: true,
  lastupdate: "2023-06-20",
  tag: "indie,pop,acoustic",
  overalplays: 10000,
  status: "active",
  featured: true,
  verified: true,
  circle_cost: 5,
  circle_cost_maximum: 20,
  circle_duration: 30,
  notified: true,
  indexed: true,
}

export default function Home() {
  return (
    <main className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Artist Profile</h1>
      <ArtistProfile initialData={artistData} />
    </main>
  )
}

