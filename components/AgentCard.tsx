import { StatusBadge } from "./StatusBadge";
import { Cpu, Zap, CheckCircle2, Clock } from "lucide-react";

interface AgentCardProps {
  name: string;
  role?: string;
  status: "online" | "offline" | "idle";
  model: string;
  tasksToday: number;
  avgResponse: number;
  successRate: number;
  lastActive?: string;
  onClick?: () => void;
}

export function AgentCard({
  name,
  role,
  status,
  model,
  tasksToday,
  avgResponse,
  successRate,
  lastActive,
  onClick,
}: AgentCardProps) {
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <button
      onClick={onClick}
      className="glass p-5 w-full text-left transition-all duration-200
        hover:border-primary/30 hover:shadow-glow-sm focus-visible:outline-2
        focus-visible:outline-primary focus-visible:outline-offset-2 cursor-pointer"
      aria-label={`Agent ${name}, status ${status}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20
          flex items-center justify-center text-primary font-semibold text-sm shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-text-primary font-semibold text-sm truncate">{name}</h3>
          {role && (
            <p className="text-text-muted text-xs truncate">{role}</p>
          )}
        </div>
        <StatusBadge status={status} size="sm" />
      </div>

      {/* Model */}
      <div className="flex items-center gap-1.5 mb-4 text-xs text-text-muted">
        <Cpu size={12} />
        <span className="truncate">{model}</span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="flex items-center gap-1 text-text-muted mb-1">
            <Zap size={11} />
            <span className="text-[10px] uppercase tracking-wider">Tasks</span>
          </div>
          <p className="text-text-primary font-semibold text-lg font-mono">{tasksToday}</p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-text-muted mb-1">
            <Clock size={11} />
            <span className="text-[10px] uppercase tracking-wider">Avg</span>
          </div>
          <p className="text-text-primary font-semibold text-lg font-mono">{avgResponse}<span className="text-xs text-text-muted">ms</span></p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-text-muted mb-1">
            <CheckCircle2 size={11} />
            <span className="text-[10px] uppercase tracking-wider">Rate</span>
          </div>
          <p className="text-text-primary font-semibold text-lg font-mono">{successRate}<span className="text-xs text-text-muted">%</span></p>
        </div>
      </div>

      {/* Last Active */}
      {lastActive && (
        <p className="mt-3 pt-3 border-t border-border text-[11px] text-text-muted">
          Last active: {lastActive}
        </p>
      )}
    </button>
  );
}
