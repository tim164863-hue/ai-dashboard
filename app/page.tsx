"use client";

import dynamic from "next/dynamic";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Grid } from "@/components/Grid";
import { KPICard } from "@/components/KPICard";
import { StatusIndicator } from "@/components/StatusIndicator";
import { AgentCard } from "@/components/AgentCard";
import { useAgents, useTasks, useSystemStatus, useWeeklyChart, useTokenDistribution } from "@/lib/hooks";
import { Users, ListTodo, Clock, HeartPulse } from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardChart = dynamic(() => import("@/components/DashboardChart").then(m => ({ default: m.DashboardChart })), {
  loading: () => <div className="glass p-5 h-[300px] animate-pulse" />,
  ssr: false,
});
const PieChartCard = dynamic(() => import("@/components/PieChartCard").then(m => ({ default: m.PieChartCard })), {
  loading: () => <div className="glass p-5 h-[280px] animate-pulse" />,
  ssr: false,
});
const BrainVisualization = dynamic(() => import("@/components/BrainVisualization").then(m => ({ default: m.BrainVisualization })), {
  loading: () => (
    <div className="w-full h-[520px] border border-border animate-pulse bg-surface hud-corners hud-corners-bottom" style={{ borderRadius: "2px" }}>
      <div className="absolute top-4 left-5">
        <div className="text-[10px] font-display font-bold text-primary/30 tracking-[0.3em] uppercase">Loading Neural Visualizer...</div>
      </div>
    </div>
  ),
  ssr: false,
});

export default function Dashboard() {
  const router = useRouter();
  const { data: agents } = useAgents();
  const { data: taskList } = useTasks();
  const { data: statuses } = useSystemStatus();
  const { data: chartData } = useWeeklyChart();
  const { data: tokenDist } = useTokenDistribution();

  const agentList = agents ?? [];
  const allTasks = taskList ?? [];
  const totalTasks = agentList.reduce((s, a) => s + a.tasksToday, 0);
  const avgResponse = agentList.length
    ? Math.round(agentList.reduce((s, a) => s + a.avgResponse, 0) / agentList.length)
    : 0;
  const avgSuccess = agentList.length
    ? +(agentList.reduce((s, a) => s + a.successRate, 0) / agentList.length).toFixed(1)
    : 0;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main id="main-content" className="flex-1 ml-0 lg:ml-56 p-6 pt-16 lg:pt-8 lg:p-8">
        {/* Ambient glow background */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/3 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <Header
            title="AI Team Dashboard"
            subtitle="SYS_MONITOR // REAL-TIME ANALYTICS // OPENCLAW_CORE"
          />

          {/* KPI Cards */}
          <Grid cols={4} gap="md">
            <KPICard title="Active Agents" value={agentList.filter(a => a.status !== "offline").length} unit="agents" trend="up" trendValue="+1 today" icon={<Users size={20} />} />
            <KPICard title="Tasks Today" value={totalTasks} unit="tasks" trend="up" trendValue="+15%" icon={<ListTodo size={20} />} />
            <KPICard title="Avg Response" value={avgResponse} unit="ms" trend="down" trendValue="-12%" icon={<Clock size={20} />} />
            <KPICard title="Avg Success" value={avgSuccess} unit="%" trend="neutral" trendValue="Stable" icon={<HeartPulse size={20} />} />
          </Grid>

          {/* System Status */}
          <div className="mt-8 glass p-5 hud-corners">
            <h2 className="text-[10px] font-display font-bold text-primary mb-4 flex items-center gap-2 tracking-[0.2em] uppercase">
              <span className="w-1.5 h-1.5 bg-primary animate-pulse" style={{ boxShadow: "0 0 6px #00F0FF" }} aria-hidden="true" />
              System Status
            </h2>
            <Grid cols={4} gap="md">
              {(statuses ?? []).map((s) => (
                <StatusIndicator key={s.name} status={s.status} label={s.name} />
              ))}
            </Grid>
          </div>

          {/* Brain Visualization */}
          {agentList.length > 0 && (
            <div className="mt-8 hidden md:block">
              <BrainVisualization agents={agentList} tasks={allTasks} />
            </div>
          )}

          {/* Agent Overview */}
          <div className="mt-8">
            <h2 className="text-[10px] font-display font-bold text-primary mb-4 tracking-[0.2em] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-secondary" style={{ boxShadow: "0 0 6px #FF2D6B" }} aria-hidden="true" />
              Agent Overview
            </h2>
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
          </div>

          {/* Charts */}
          <div className="mt-8 mb-4">
            <h2 className="text-[10px] font-display font-bold text-primary mb-4 tracking-[0.2em] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent" style={{ boxShadow: "0 0 6px #FCEE09" }} aria-hidden="true" />
              Analytics
            </h2>
          </div>
          <Grid cols={3} gap="md">
            <DashboardChart
              title="Weekly Task Volume"
              type="line"
              data={chartData ?? []}
              dataKeys={["tasks"]}
            />
            <DashboardChart
              title="Tasks by Agent"
              type="bar"
              data={chartData ?? []}
              dataKeys={["ula", "0xcat", "kawa"]}
              colors={["#00F0FF", "#00E676", "#FFB800"]}
            />
            <PieChartCard
              title="Token Distribution"
              data={tokenDist ?? []}
              unit="tokens"
            />
          </Grid>
        </div>
      </main>
    </div>
  );
}
