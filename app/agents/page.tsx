"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Grid } from "@/components/Grid";
import { AgentCard } from "@/components/AgentCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Cpu, Zap, TrendingUp } from "lucide-react";

const agents = [
  {
    name: "Ula",
    role: "小秘書 / PM",
    status: "online" as const,
    model: "Claude Haiku 4.5",
    tasksToday: 45,
    avgResponse: 320,
    successRate: 99.2,
    lastActive: "2 min ago",
    description: "負責任務分配、進度追蹤、日常溝通",
    totalTasks: 3420,
    uptime: "99.8%",
  },
  {
    name: "0xcat",
    role: "全端工程師",
    status: "online" as const,
    model: "Claude Opus 4.6",
    tasksToday: 12,
    avgResponse: 1850,
    successRate: 97.8,
    lastActive: "Just now",
    description: "負責程式開發、架構設計、技術決策",
    totalTasks: 890,
    uptime: "99.5%",
  },
  {
    name: "Kawa",
    role: "工程師",
    status: "idle" as const,
    model: "Kimi K2.5",
    tasksToday: 8,
    avgResponse: 920,
    successRate: 95.5,
    lastActive: "15 min ago",
    description: "負責輔助開發、測試、文檔撰寫",
    totalTasks: 560,
    uptime: "97.2%",
  },
];

export default function AgentsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-56 p-8">
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <Header
            title="Agents"
            subtitle="Monitor and manage your AI team members"
          />

          {/* Summary Stats */}
          <div className="glass p-5 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <StatusBadge status="online" label="2 Online" />
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status="idle" label="1 Idle" />
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status="offline" label="0 Offline" />
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1"><Cpu size={12} /> 3 Models Active</span>
                <span className="flex items-center gap-1"><Zap size={12} /> 65 Tasks Today</span>
                <span className="flex items-center gap-1"><TrendingUp size={12} /> 97.5% Avg Success</span>
              </div>
            </div>
          </div>

          {/* Agent Cards */}
          <Grid cols={3} gap="md">
            {agents.map((agent) => (
              <AgentCard
                key={agent.name}
                name={agent.name}
                role={agent.role}
                status={agent.status}
                model={agent.model}
                tasksToday={agent.tasksToday}
                avgResponse={agent.avgResponse}
                successRate={agent.successRate}
                lastActive={agent.lastActive}
              />
            ))}
          </Grid>

          {/* Agent Details Table */}
          <div className="mt-8 glass p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Agent Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs text-text-muted uppercase tracking-wider font-medium">Agent</th>
                    <th className="text-left py-3 px-4 text-xs text-text-muted uppercase tracking-wider font-medium">Model</th>
                    <th className="text-right py-3 px-4 text-xs text-text-muted uppercase tracking-wider font-medium">Total Tasks</th>
                    <th className="text-right py-3 px-4 text-xs text-text-muted uppercase tracking-wider font-medium">Uptime</th>
                    <th className="text-left py-3 px-4 text-xs text-text-muted uppercase tracking-wider font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <tr key={agent.name} className="border-b border-border/50 hover:bg-surface-elevated/50 transition-colors duration-200">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-text-primary font-medium">{agent.name}</p>
                          <p className="text-text-muted text-xs">{agent.role}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-text-secondary font-mono text-xs">{agent.model}</td>
                      <td className="py-3 px-4 text-right text-text-primary font-mono">{agent.totalTasks.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-success font-mono">{agent.uptime}</td>
                      <td className="py-3 px-4"><StatusBadge status={agent.status} size="sm" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
