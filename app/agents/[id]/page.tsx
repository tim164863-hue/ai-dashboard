"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Grid } from "@/components/Grid";
import { KPICard } from "@/components/KPICard";
import { StatusBadge } from "@/components/StatusBadge";
import { TaskRow } from "@/components/TaskRow";
import { useAgent, useAgentTasks, useAgentMetrics } from "@/lib/hooks";
import {
  ArrowLeft,
  Cpu,
  Zap,
  Clock,
  CheckCircle2,
  TrendingUp,
  Coins,
  FileText,
} from "lucide-react";

const AreaChartCard = dynamic(() => import("@/components/AreaChartCard").then(m => ({ default: m.AreaChartCard })), {
  loading: () => <div className="glass p-5 h-[280px] animate-pulse" />,
  ssr: false,
});
const DashboardChart = dynamic(() => import("@/components/DashboardChart").then(m => ({ default: m.DashboardChart })), {
  loading: () => <div className="glass p-5 h-[300px] animate-pulse" />,
  ssr: false,
});

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params.id as string;

  const { data: agent, loading: agentLoading } = useAgent(agentId);
  const { data: agentTasks } = useAgentTasks(agentId);
  const { data: metrics } = useAgentMetrics(agentId);

  if (agentLoading || !agent) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-0 lg:ml-56 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-text-muted text-sm">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  const recentTasks = (agentTasks ?? []).slice(0, 5);
  const completedTasks = (agentTasks ?? []).filter((t) => t.status === "completed").length;
  const runningTasks = (agentTasks ?? []).filter((t) => t.status === "running").length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main id="main-content" className="flex-1 ml-0 lg:ml-56 p-6 pt-16 lg:pt-8 lg:p-8">
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Back + Header */}
          <Link
            href="/agents"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors duration-200 mb-4"
          >
            <ArrowLeft size={14} />
            Back to Agents
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl shrink-0">
              {agent.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-text-primary">{agent.name}</h1>
                <StatusBadge status={agent.status} />
              </div>
              <p className="text-text-muted text-sm mt-0.5">{agent.role} — {agent.description}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted bg-surface-elevated px-3 py-1.5 rounded-lg border border-border">
              <Cpu size={12} />
              <span className="font-mono">{agent.model}</span>
            </div>
          </div>

          {/* KPI Row */}
          <Grid cols={4} gap="md">
            <KPICard
              title="Tasks Today"
              value={agent.tasksToday}
              unit="tasks"
              icon={<Zap size={18} />}
            />
            <KPICard
              title="Avg Response"
              value={agent.avgResponse}
              unit="ms"
              trend={agent.avgResponse < 1000 ? "down" : "neutral"}
              trendValue={agent.avgResponse < 1000 ? "Fast" : "Normal"}
              icon={<Clock size={18} />}
            />
            <KPICard
              title="Success Rate"
              value={agent.successRate}
              unit="%"
              trend={agent.successRate > 98 ? "up" : "neutral"}
              trendValue={agent.successRate > 98 ? "Excellent" : "Good"}
              icon={<CheckCircle2 size={18} />}
            />
            <KPICard
              title="Cost Today"
              value={`$${agent.costToday.toFixed(2)}`}
              trend="neutral"
              trendValue={agent.costToday === 0 ? "Free tier" : "Active"}
              icon={<Coins size={18} />}
            />
          </Grid>

          {/* Token Stats */}
          <div className="mt-6 glass p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <FileText size={14} className="text-primary" />
              Token Usage Today
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Input Tokens</p>
                <p className="text-xl font-bold text-text-primary font-mono">
                  {(agent.tokensToday.input / 1000).toFixed(0)}K
                </p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Output Tokens</p>
                <p className="text-xl font-bold text-text-primary font-mono">
                  {(agent.tokensToday.output / 1000).toFixed(0)}K
                </p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Total</p>
                <p className="text-xl font-bold text-primary font-mono">
                  {((agent.tokensToday.input + agent.tokensToday.output) / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
            {/* Token bar */}
            <div className="mt-3 h-2 bg-surface-elevated rounded-full overflow-hidden flex">
              <div
                className="bg-primary h-full transition-all duration-500"
                style={{
                  width: `${(agent.tokensToday.input / (agent.tokensToday.input + agent.tokensToday.output)) * 100}%`,
                }}
                role="progressbar"
                aria-label="Input token ratio"
                aria-valuenow={agent.tokensToday.input}
                aria-valuemin={0}
                aria-valuemax={agent.tokensToday.input + agent.tokensToday.output}
              />
              <div className="bg-success h-full flex-1" />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-text-muted">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> Input</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success inline-block" /> Output</span>
            </div>
          </div>

          {/* Charts */}
          {metrics && metrics.length > 0 && (
            <Grid cols={2} gap="md" className="mt-6">
              <AreaChartCard
                title="Task Volume (7 days)"
                data={metrics}
                dataKey="tasks"
                xKey="date"
                color="#00D9FF"
                gradientId={`area-tasks-${agentId}`}
              />
              <DashboardChart
                title="Response Time (7 days)"
                type="bar"
                data={metrics.map((m) => ({ name: m.date, responseTime: m.responseTime }))}
                dataKeys={["responseTime"]}
                colors={["#818CF8"]}
              />
            </Grid>
          )}

          {/* Additional Stats */}
          <div className="mt-6 glass p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <TrendingUp size={14} className="text-primary" />
                Lifetime Stats
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Total Tasks</p>
                <p className="text-lg font-bold text-text-primary font-mono">{agent.totalTasks.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Uptime</p>
                <p className="text-lg font-bold text-success font-mono">{agent.uptime}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Running</p>
                <p className="text-lg font-bold text-primary font-mono">{runningTasks}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Completed</p>
                <p className="text-lg font-bold text-text-primary font-mono">{completedTasks}</p>
              </div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-text-primary">Recent Tasks</h2>
              <Link
                href="/tasks"
                className="text-xs text-primary hover:text-primary/80 transition-colors duration-200"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-2">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => <TaskRow key={task.id} {...task} />)
              ) : (
                <div className="glass p-6 text-center text-text-muted text-sm">
                  No tasks found for this agent.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
