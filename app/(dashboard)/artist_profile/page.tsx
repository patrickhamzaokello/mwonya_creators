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
  profilephoto: "https://mwonya-kasfa-assets-store.s3.us-east-1.amazonaws.com/images/artist/4495fad518d4929b0954e971820360e9a12e8d9787ba0f0d4f916084778f6ea0.jpeg",
  cover_image:  "https://mwonya-kasfa-assets-store.s3.us-east-1.amazonaws.com/images/artist/4495fad518d4929b0954e971820360e9a12e8d9787ba0f0d4f916084778f6ea0.jpeg",
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
}

export default function Home() {
  return (
      <ArtistProfile initialData={artistData} />
  )
}

