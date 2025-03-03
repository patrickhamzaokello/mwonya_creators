export interface MetricItemProps {
    value: number;
    label: string;
    prefix?: string;
  }


  export interface TsearchArtist {
    id: string
    name: string
    imageUrl: string
}


  export interface Artist {
    id: string;
    name: string;
    genre: string;
    bio: string;
    profileImage: string;
    socialLinks: {
      spotify?: string;
      instagram?: string;
      twitter?: string;
    };
  }
  
  export interface ArtistProfileProps {
    artistID: string;
    name: string;
    coverArt?: string;
    profileImage?: string;
    isVerified: boolean;
  }


  export type ProfileArtist = {
    no: number
    id: string
    name: string
    email: string
    phone: string
    facebookurl: string
    twitterurl: string
    instagramurl: string
    youtubeurl: string
    meta_data: string
    RecordLable: string
    isIndependent: boolean
    profilephoto: string
    cover_image: string
    bio: string
    genre: string
    datecreated: string
    releaseDate: string
    available: boolean
    lastupdate: string
    tag: string
    overalplays: number
    status: string
    featured: boolean
    verified: boolean
    circle_cost: number
    circle_cost_maximum: number
    circle_duration: number
  }
  