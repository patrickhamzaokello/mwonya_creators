import { MetricItemProps } from "@/types/artist";

export const MetricItem = ({ value, label, prefix }: MetricItemProps) => (
    <div className="backdrop-blur-xl hover:bg-accent rounded-xl p-4 transition-all duration-300 group">
      <div className="flex items-center space-x-3">
    
        <div>
          <div className="flex items-baseline space-x-1">
            {prefix && (
              <span className="text-sm text-muted-foreground font-medium">{prefix}</span>
            )}
            <span className="text-xl font-bold tracking-tight text-foreground">
              {value.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );