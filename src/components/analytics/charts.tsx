"use client";

import { formatRole } from "@/lib/roles";
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

export function EnrollmentTrendChart({
  data,
}: {
  data: { month: string; enrollments: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="enrollments"
          stroke="#0056d2"
          strokeWidth={2}
          dot={{ fill: "#0056d2" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TopCoursesChart({
  data,
}: {
  data: { title: string; enrollments: number }[];
}) {
  const short = data.map((d) => ({
    ...d,
    shortTitle: d.title.length > 20 ? d.title.slice(0, 20) + "…" : d.title,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={short} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis dataKey="shortTitle" type="category" width={90} tick={{ fontSize: 10 }} />
        <Tooltip />
        <Bar dataKey="enrollments" fill="#0056d2" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RoleDistributionChart({
  data,
}: {
  data: { role: string; count: number }[];
}) {
  const chartData = data.map((d) => ({
    count: d.count,
    role: formatRole(d.role),
  }));

  return (
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
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function WeeklyLeaderboardChart({
  data,
}: {
  data: { name: string; points: number }[];
}) {
  const short = data.map((d) => ({
    ...d,
    shortName: d.name.length > 14 ? d.name.slice(0, 14) + "…" : d.name,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={short} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis
          dataKey="shortName"
          type="category"
          width={90}
          tick={{ fontSize: 10 }}
        />
        <Tooltip />
        <Bar dataKey="points" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function QuizActivityChart({
  data,
}: {
  data: { day: string; attempts: number; points: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="day" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="attempts"
          name="Quiz attempts"
          stroke="#0056d2"
          strokeWidth={2}
          dot={{ fill: "#0056d2" }}
        />
        <Line
          type="monotone"
          dataKey="points"
          name="Points earned"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ fill: "#8b5cf6" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CourseStatusChart({
  data,
}: {
  data: { status: string; count: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="status" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function NamedDistributionChart({
  data,
}: {
  data: { name: string; count: number }[];
}) {
  return (
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
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function LearnerProgressChart({
  data,
}: {
  data: { name: string; progress: number }[];
}) {
  const short = data.map((d) => ({
    ...d,
    shortName: d.name.length > 14 ? d.name.slice(0, 14) + "…" : d.name,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={short} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
        <YAxis
          dataKey="shortName"
          type="category"
          width={90}
          tick={{ fontSize: 10 }}
        />
        <Tooltip />
        <Bar dataKey="progress" name="Avg progress %" fill="#10b981" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
