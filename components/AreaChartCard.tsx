"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface AreaChartCardProps {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  dataKey: string;
  xKey?: string;
  color?: string;
  gradientId?: string;
  height?: number;
}

export function AreaChartCard({
  title,
  data,
  dataKey,
  xKey = "date",
  color = "#00D9FF",
  gradientId = "areaGrad",
  height = 220,
}: AreaChartCardProps) {
  return (
    <div className="glass p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3A" />
          <XAxis dataKey={xKey} stroke="#6B6B80" fontSize={11} />
          <YAxis stroke="#6B6B80" fontSize={11} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1A25",
              border: "1px solid #2A2A3A",
              borderRadius: "8px",
              color: "#FFFFFF",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
