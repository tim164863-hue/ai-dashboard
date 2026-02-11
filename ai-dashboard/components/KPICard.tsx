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
  color = "primary",
}: KPICardProps) {
  const colorClasses = {
    primary: "bg-indigo-50 border-indigo-200 text-indigo-900",
    secondary: "bg-indigo-100 border-indigo-300 text-indigo-900",
    cta: "bg-emerald-50 border-emerald-200 text-emerald-900",
  };

  const trendClasses = {
    up: "text-emerald-600",
    down: "text-red-600",
    neutral: "text-slate-600",
  };

  return (
    <div className={`glass ${colorClasses[color]} border rounded-lg p-6 transition-smooth hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{value}</span>
            {unit && <span className="text-sm text-slate-600">{unit}</span>}
          </div>
          {trend && trendValue && (
            <p className={`mt-2 text-sm font-medium ${trendClasses[trend]}`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </p>
          )}
        </div>
        {icon && <div className="text-2xl opacity-50">{icon}</div>}
      </div>
    </div>
  );
}
