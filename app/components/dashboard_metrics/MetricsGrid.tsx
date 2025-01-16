import { type MetricItemProps } from '@/types/artist';
import { MetricItem } from './MetricItem';
import { MetricSkeleton } from './MetricSkeleton';

interface MetricsGridProps {
  metrics: MetricItemProps[];
  isLoading: boolean;
  error: string | null;
}

export const MetricsGrid = ({ metrics, isLoading, error }: MetricsGridProps) => {
  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive-foreground flex items-center space-x-2">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {isLoading
        ? Array.from({ length: 4 }, (_, i) => <MetricSkeleton key={i} />)
        : metrics.map((metric, index) => (
            <MetricItem key={index} {...metric} />
          ))
      }
    </div>
  );
};