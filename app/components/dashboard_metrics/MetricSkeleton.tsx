export const MetricSkeleton = () => (
    <div className="bg-card rounded-xl p-4 border border-border">
      <div className="flex items-center space-x-3 animate-pulse">
        <div className="w-10 h-10 bg-accent rounded-lg" />
        <div className="space-y-2">
          <div className="w-20 h-4 bg-accent rounded" />
          <div className="w-16 h-3 bg-accent rounded" />
        </div>
      </div>
    </div>
  );