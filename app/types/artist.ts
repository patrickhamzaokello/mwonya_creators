export interface MetricItemProps {
    value: number;
    label: string;
    prefix?: string;
  }
  
  export interface ArtistProfileProps {
    artistID: string;
    name: string;
    coverArt?: string;
    profileImage?: string;
    isVerified: boolean;
  }