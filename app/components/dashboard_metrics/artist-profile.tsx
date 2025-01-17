import { useEffect, useState } from 'react';
import { type MetricItemProps, type ArtistProfileProps } from '@/types/artist';
import { getArtistSummaryData } from '@/actions/dashboard/getOverview-stats';
import { MetricsGrid } from '@/components/dashboard_metrics/MetricsGrid';
import { ProfileHeader } from '@/components/dashboard_metrics/ProfileHeader';

const ArtistProfile = ({ artistID, name, coverArt, profileImage, isVerified }: ArtistProfileProps) => {
  const [metrics, setMetrics] = useState<MetricItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!artistID) return;
      
      try {
        setIsLoading(true);
        const data = await getArtistSummaryData(artistID, isVerified) as MetricItemProps[];
        setMetrics(data);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [artistID, isVerified]);

  return (
    <div className="w-full min-h-[24rem] text-white relative bg-gradient-to-b from-background via-background/95 to-background rounded-md">
      {/* Cover Art Background */}
      <div className="absolute inset-0">
      {coverArt ? (
            <img
              src={coverArt}
              alt="Artist Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 animate-gradient-x" />
          )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      {/* Content Container */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 rounded-md">
        <div className="space-y-8">
          <ProfileHeader
            name={name}
            isVerified={isVerified}
            profileImage={profileImage}
          />
          <MetricsGrid
            metrics={metrics}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;