"use client";

import { useState, useEffect, useCallback } from "react";
import {
  agents as mockAgents,
  tasks as mockTasks,
  systemStatuses as mockStatuses,
  weeklyChartData as mockChartData,
  tokenDistribution as mockTokenDist,
  costDistribution as mockCostDist,
  getAgent,
  getAgentTasks,
  getAgentMetrics,
  type Agent,
  type Task,
  type SystemStatus,
  type DailyMetric,
} from "./mock-data";

// Simulates async fetch — swap internals with real API later
function useFetch<T>(fetcher: () => T, refreshMs?: number) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    // Simulate network delay on first load only
    const result = fetcher();
    setData(result);
    setLoading(false);
  }, [fetcher]);

  useEffect(() => {
    load();
    if (refreshMs && refreshMs > 0) {
      const id = setInterval(load, refreshMs);
      return () => clearInterval(id);
    }
  }, [load, refreshMs]);

  return { data, loading, refresh: load };
}

// ── Public hooks ────────────────────────────────────

export function useAgents(refreshMs = 30000) {
  return useFetch<Agent[]>(() => mockAgents, refreshMs);
}

export function useAgent(id: string) {
  return useFetch<Agent | undefined>(() => getAgent(id), 0);
}

export function useAgentTasks(agentId: string, refreshMs = 15000) {
  return useFetch<Task[]>(() => getAgentTasks(agentId), refreshMs);
}

export function useAgentMetrics(agentId: string) {
  return useFetch<DailyMetric[]>(() => getAgentMetrics(agentId), 0);
}

export function useTasks(refreshMs = 15000) {
  return useFetch<Task[]>(() => mockTasks, refreshMs);
}

export function useSystemStatus(refreshMs = 30000) {
  return useFetch<SystemStatus[]>(() => mockStatuses, refreshMs);
}

export function useWeeklyChart() {
  return useFetch(() => mockChartData, 0);
}

export function useTokenDistribution() {
  return useFetch(() => mockTokenDist, 0);
}

export function useCostDistribution() {
  return useFetch(() => mockCostDist, 0);
}
