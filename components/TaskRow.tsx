import { StatusBadge } from "./StatusBadge";
import { Clock, User } from "lucide-react";

interface TaskRowProps {
  id: string;
  title: string;
  agent: string;
  status: "running" | "pending" | "completed" | "error";
  progress: number;
  duration?: string;
  startTime?: string;
}

export function TaskRow({
  id,
  title,
  agent,
  status,
  progress,
  duration,
  startTime,
}: TaskRowProps) {
  const progressColor =
    status === "completed"
      ? "bg-success"
      : status === "error"
      ? "bg-danger"
      : "bg-primary";

  return (
    <div
      className="glass px-4 py-3 flex items-center gap-4 transition-all duration-200
        hover:border-primary/20"
      role="row"
      aria-label={`Task ${id}: ${title}, status ${status}`}
    >
      {/* Task ID */}
      <span className="text-xs font-mono text-text-muted w-20 shrink-0">{id}</span>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary font-medium truncate">{title}</p>
        {startTime && (
          <p className="text-[11px] text-text-muted mt-0.5">{startTime}</p>
        )}
      </div>

      {/* Agent */}
      <div className="flex items-center gap-1.5 text-xs text-text-secondary w-24 shrink-0">
        <User size={12} />
        <span className="truncate">{agent}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-32 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-text-muted font-mono">{progress}%</span>
        </div>
        <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Duration */}
      <div className="flex items-center gap-1 text-xs text-text-muted w-20 shrink-0">
        <Clock size={12} />
        <span className="font-mono">{duration ?? "—"}</span>
      </div>

      {/* Status */}
      <div className="w-24 shrink-0 flex justify-end">
        <StatusBadge status={status} size="sm" />
      </div>
    </div>
  );
}
