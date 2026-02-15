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
    <div className="glass p-5 hud-corners transition-all duration-200 hover:border-primary/30 border-animate">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] font-display font-bold text-text-muted uppercase tracking-[0.2em]">{title}</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-display font-bold text-primary text-glow">{value}</span>
            {unit && <span className="text-[10px] text-text-muted font-mono">{unit}</span>}
          </div>
          {trend && trendValue && (
            <p className={`mt-1.5 text-[10px] font-mono font-medium ${trendClasses[trend]}`}>
              {trend === "up" ? "▲" : trend === "down" ? "▼" : "►"} {trendValue}
            </p>
          )}
        </div>
        {icon && <div className="text-primary/30">{icon}</div>}
      </div>
    </div>
  );
}
