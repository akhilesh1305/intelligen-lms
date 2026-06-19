"use client";

import type { ReactNode } from "react";
import { formatRole } from "@/lib/roles";
import { useRecordingMode } from "@/components/recording/recording-mode-provider";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#0056d2", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
const CHART_GRID = "var(--chart-grid)";
const CHART_AXIS = "var(--chart-axis)";
const TICK = { fontSize: 12, fill: CHART_AXIS };
const TICK_SM = { fontSize: 11, fill: CHART_AXIS };
const TICK_XS = { fontSize: 10, fill: CHART_AXIS };

function useChartMotion() {
  const { enabled } = useRecordingMode();
  return !enabled;
}

function ChartFrame({ children }: { children: ReactNode }) {
  return (
    <div className="h-full w-full" data-recording-chart>
      {children}
    </div>
  );
}

export function EnrollmentTrendChart({
  data,
}: {
  data: { month: string; enrollments: number }[];
}) {
  const animate = useChartMotion();
  return (
    <ChartFrame>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
          <XAxis dataKey="month" tick={TICK} />
          <YAxis tick={TICK} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="enrollments"
            stroke="#0056d2"
            strokeWidth={2}
            dot={{ fill: "#0056d2" }}
            isAnimationActive={animate}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function TopCoursesChart({
  data,
}: {
  data: { title: string; enrollments: number }[];
}) {
  const animate = useChartMotion();
  const short = data.map((d) => ({
    ...d,
    shortTitle: d.title.length > 20 ? d.title.slice(0, 20) + "…" : d.title,
  }));

  return (
    <ChartFrame>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={short} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
          <XAxis type="number" tick={TICK} />
          <YAxis dataKey="shortTitle" type="category" width={90} tick={TICK_XS} />
          <Tooltip />
          <Bar
            dataKey="enrollments"
            fill="#0056d2"
            radius={[0, 4, 4, 0]}
            isAnimationActive={animate}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function RoleDistributionChart({
  data,
}: {
  data: { role: string; count: number }[];
}) {
  const animate = useChartMotion();
  const chartData = data.map((d) => ({
    count: d.count,
    role: formatRole(d.role),
  }));

  return (
    <ChartFrame>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="role"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ role, count }) => `${role}: ${count}`}
            isAnimationActive={animate}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function WeeklyLeaderboardChart({
  data,
}: {
  data: { name: string; points: number }[];
}) {
  const animate = useChartMotion();
  const short = data.map((d) => ({
    ...d,
    shortName: d.name.length > 14 ? d.name.slice(0, 14) + "…" : d.name,
  }));

  return (
    <ChartFrame>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={short} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
          <XAxis type="number" tick={TICK} />
          <YAxis
            dataKey="shortName"
            type="category"
            width={90}
            tick={TICK_XS}
          />
          <Tooltip />
          <Bar
            dataKey="points"
            fill="#8b5cf6"
            radius={[0, 4, 4, 0]}
            isAnimationActive={animate}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function QuizActivityChart({
  data,
}: {
  data: { day: string; attempts: number; points: number }[];
}) {
  const animate = useChartMotion();
  return (
    <ChartFrame>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
          <XAxis dataKey="day" tick={TICK_SM} />
          <YAxis tick={TICK} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="attempts"
            name="Quiz attempts"
            stroke="#0056d2"
            strokeWidth={2}
            dot={{ fill: "#0056d2" }}
            isAnimationActive={animate}
          />
          <Line
            type="monotone"
            dataKey="points"
            name="Points earned"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ fill: "#8b5cf6" }}
            isAnimationActive={animate}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function CourseStatusChart({
  data,
}: {
  data: { status: string; count: number }[];
}) {
  const animate = useChartMotion();
  return (
    <ChartFrame>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
          <XAxis dataKey="status" tick={TICK_SM} />
          <YAxis tick={TICK} />
          <Tooltip />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive={animate}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function NamedDistributionChart({
  data,
}: {
  data: { name: string; count: number }[];
}) {
  const animate = useChartMotion();
  return (
    <ChartFrame>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, count }) => `${name}: ${count}`}
            isAnimationActive={animate}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function LearnerProgressChart({
  data,
}: {
  data: { name: string; progress: number }[];
}) {
  const animate = useChartMotion();
  const short = data.map((d) => ({
    ...d,
    shortName: d.name.length > 14 ? d.name.slice(0, 14) + "…" : d.name,
  }));

  return (
    <ChartFrame>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={short} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
          <XAxis type="number" domain={[0, 100]} tick={TICK} />
          <YAxis
            dataKey="shortName"
            type="category"
            width={90}
            tick={TICK_XS}
          />
          <Tooltip />
          <Bar
            dataKey="progress"
            name="Avg progress %"
            fill="#10b981"
            radius={[0, 4, 4, 0]}
            isAnimationActive={animate}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
