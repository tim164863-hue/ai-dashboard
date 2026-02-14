"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { TaskRow } from "@/components/TaskRow";
import { StatusBadge } from "@/components/StatusBadge";
import { useTasks } from "@/lib/hooks";
import { Filter } from "lucide-react";

type TaskStatus = "running" | "pending" | "completed" | "error";
type FilterType = "all" | TaskStatus;

export default function TasksPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const { data: taskList } = useTasks();
  const allTasks = taskList ?? [];

  const filteredTasks = filter === "all" ? allTasks : allTasks.filter((t) => t.status === filter);

  const counts: Record<FilterType, number> = {
    all: allTasks.length,
    running: allTasks.filter((t) => t.status === "running").length,
    pending: allTasks.filter((t) => t.status === "pending").length,
    completed: allTasks.filter((t) => t.status === "completed").length,
    error: allTasks.filter((t) => t.status === "error").length,
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

      <main id="main-content" className="flex-1 ml-0 lg:ml-56 p-6 pt-16 lg:pt-8 lg:p-8">
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
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-xs text-text-muted">
                Total: <span className="text-text-primary font-mono font-semibold">{counts.all}</span>
              </span>
              <StatusBadge status="running" label={`${counts.running} Running`} size="sm" />
              <StatusBadge status="pending" label={`${counts.pending} Pending`} size="sm" />
              <StatusBadge status="completed" label={`${counts.completed} Completed`} size="sm" />
              {counts.error > 0 && <StatusBadge status="error" label={`${counts.error} Error`} size="sm" />}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
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

          {/* Task List — desktop table header */}
          <div className="space-y-2" role="table" aria-label="Task list">
            <div className="hidden md:flex items-center gap-4 px-4 py-2 text-[10px] text-text-muted uppercase tracking-wider font-medium">
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
