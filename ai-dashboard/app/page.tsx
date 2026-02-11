"use client";

import { Header } from "@/components/Header";
import { Grid } from "@/components/Grid";
import { KPICard } from "@/components/KPICard";
import { StatusIndicator } from "@/components/StatusIndicator";
import { DashboardChart } from "@/components/DashboardChart";

export default function Dashboard() {
  // Mock data
  const kpiData = [
    { title: "Active Agents", value: 12, unit: "agents", trend: "up" as const, trendValue: "+2 this week", color: "primary" as const },
    { title: "Tasks Completed", value: 1240, unit: "tasks", trend: "up" as const, trendValue: "+15%", color: "cta" as const },
    { title: "Avg Response Time", value: 245, unit: "ms", trend: "down" as const, trendValue: "-12%", color: "secondary" as const },
    { title: "System Health", value: 98.5, unit: "%", trend: "neutral" as const, trendValue: "Stable", color: "primary" as const },
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
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
              color={kpi.color}
            />
          ))}
        </Grid>

        {/* Status Section */}
        <div className="mt-8 glass p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">System Status</h2>
          <Grid cols={2} gap="md">
            <StatusIndicator status="online" label="API Server" />
            <StatusIndicator status="online" label="Database" />
            <StatusIndicator status="idle" label="Background Jobs" />
            <StatusIndicator status="online" label="Cache Layer" />
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
            colors={["#6366F1", "#EF4444"]}
          />
        </Grid>
      </div>
    </main>
  );
}
