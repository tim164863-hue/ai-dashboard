interface StatusBadgeProps {
  status: "online" | "offline" | "idle" | "error" | "running" | "pending" | "completed";
  label?: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, label, size = "md" }: StatusBadgeProps) {
  const config: Record<string, { dot: string; bg: string; text: string; defaultLabel: string }> = {
    online:    { dot: "bg-success",  bg: "bg-success/10", text: "text-success",  defaultLabel: "Online" },
    offline:   { dot: "bg-text-muted", bg: "bg-text-muted/10", text: "text-text-muted", defaultLabel: "Offline" },
    idle:      { dot: "bg-warning",  bg: "bg-warning/10", text: "text-warning",  defaultLabel: "Idle" },
    error:     { dot: "bg-danger",   bg: "bg-danger/10",  text: "text-danger",   defaultLabel: "Error" },
    running:   { dot: "bg-primary",  bg: "bg-primary/10", text: "text-primary",  defaultLabel: "Running" },
    pending:   { dot: "bg-warning",  bg: "bg-warning/10", text: "text-warning",  defaultLabel: "Pending" },
    completed: { dot: "bg-success",  bg: "bg-success/10", text: "text-success",  defaultLabel: "Completed" },
  };

  const c = config[status] ?? config.offline;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";
  const dotSize = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${c.bg} ${c.text} ${sizeClasses}`}
      role="status"
      aria-label={`Status: ${label ?? c.defaultLabel}`}
    >
      <span
        className={`${dotSize} rounded-full ${c.dot} ${
          status === "online" || status === "running" ? "animate-pulse" : ""
        }`}
      />
      {label ?? c.defaultLabel}
    </span>
  );
}
