"use client";

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface DashboardChartProps {
  title: string;
  type: "line" | "bar";
  data: ChartData[];
  dataKeys: string[];
  colors?: string[];
}

export function DashboardChart({
  title,
  type,
  data,
  dataKeys,
  colors = ["#00D9FF", "#00E676", "#FF3366"],
}: DashboardChartProps) {
  return (
    <div className="glass p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        {type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3A" />
            <XAxis dataKey="name" stroke="#6B6B80" fontSize={11} />
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
            <Legend wrapperStyle={{ fontSize: "11px", color: "#A0A0B0" }} />
            {dataKeys.map((key, idx) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[idx % colors.length]}
                strokeWidth={2}
                dot={{ r: 3, fill: colors[idx % colors.length] }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3A" />
            <XAxis dataKey="name" stroke="#6B6B80" fontSize={11} />
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
            <Legend wrapperStyle={{ fontSize: "11px", color: "#A0A0B0" }} />
            {dataKeys.map((key, idx) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[idx % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
