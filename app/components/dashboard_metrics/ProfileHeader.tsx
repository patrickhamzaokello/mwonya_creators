import { Share2, Edit3 } from 'lucide-react';

interface ProfileHeaderProps {
  name: string;
  isVerified: boolean;
  profileImage?: string;
}

export const ProfileHeader = ({ name, isVerified, profileImage }: ProfileHeaderProps) => (
  <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-6 mb-8">
    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden ring-2 ring-primary/30 shadow-xl">
      <img
        src={profileImage || "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200"}
        alt={name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
    </div>

    <div className="flex-1">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 text-foreground">
            {name}
            {isVerified && (
              <span className="inline-flex items-center justify-center w-6 h-6">
                <img src="/verified_white.svg" alt="Verified Artist" className="w-5 h-5" />
              </span>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">Artist</p>
        </div>

        <div className="flex space-x-3">
          <button className="px-4 py-2 rounded-lg bg-accent hover:bg-accent/80 text-accent-foreground transition-colors flex items-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center space-x-2">
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);