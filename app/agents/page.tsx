"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Grid } from "@/components/Grid";
import { AgentCard } from "@/components/AgentCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useAgents } from "@/lib/hooks";
import { Cpu, Zap, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AgentsPage() {
  const router = useRouter();
  const { data: agents } = useAgents();
  const agentList = agents ?? [];

  const onlineCount = agentList.filter((a) => a.status === "online").length;
  const idleCount = agentList.filter((a) => a.status === "idle").length;
  const offlineCount = agentList.filter((a) => a.status === "offline").length;
  const totalTasksToday = agentList.reduce((s, a) => s + a.tasksToday, 0);
  const avgSuccess = agentList.length
    ? +(agentList.reduce((s, a) => s + a.successRate, 0) / agentList.length).toFixed(1)
    : 0;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main id="main-content" className="flex-1 ml-0 lg:ml-56 p-6 pt-16 lg:pt-8 lg:p-8">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status="online" label={`${onlineCount} Online`} />
                <StatusBadge status="idle" label={`${idleCount} Idle`} />
                <StatusBadge status="offline" label={`${offlineCount} Offline`} />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1"><Cpu size={12} /> {agentList.length} Models Active</span>
                <span className="flex items-center gap-1"><Zap size={12} /> {totalTasksToday} Tasks Today</span>
                <span className="flex items-center gap-1"><TrendingUp size={12} /> {avgSuccess}% Avg Success</span>
              </div>
            </div>
          </div>

          {/* Agent Cards */}
          <Grid cols={3} gap="md">
            {agentList.map((agent) => (
              <AgentCard
                key={agent.id}
                name={agent.name}
                role={agent.role}
                status={agent.status}
                model={agent.model}
                tasksToday={agent.tasksToday}
                avgResponse={agent.avgResponse}
                successRate={agent.successRate}
                lastActive={agent.lastActive}
                onClick={() => router.push(`/agents/${agent.id}`)}
              />
            ))}
          </Grid>

          {/* Agent Details Table */}
          <div className="mt-8 glass p-5 overflow-x-auto">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Agent Details</h2>
            <table className="w-full text-sm min-w-[600px]" role="table">
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
                {agentList.map((agent) => (
                  <tr
                    key={agent.id}
                    className="border-b border-border/50 hover:bg-surface-elevated/50 transition-colors duration-200 cursor-pointer"
                    onClick={() => router.push(`/agents/${agent.id}`)}
                  >
                    <td className="py-3 px-4">
                      <p className="text-text-primary font-medium">{agent.name}</p>
                      <p className="text-text-muted text-xs">{agent.role}</p>
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
      </main>
    </div>
  );
}
