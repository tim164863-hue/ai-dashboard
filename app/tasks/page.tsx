"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { TaskRow } from "@/components/TaskRow";
import { StatusBadge } from "@/components/StatusBadge";
import { Filter } from "lucide-react";

type TaskStatus = "running" | "pending" | "completed" | "error";
type FilterType = "all" | TaskStatus;

const tasks = [
  { id: "TASK-001", title: "Telegram 模型選擇器開發", agent: "Ula", status: "completed" as const, progress: 100, duration: "2h 15m", startTime: "2026-02-14 13:08" },
  { id: "TASK-002", title: "AI Dashboard 前端建置", agent: "0xcat", status: "running" as const, progress: 65, duration: "1h 30m", startTime: "2026-02-14 18:25" },
  { id: "TASK-003", title: "API 效能優化", agent: "Kawa", status: "running" as const, progress: 40, duration: "45m", startTime: "2026-02-14 19:00" },
  { id: "TASK-004", title: "資安掃描模組", agent: "0xcat", status: "pending" as const, progress: 0, startTime: "2026-02-14 19:55" },
  { id: "TASK-005", title: "晨報自動生成", agent: "Ula", status: "completed" as const, progress: 100, duration: "5m 42s", startTime: "2026-02-14 08:00" },
  { id: "TASK-006", title: "員工心聲功能", agent: "0xcat", status: "pending" as const, progress: 0, startTime: "2026-02-14 20:00" },
  { id: "TASK-007", title: "群組訊息路由", agent: "Kawa", status: "completed" as const, progress: 100, duration: "1h 10m", startTime: "2026-02-14 10:30" },
  { id: "TASK-008", title: "成本分析圖表", agent: "0xcat", status: "pending" as const, progress: 0, startTime: "2026-02-15 09:00" },
  { id: "TASK-009", title: "使用者文檔更新", agent: "Ula", status: "completed" as const, progress: 100, duration: "25m", startTime: "2026-02-14 14:00" },
  { id: "TASK-010", title: "WebSocket 即時更新", agent: "Kawa", status: "error" as const, progress: 30, duration: "20m", startTime: "2026-02-14 16:00" },
];

export default function TasksPage() {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredTasks = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const counts = {
    all: tasks.length,
    running: tasks.filter((t) => t.status === "running").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    error: tasks.filter((t) => t.status === "error").length,
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "running", label: "Running" },
    { key: "pending", label: "Pending" },
    { key: "completed", label: "Completed" },
    { key: "error", label: "Error" },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-56 p-8">
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <Header
            title="Tasks"
            subtitle="Monitor task queue and execution status"
          />

          {/* Summary */}
          <div className="glass p-5 mb-6">
            <div className="flex items-center gap-6">
              <span className="text-xs text-text-muted">Total: <span className="text-text-primary font-mono font-semibold">{counts.all}</span></span>
              <StatusBadge status="running" label={`${counts.running} Running`} size="sm" />
              <StatusBadge status="pending" label={`${counts.pending} Pending`} size="sm" />
              <StatusBadge status="completed" label={`${counts.completed} Completed`} size="sm" />
              {counts.error > 0 && <StatusBadge status="error" label={`${counts.error} Error`} size="sm" />}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-4">
            <Filter size={14} className="text-text-muted" />
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                  ${
                    filter === f.key
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-text-muted hover:text-text-secondary hover:bg-surface-elevated border border-transparent"
                  }`}
                aria-pressed={filter === f.key}
              >
                {f.label} ({counts[f.key]})
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="space-y-2" role="table" aria-label="Task list">
            {/* Table Header */}
            <div className="flex items-center gap-4 px-4 py-2 text-[10px] text-text-muted uppercase tracking-wider font-medium">
              <span className="w-20">ID</span>
              <span className="flex-1">Task</span>
              <span className="w-24">Agent</span>
              <span className="w-32">Progress</span>
              <span className="w-20">Duration</span>
              <span className="w-24 text-right">Status</span>
            </div>

            {filteredTasks.map((task) => (
              <TaskRow key={task.id} {...task} />
            ))}

            {filteredTasks.length === 0 && (
              <div className="glass p-8 text-center text-text-muted text-sm">
                No tasks match the current filter.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
