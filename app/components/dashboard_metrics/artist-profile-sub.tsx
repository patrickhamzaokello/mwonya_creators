import React from 'react';
import { Music, DollarSign, Users, Disc, Music2 } from 'lucide-react';

interface MetricItemProps {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  prefix?: string;
}

const MetricItem: React.FC<MetricItemProps> = ({ value, label, icon: Icon, prefix }) => (
  <div className="group flex flex-col items-center relative px-6 py-3 hover:bg-gray-50 transition-all duration-300">
    <div className="flex items-center space-x-2 mb-1">
      <Icon className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
      {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
    </div>
    <p className="text-sm text-muted-foreground group-hover:text-gray-700 transition-colors">{label}</p>
    
    <div className="absolute -z-10 inset-0 bg-gradient-to-b from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
  </div>
);

const ArtistSummaryMetrics = () => {
  const metrics = [
    {
      value: '200,000',
      label: 'Total Streams',
      icon: Music,
    },
    {
      value: '200,000',
      label: 'Stream Revenue',
      icon: DollarSign,
      prefix: 'Ugx'
    },
    {
      value: '200,000',
      label: 'Artist Circle',
      icon: Users,
      prefix: 'Ugx'
    },
    {
      value: '10',
      label: 'Releases',
      icon: Disc,
    },
    {
      value: '32',
      label: 'Tracks',
      icon: Music2,
    }
  ];

  return (
    <div className="w-full rounded-xl shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex divide-x divide overflow-x-auto">
          {metrics.map((metric, index) => (
            <MetricItem
              key={index}
              value={metric.value}
              label={metric.label}
              icon={metric.icon}
              prefix={metric.prefix}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistSummaryMetrics;