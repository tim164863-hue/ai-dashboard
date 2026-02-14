interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
  color?: "primary" | "secondary" | "cta";
}

export function KPICard({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon,
}: KPICardProps) {
  const trendClasses = {
    up: "text-success",
    down: "text-danger",
    neutral: "text-text-muted",
  };

  return (
    <div className="glass p-5 transition-all duration-200 hover:border-primary/30">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-text-primary font-mono">{value}</span>
            {unit && <span className="text-xs text-text-muted">{unit}</span>}
          </div>
          {trend && trendValue && (
            <p className={`mt-1.5 text-xs font-medium ${trendClasses[trend]}`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </p>
          )}
        </div>
        {icon && <div className="text-primary/40">{icon}</div>}
      </div>
    </div>
  );
}
