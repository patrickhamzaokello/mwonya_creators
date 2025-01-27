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