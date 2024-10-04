"use client"
import { useArtist } from "@/contexts/ArtistContext";
import { Search, Menu, Calendar, Bell, Music, User } from 'lucide-react';
import DashboardMetrics from "./DashboardMetric";
import ArtistPerformanceChart from './ArtistPerformanceChart';

const ArtistStudio = () => {
  const [selectedArtist, setSelectedArtist] = useArtist();
  return (
    <>


      <div>
        <div className="dark rounded-lg">
          <DashboardMetrics />

          <ArtistPerformanceChart />
        </div>
      </div>


    </>
  );
};

export default ArtistStudio;