"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface PieChartCardProps {
  title: string;
  data: { name: string; value: number }[];
  colors?: string[];
  height?: number;
  unit?: string;
}

const DEFAULT_COLORS = ["#00D9FF", "#00E676", "#FFB800", "#FF3366", "#818CF8"];

export function PieChartCard({
  title,
  data,
  colors = DEFAULT_COLORS,
  height = 220,
  unit,
}: PieChartCardProps) {
  return (
    <div className="glass p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={colors[idx % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1A25",
              border: "1px solid #2A2A3A",
              borderRadius: "8px",
              color: "#FFFFFF",
              fontSize: "12px",
            }}
            formatter={(value: number) =>
              unit ? `${value.toLocaleString()} ${unit}` : value.toLocaleString()
            }
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", color: "#A0A0B0" }}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
