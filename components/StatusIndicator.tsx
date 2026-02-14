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
    online: "bg-success",
    offline: "bg-text-muted",
    idle: "bg-warning",
    error: "bg-danger",
  };

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
  };

  const statusLabels = {
    online: "Online",
    offline: "Offline",
    idle: "Idle",
    error: "Error",
  };

  return (
    <div className="flex items-center gap-2" role="status" aria-label={`${label ?? statusLabels[status]}: ${statusLabels[status]}`}>
      <span
        className={`${statusColors[status]} ${sizeClasses[size]} rounded-full ${
          status === "online" ? "animate-pulse" : ""
        }`}
      />
      <span className="text-sm text-text-secondary">{label ?? statusLabels[status]}</span>
    </div>
  );
}
