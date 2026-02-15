interface StatusIndicatorProps {
  status: "online" | "offline" | "idle" | "error";
  label?: string;
  size?: "sm" | "md" | "lg";
}

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  online: { color: "#00E676", label: "Online" },
  offline: { color: "#55556B", label: "Offline" },
  idle: { color: "#FCEE09", label: "Idle" },
  error: { color: "#FF2D6B", label: "Error" },
};

export function StatusIndicator({ status, label, size = "md" }: StatusIndicatorProps) {
  const c = STATUS_CONFIG[status] ?? STATUS_CONFIG.offline;

  const sizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  return (
    <div
      className="flex items-center gap-2 p-2 border border-border/50"
      role="status"
      aria-label={`${label ?? c.label}: ${c.label}`}
    >
      <span
        className={`${sizeClasses[size]} ${status === "online" ? "animate-pulse" : ""}`}
        style={{
          backgroundColor: c.color,
          boxShadow: status === "online" ? `0 0 6px ${c.color}` : "none",
        }}
      />
      <span className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">
        {label ?? c.label}
      </span>
    </div>
  );
}
