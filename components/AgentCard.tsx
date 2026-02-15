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

const AGENT_GLOW: Record<string, string> = {
  Ula: "rgba(0,240,255,0.15)",
  "0xcat": "rgba(0,230,118,0.15)",
  Kawa: "rgba(255,184,0,0.15)",
};

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
  const glowColor = AGENT_GLOW[name] ?? "rgba(0,240,255,0.15)";

  return (
    <button
      onClick={onClick}
      className="glass p-5 w-full text-left transition-all duration-200
        hud-corners hud-corners-bottom
        hover:border-primary/30 focus-visible:outline-2
        focus-visible:outline-primary focus-visible:outline-offset-2 cursor-pointer"
      style={{ borderRadius: "2px" }}
      aria-label={`Agent ${name}, status ${status}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 bg-primary/10 border border-primary/20
            flex items-center justify-center text-primary font-display font-bold text-[11px] shrink-0"
          style={{ borderRadius: "2px", boxShadow: `0 0 12px ${glowColor}` }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-text-primary font-display font-bold text-[11px] uppercase tracking-wider truncate">{name}</h3>
          {role && (
            <p className="text-text-muted text-[9px] font-mono truncate uppercase tracking-wider">{role}</p>
          )}
        </div>
        <StatusBadge status={status} size="sm" />
      </div>

      {/* Model */}
      <div className="flex items-center gap-1.5 mb-4 text-[9px] text-text-muted font-mono">
        <Cpu size={11} />
        <span className="truncate uppercase tracking-wider">{model}</span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="flex items-center gap-1 text-text-muted mb-1">
            <Zap size={10} />
            <span className="text-[8px] uppercase tracking-[0.15em] font-display">Tasks</span>
          </div>
          <p className="text-primary font-display font-bold text-lg text-glow">{tasksToday}</p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-text-muted mb-1">
            <Clock size={10} />
            <span className="text-[8px] uppercase tracking-[0.15em] font-display">Avg</span>
          </div>
          <p className="text-primary font-display font-bold text-lg text-glow">{avgResponse}<span className="text-[9px] text-text-muted font-mono">ms</span></p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-text-muted mb-1">
            <CheckCircle2 size={10} />
            <span className="text-[8px] uppercase tracking-[0.15em] font-display">Rate</span>
          </div>
          <p className="text-primary font-display font-bold text-lg text-glow">{successRate}<span className="text-[9px] text-text-muted font-mono">%</span></p>
        </div>
      </div>

      {/* Last Active */}
      {lastActive && (
        <p className="mt-3 pt-3 border-t border-border text-[9px] text-text-muted font-mono uppercase tracking-wider">
          Last active: {lastActive}
        </p>
      )}
    </button>
  );
}
