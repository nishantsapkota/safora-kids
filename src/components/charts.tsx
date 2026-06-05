'use client';

import { useEffect, useState } from 'react';
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
} from 'recharts';

const COLORS = [
  '#2563eb',
  '#1f9d55',
  '#f97316',
  '#dc2626',
  '#7c3aed',
  '#0f766e'
];

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const safeHeight = Number.isFinite(height) ? height : 240;
  const chartData = data.map(item => ({
    ...item,
    value: Number.isFinite(Number(item.value)) ? Number(item.value) : 0
  }));
  const maxValue = chartData.reduce(
    (max, item) => Math.max(max, item.value),
    0
  );
  const yAxisDomain = percent ? [0, 100] : [0, Math.max(maxValue, 1)];

  if (!isMounted) {
    return <div style={{ height: safeHeight, width: '100%' }} />;
  }

  const hasData = chartData.length > 0 && chartData.some((d) => Number.isFinite(d.value) && d.value !== 0);
  if (!hasData) {
    return (
      <div style={{ height: safeHeight, width: '100%' }} className="flex items-center justify-center text-sm text-slate-500">
        No data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={safeHeight}>
      <BarChart
        data={chartData}
        margin={
          verticalLabels
            ? { top: 5, right: 20, bottom: 95, left: 0 }
            : undefined
        }
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          height={verticalLabels ? 120 : undefined}
          interval={0}
          tick={
            verticalLabels ? { fontSize: 12, width: 120 } : { fontSize: 12 }
          }
          angle={verticalLabels ? 90 : 0}
          textAnchor={verticalLabels ? 'start' : 'middle'}
          tickFormatter={name => String(name).replaceAll('_', ' ')}
        />
        <YAxis domain={yAxisDomain} allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ScoreLineChart({
  data
}: {
  data: { name: string; score: number }[];
}) {
  const safeHeight = 240;
  const lineData = data.map((item) => ({ ...item, score: Number.isFinite(Number(item.score)) ? Number(item.score) : 0 }));
  const hasLineData = lineData.length > 0 && lineData.some((d) => Number.isFinite(d.score) && d.score !== 0);
  if (!hasLineData) {
    return <div style={{ height: safeHeight, width: '100%' }} className="flex items-center justify-center text-sm text-slate-500">No data to display</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#2563eb"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function DistributionPieChart({
  data
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={45}
          outerRadius={88}
          label
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
