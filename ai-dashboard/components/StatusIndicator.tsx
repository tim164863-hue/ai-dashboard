interface StatusIndicatorProps {
  status: "online" | "offline" | "idle" | "error";
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusIndicator({
  status,
  label,
  size = "md",
}: StatusIndicatorProps) {
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-slate-400",
    idle: "bg-amber-500",
    error: "bg-red-500",
  };

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const statusLabels = {
    online: "Online",
    offline: "Offline",
    idle: "Idle",
    error: "Error",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${statusColors[status]} ${sizeClasses[size]} rounded-full animate-pulse`}
      />
      {label && <span className="text-sm text-slate-600">{label}</span>}
      {!label && <span className="text-sm text-slate-600">{statusLabels[status]}</span>}
    </div>
  );
}
