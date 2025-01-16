'use client'

import { useEffect, useState } from 'react'
import React from 'react';
import { Music, DollarSign, Users, Disc, Music2 } from 'lucide-react';
import { getArtistSummaryData } from '@/actions/dashboard/getOverview-stats';



const MetricItem: React.FC<MetricItemProps> = ({ value, label, icon: Icon, prefix, color }) => (
    <div className="group relative px-8">
    {/* Background highlight on hover */}
    <div className="absolute inset-0 opacity-0 ">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl" />
      <div className={`absolute inset-0 bg-zinc-100 opacity-5 rounded-xl`} />
    </div>
    
    {/* Content */}
    <div className="relative flex flex-col items-center space-y-3">
      {/* Icon */}
      <div className={`p-2 rounded-lg bg-zinc-100 bg-opacity-10 group-hover:scale-105 transition-transform`}>
        <Icon className={`w-5 h-5`} />
      </div>
      
      {/* Value */}
      <div className="flex items-baseline space-x-1">
        {prefix && (
          <span className="text-sm font-medium text-gray-500 transition-colors">
            {prefix}
          </span>
        )}
        <span className="text-2xl font-bold tracking-tight">
          {value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </span>
      </div>
      
      {/* Label */}
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>
    </div>
  </div>
);

interface ArtistSummaryMetricsProps {
  isVerified: boolean;
  artistID: string;
}

const ArtistSummaryMetrics: React.FC<ArtistSummaryMetricsProps> = ({ isVerified, artistID }) => {

    const [metrics, setMetrics] = useState<Song[] | MessageType | any>([])
      const [isLoading, setIsLoading] = useState(true)
      const [error, setError] = useState<string | null>(null)
    
      useEffect(() => {
        if (!artistID) return; // Ensure id is available before calling the server action
        setIsLoading(true);
    
        getArtistSummaryData(artistID,isVerified)
          .then(setMetrics)
          .catch(() => setError('Failed to load  data'))
          .finally(() => setIsLoading(false));
      }, [artistID]);
    
      if (isLoading) {
        return <>Loading</>
      }
    
      if (error) {
        return <div className="text-red-500">{error}</div>
      }
    
 

  return (
    <div className="w-full rounded-xl shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex divide-x divide overflow-x-auto">
          {metrics.map((metric: MetricItemProps, index: number) => (
            <MetricItem
              key={index}
              value={metric.value}
              label={metric.label}
              icon={metric.icon}
              prefix={metric.prefix}
              color={metric.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistSummaryMetrics;