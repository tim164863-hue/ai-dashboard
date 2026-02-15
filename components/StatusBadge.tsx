interface StatusBadgeProps {
  status: "online" | "offline" | "idle" | "error" | "running" | "pending" | "completed";
  label?: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, label, size = "md" }: StatusBadgeProps) {
  const config: Record<string, { color: string; defaultLabel: string }> = {
    online:    { color: "#00E676", defaultLabel: "Online" },
    offline:   { color: "#55556B", defaultLabel: "Offline" },
    idle:      { color: "#FCEE09", defaultLabel: "Idle" },
    error:     { color: "#FF2D6B", defaultLabel: "Error" },
    running:   { color: "#00F0FF", defaultLabel: "Running" },
    pending:   { color: "#FCEE09", defaultLabel: "Pending" },
    completed: { color: "#00E676", defaultLabel: "Completed" },
  };

  const c = config[status] ?? config.offline;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-[10px]";
  const dotSize = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";
  const isActive = status === "online" || status === "running";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider ${sizeClasses}`}
      style={{
        color: c.color,
        border: `1px solid ${c.color}40`,
        backgroundColor: `${c.color}08`,
      }}
      role="status"
      aria-label={`Status: ${label ?? c.defaultLabel}`}
    >
      <span
        className={`${dotSize} ${isActive ? "animate-pulse" : ""}`}
        style={{
          backgroundColor: c.color,
          boxShadow: isActive ? `0 0 6px ${c.color}` : "none",
        }}
      />
      {label ?? c.defaultLabel}
    </span>
  );
}
