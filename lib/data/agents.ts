import { Agent, Task } from '../types';

export const agents: Agent[] = [
  {
    id: 'ula',
    name: 'Ula',
    role: '小秘書 / PM',
    status: 'online',
    model: 'Claude Haiku 4.5',
    tasksToday: 45,
    avgResponse: 320,
    successRate: 99.2,
    color: '#00D9FF',
    region: [-0.55, 0.3, 0.2],
  },
  {
    id: '0xcat',
    name: '0xcat',
    role: '全端工程師',
    status: 'online',
    model: 'Claude Opus 4.6',
    tasksToday: 12,
    avgResponse: 1850,
    successRate: 97.8,
    color: '#00E676',
    region: [0.0, 0.55, -0.1],
  },
  {
    id: 'kawa',
    name: 'Kawa',
    role: '工程師',
    status: 'idle',
    model: 'Kimi K2.5',
    tasksToday: 8,
    avgResponse: 920,
    successRate: 95.5,
    color: '#FFB800',
    region: [0.55, 0.2, 0.3],
  },
];

export const tasks: Task[] = [
  { id: 'TASK-001', title: 'Telegram 模型選擇器', agentId: 'ula', status: 'completed', progress: 100 },
  { id: 'TASK-002', title: 'AI Dashboard 前端', agentId: '0xcat', status: 'running', progress: 65 },
  { id: 'TASK-003', title: 'API 效能優化', agentId: 'kawa', status: 'running', progress: 40 },
  { id: 'TASK-004', title: '資安掃描模組', agentId: '0xcat', status: 'pending', progress: 0 },
  { id: 'TASK-005', title: '晨報自動生成', agentId: 'ula', status: 'completed', progress: 100 },
  { id: 'TASK-006', title: '員工心聲功能', agentId: '0xcat', status: 'pending', progress: 0 },
  { id: 'TASK-007', title: '群組訊息路由', agentId: 'kawa', status: 'completed', progress: 100 },
  { id: 'TASK-008', title: '成本分析圖表', agentId: '0xcat', status: 'pending', progress: 0 },
  { id: 'TASK-009', title: '使用者文檔更新', agentId: 'ula', status: 'completed', progress: 100 },
  { id: 'TASK-010', title: 'WebSocket 即時更新', agentId: 'kawa', status: 'error', progress: 30 },
];

export const STATUS_COLORS: Record<string, string> = {
  running: '#00D9FF',
  completed: '#00E676',
  pending: '#FFB800',
  error: '#FF3366',
};
