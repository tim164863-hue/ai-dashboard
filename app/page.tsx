"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Grid } from "@/components/Grid";
import { KPICard } from "@/components/KPICard";
import { StatusIndicator } from "@/components/StatusIndicator";
import { DashboardChart } from "@/components/DashboardChart";
import { AgentCard } from "@/components/AgentCard";
import { Users, ListTodo, Clock, HeartPulse } from "lucide-react";

export default function Dashboard() {
  const kpiData = [
    { title: "Active Agents", value: 3, unit: "agents", trend: "up" as const, trendValue: "+1 today", icon: <Users size={20} /> },
    { title: "Tasks Completed", value: 1240, unit: "tasks", trend: "up" as const, trendValue: "+15%", icon: <ListTodo size={20} /> },
    { title: "Avg Response", value: 245, unit: "ms", trend: "down" as const, trendValue: "-12%", icon: <Clock size={20} /> },
    { title: "System Health", value: 98.5, unit: "%", trend: "neutral" as const, trendValue: "Stable", icon: <HeartPulse size={20} /> },
  ];

  const agents = [
    { name: "Ula", role: "小秘書 / PM", status: "online" as const, model: "Claude Haiku 4.5", tasksToday: 45, avgResponse: 320, successRate: 99.2, lastActive: "2 min ago" },
    { name: "0xcat", role: "全端工程師", status: "online" as const, model: "Claude Opus 4.6", tasksToday: 12, avgResponse: 1850, successRate: 97.8, lastActive: "Just now" },
    { name: "Kawa", role: "工程師", status: "idle" as const, model: "Kimi K2.5", tasksToday: 8, avgResponse: 920, successRate: 95.5, lastActive: "15 min ago" },
  ];

  const chartData = [
    { name: "Mon", tasks: 120, agents: 8, errors: 2 },
    { name: "Tue", tasks: 150, agents: 10, errors: 1 },
    { name: "Wed", tasks: 180, agents: 12, errors: 3 },
    { name: "Thu", tasks: 160, agents: 11, errors: 2 },
    { name: "Fri", tasks: 200, agents: 12, errors: 1 },
    { name: "Sat", tasks: 90, agents: 6, errors: 0 },
    { name: "Sun", tasks: 110, agents: 7, errors: 1 },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-56 p-8">
        {/* Background Glow */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/3 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <Header
            title="AI Team Dashboard"
            subtitle="Real-time monitoring and analytics for your AI operations"
          />

          {/* KPI Cards */}
          <Grid cols={4} gap="md">
            {kpiData.map((kpi, idx) => (
              <KPICard
                key={idx}
                title={kpi.title}
                value={kpi.value}
                unit={kpi.unit}
                trend={kpi.trend}
                trendValue={kpi.trendValue}
                icon={kpi.icon}
              />
            ))}
          </Grid>

          {/* System Status */}
          <div className="mt-8 glass p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              System Status
            </h2>
            <Grid cols={4} gap="md">
              <StatusIndicator status="online" label="API Server" />
              <StatusIndicator status="online" label="Database" />
              <StatusIndicator status="idle" label="Background Jobs" />
              <StatusIndicator status="online" label="Cache Layer" />
            </Grid>
          </div>

          {/* Agent Cards */}
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Agent Overview</h2>
            <Grid cols={3} gap="md">
              {agents.map((agent) => (
                <AgentCard key={agent.name} {...agent} />
              ))}
            </Grid>
          </div>

          {/* Charts */}
          <Grid cols={2} gap="md" className="mt-8">
            <DashboardChart
              title="Weekly Task Volume"
              type="line"
              data={chartData}
              dataKeys={["tasks"]}
            />
            <DashboardChart
              title="Agent Activity"
              type="bar"
              data={chartData}
              dataKeys={["agents", "errors"]}
              colors={["#00D9FF", "#FF3366"]}
            />
          </Grid>
        </div>
      </main>
    </div>
  );
}
