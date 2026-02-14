// Centralized mock data layer — swap with real API calls later

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: "online" | "idle" | "offline";
  model: string;
  tasksToday: number;
  avgResponse: number;
  successRate: number;
  lastActive: string;
  totalTasks: number;
  uptime: string;
  description: string;
  tokensToday: { input: number; output: number };
  costToday: number;
}

export interface Task {
  id: string;
  title: string;
  agent: string;
  agentId: string;
  status: "running" | "pending" | "completed" | "error";
  progress: number;
  duration?: string;
  startTime: string;
}

export interface DailyMetric {
  date: string;
  tasks: number;
  tokens: number;
  cost: number;
  responseTime: number;
  successRate: number;
}

export interface SystemStatus {
  name: string;
  status: "online" | "idle" | "offline" | "error";
}

// ── Agents ──────────────────────────────────────────

export const agents: Agent[] = [
  {
    id: "ula",
    name: "Ula",
    role: "小秘書 / PM",
    status: "online",
    model: "Claude Haiku 4.5",
    tasksToday: 45,
    avgResponse: 320,
    successRate: 99.2,
    lastActive: "2 min ago",
    totalTasks: 3420,
    uptime: "99.8%",
    description: "負責任務分配、進度追蹤、日常溝通",
    tokensToday: { input: 125000, output: 89000 },
    costToday: 0.42,
  },
  {
    id: "0xcat",
    name: "0xcat",
    role: "全端工程師",
    status: "online",
    model: "Claude Opus 4.6",
    tasksToday: 12,
    avgResponse: 1850,
    successRate: 97.8,
    lastActive: "Just now",
    totalTasks: 890,
    uptime: "99.5%",
    description: "負責程式開發、架構設計、技術決策",
    tokensToday: { input: 580000, output: 420000 },
    costToday: 8.72,
  },
  {
    id: "kawa",
    name: "Kawa",
    role: "工程師",
    status: "idle",
    model: "Kimi K2.5",
    tasksToday: 8,
    avgResponse: 920,
    successRate: 95.5,
    lastActive: "15 min ago",
    totalTasks: 560,
    uptime: "97.2%",
    description: "負責輔助開發、測試、文檔撰寫",
    tokensToday: { input: 210000, output: 145000 },
    costToday: 0,
  },
];

// ── Tasks ───────────────────────────────────────────

export const tasks: Task[] = [
  { id: "TASK-001", title: "Telegram 模型選擇器開發", agent: "Ula", agentId: "ula", status: "completed", progress: 100, duration: "2h 15m", startTime: "2026-02-14 13:08" },
  { id: "TASK-002", title: "AI Dashboard 前端建置", agent: "0xcat", agentId: "0xcat", status: "running", progress: 65, duration: "1h 30m", startTime: "2026-02-14 18:25" },
  { id: "TASK-003", title: "API 效能優化", agent: "Kawa", agentId: "kawa", status: "running", progress: 40, duration: "45m", startTime: "2026-02-14 19:00" },
  { id: "TASK-004", title: "資安掃描模組", agent: "0xcat", agentId: "0xcat", status: "pending", progress: 0, startTime: "2026-02-14 19:55" },
  { id: "TASK-005", title: "晨報自動生成", agent: "Ula", agentId: "ula", status: "completed", progress: 100, duration: "5m 42s", startTime: "2026-02-14 08:00" },
  { id: "TASK-006", title: "員工心聲功能", agent: "0xcat", agentId: "0xcat", status: "pending", progress: 0, startTime: "2026-02-14 20:00" },
  { id: "TASK-007", title: "群組訊息路由", agent: "Kawa", agentId: "kawa", status: "completed", progress: 100, duration: "1h 10m", startTime: "2026-02-14 10:30" },
  { id: "TASK-008", title: "成本分析圖表", agent: "0xcat", agentId: "0xcat", status: "pending", progress: 0, startTime: "2026-02-15 09:00" },
  { id: "TASK-009", title: "使用者文檔更新", agent: "Ula", agentId: "ula", status: "completed", progress: 100, duration: "25m", startTime: "2026-02-14 14:00" },
  { id: "TASK-010", title: "WebSocket 即時更新", agent: "Kawa", agentId: "kawa", status: "error", progress: 30, duration: "20m", startTime: "2026-02-14 16:00" },
];

// ── Daily Metrics (per agent, last 7 days) ──────────

function generateDailyMetrics(base: { tasks: number; tokens: number; cost: number; responseTime: number; successRate: number }): DailyMetric[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((date, i) => {
    const variance = 0.7 + Math.sin(i * 1.2) * 0.3 + (i % 3) * 0.1;
    return {
      date,
      tasks: Math.round(base.tasks * variance),
      tokens: Math.round(base.tokens * variance),
      cost: +(base.cost * variance).toFixed(2),
      responseTime: Math.round(base.responseTime * (0.8 + Math.random() * 0.4)),
      successRate: +(base.successRate - Math.random() * 3).toFixed(1),
    };
  });
}

export const agentMetrics: Record<string, DailyMetric[]> = {
  ula: generateDailyMetrics({ tasks: 45, tokens: 214000, cost: 0.42, responseTime: 320, successRate: 99.2 }),
  "0xcat": generateDailyMetrics({ tasks: 12, tokens: 1000000, cost: 8.72, responseTime: 1850, successRate: 97.8 }),
  kawa: generateDailyMetrics({ tasks: 8, tokens: 355000, cost: 0, responseTime: 920, successRate: 95.5 }),
};

// ── Aggregate chart data ────────────────────────────

export const weeklyChartData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((name, i) => ({
  name,
  tasks: (agentMetrics.ula[i]?.tasks ?? 0) + (agentMetrics["0xcat"][i]?.tasks ?? 0) + (agentMetrics.kawa[i]?.tasks ?? 0),
  ula: agentMetrics.ula[i]?.tasks ?? 0,
  "0xcat": agentMetrics["0xcat"][i]?.tasks ?? 0,
  kawa: agentMetrics.kawa[i]?.tasks ?? 0,
}));

export const tokenDistribution = agents.map((a) => ({
  name: a.name,
  value: a.tokensToday.input + a.tokensToday.output,
}));

export const costDistribution = agents.filter((a) => a.costToday > 0).map((a) => ({
  name: a.name,
  value: a.costToday,
}));

// ── System Status ───────────────────────────────────

export const systemStatuses: SystemStatus[] = [
  { name: "API Server", status: "online" },
  { name: "Database", status: "online" },
  { name: "Background Jobs", status: "idle" },
  { name: "Cache Layer", status: "online" },
];

// ── Helpers ─────────────────────────────────────────

export function getAgent(id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}

export function getAgentTasks(agentId: string): Task[] {
  return tasks.filter((t) => t.agentId === agentId);
}

export function getAgentMetrics(agentId: string): DailyMetric[] {
  return agentMetrics[agentId] ?? [];
}
