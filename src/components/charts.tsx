"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const COLORS = ["#2563eb", "#1f9d55", "#f97316", "#dc2626", "#7c3aed", "#0f766e"];

export function MasteryBarChart({
  data,
  percent = true,
  verticalLabels = false,
  height = 240
}: {
  data: { name: string; value: number }[];
  percent?: boolean;
  verticalLabels?: boolean;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={verticalLabels ? { top: 5, right: 20, bottom: 95, left: 0 } : undefined}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          height={verticalLabels ? 120 : undefined}
          interval={0}
          tick={verticalLabels ? { fontSize: 12, width: 120 } : { fontSize: 12 }}
          angle={verticalLabels ? 90 : 0}
          textAnchor={verticalLabels ? "start" : "middle"}
          tickFormatter={(name) => String(name).replaceAll("_", " ")}
        />
        <YAxis domain={percent ? [0, 100] : undefined} />
        <Tooltip />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ScoreLineChart({ data }: { data: { name: string; score: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function DistributionPieChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={88} label>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
