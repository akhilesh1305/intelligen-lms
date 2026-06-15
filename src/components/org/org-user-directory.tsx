"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Download, Search } from "lucide-react";
import type { OrgUserDirectoryEntry } from "@/lib/org-admin";
import { csvFilename, rowsToCsv } from "@/lib/csv";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TableScroll } from "@/components/ui/table-scroll";
import { cn } from "@/lib/utils";

type RoleFilter = "ALL" | "ORG_LEARNER" | "ORG_INSTRUCTOR" | "ORG_ADMIN";

const ROLE_FILTERS: { id: RoleFilter; label: string }[] = [
  { id: "ALL", label: "All users" },
  { id: "ORG_LEARNER", label: "Learners" },
  { id: "ORG_INSTRUCTOR", label: "Instructors" },
  { id: "ORG_ADMIN", label: "Admins" },
];

export function OrgUserDirectory({
  users,
  orgSlug,
  compact = false,
}: {
  users: OrgUserDirectoryEntry[];
  orgSlug: string;
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      if (roleFilter !== "ALL" && user.role !== roleFilter) return false;
      if (!q) return true;
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        (user.employeeId?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [users, query, roleFilter]);

  function exportCsv() {
    const headers = [
      "employee_id",
      "name",
      "email",
      "role",
      "joined",
      "enrolled_courses",
      "completed_courses",
      "avg_progress_pct",
      "active",
      "quiz_points",
      "weekly_quiz_points",
      "weekly_quizzes",
      "corporate_games",
      "corporate_points",
      "courses_created",
      "learners_taught",
    ];
    const rows = filtered.map((u) => [
      u.employeeId ?? "",
      u.name,
      u.email,
      u.role,
      u.joinedAt.slice(0, 10),
      u.enrolledCourses,
      u.completedCourses,
      u.avgProgress,
      u.isActive ? "yes" : "no",
      u.quizPoints,
      u.weeklyQuizPoints,
      u.weeklyQuizzes,
      u.corporateGamesPlayed,
      u.corporatePoints,
      u.coursesCreated,
      u.learnersTaught,
    ]);
    const blob = new Blob([rowsToCsv(headers, rows)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = csvFilename(`org-${orgSlug}-users`);
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, or employee ID…"
            className="pl-9"
          />
        </div>
        <Button type="button" variant="outline" size="sm" onClick={exportCsv}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {ROLE_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setRoleFilter(filter.id)}
            className={cn(
              "min-h-10 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
              roleFilter === filter.id
                ? "bg-brand-600 text-white"
                : "bg-surface text-muted hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950/40"
            )}
          >
            {filter.label}
            <span className="ml-1.5 opacity-80">
              (
              {filter.id === "ALL"
                ? users.length
                : users.filter((u) => u.role === filter.id).length}
              )
            </span>
          </button>
        ))}
      </div>

      <p className="text-sm text-muted">
        Showing {filtered.length} of {users.length} organization users
      </p>

      <div className="space-y-3 md:hidden">
        {filtered.length > 0 ? (
          filtered.map((user) => {
            const expanded = expandedId === user.userId;
            return (
              <div
                key={user.userId}
                className="rounded-lg border border-border bg-panel p-4 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : user.userId)}
                  className="flex w-full items-start justify-between gap-3 text-left"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{user.name}</p>
                    <p className="mt-0.5 truncate text-xs text-muted">{user.email}</p>
                    <p className="mt-1 font-mono text-xs text-muted">
                      {user.employeeId ?? "No employee ID"}
                    </p>
                  </div>
                  <Badge variant="brand" className="shrink-0">
                    {user.roleLabel}
                  </Badge>
                </button>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md bg-surface/80 px-2 py-1.5">
                    <p className="text-muted">Progress</p>
                    <p className="font-semibold text-ink">{user.avgProgress}%</p>
                  </div>
                  <div className="rounded-md bg-surface/80 px-2 py-1.5">
                    <p className="text-muted">Quiz pts</p>
                    <p className="font-semibold text-ink">{user.quizPoints}</p>
                  </div>
                  <div className="rounded-md bg-surface/80 px-2 py-1.5">
                    <p className="text-muted">Courses</p>
                    <p className="font-semibold text-ink">{user.enrolledCourses}</p>
                  </div>
                  <div className="rounded-md bg-surface/80 px-2 py-1.5">
                    <p className="text-muted">This week</p>
                    <p className="font-semibold text-ink">{user.weeklyQuizPoints} pts</p>
                  </div>
                </div>
                {expanded ? (
                  <div className="mt-3 border-t border-border pt-3 text-sm">
                    {user.courseDetails.length > 0 ? (
                      <ul className="space-y-2">
                        {user.courseDetails.map((course) => (
                          <li key={course.id}>
                            <Link
                              href={`/courses/${course.id}`}
                              className="font-medium text-brand-600"
                            >
                              {course.title}
                            </Link>
                            <ProgressBar value={course.progress} className="mt-1 h-1" />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">No org course enrollments.</p>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          <p className="py-8 text-center text-sm text-muted">No users match your search.</p>
        )}
      </div>

      <TableScroll className="hidden md:block">
        <table className="w-full min-w-[900px] text-left text-sm lg:min-w-[1100px]">
          <thead className="bg-surface/80">
            <tr className="border-b border-border text-muted">
              <th className="w-8 px-2 py-3" />
              <th className="px-3 py-3 font-semibold">Employee ID</th>
              <th className="px-3 py-3 font-semibold">Name</th>
              <th className="px-3 py-3 font-semibold">Email</th>
              <th className="px-3 py-3 font-semibold">Role</th>
              <th className="px-3 py-3 font-semibold">Courses</th>
              <th className="px-3 py-3 font-semibold">Progress</th>
              <th className="px-3 py-3 font-semibold">Quiz pts</th>
              <th className="px-3 py-3 font-semibold">This week</th>
              <th className="px-3 py-3 font-semibold">Corporate</th>
              {!compact ? (
                <th className="px-3 py-3 font-semibold">Teaching</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((user) => {
                const expanded = expandedId === user.userId;
                return (
                  <Fragment key={user.userId}>
                    <tr className="border-b border-border/60 hover:bg-surface/40">
                      <td className="px-2 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId(expanded ? null : user.userId)
                          }
                          className="touch-target flex items-center justify-center rounded text-muted hover:bg-surface hover:text-ink"
                          aria-label={expanded ? "Collapse" : "Expand details"}
                        >
                          {expanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-3 py-3 font-mono text-xs">
                        {user.employeeId ?? "—"}
                      </td>
                      <td className="px-3 py-3 font-medium text-ink">{user.name}</td>
                      <td className="px-3 py-3 text-muted">{user.email}</td>
                      <td className="px-3 py-3">
                        <Badge variant="brand">{user.roleLabel}</Badge>
                      </td>
                      <td className="px-3 py-3 text-muted">
                        {user.enrolledCourses} enrolled
                        {user.completedCourses > 0
                          ? ` · ${user.completedCourses} done`
                          : ""}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex min-w-[88px] items-center gap-2">
                          <ProgressBar value={user.avgProgress} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted">{user.avgProgress}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">{user.quizPoints}</td>
                      <td className="px-3 py-3 text-muted">
                        {user.weeklyQuizPoints} pts · {user.weeklyQuizzes} quiz
                        {user.weeklyQuizzes !== 1 ? "zes" : ""}
                      </td>
                      <td className="px-3 py-3 text-muted">
                        {user.corporateGamesPlayed} games · {user.corporatePoints} pts
                      </td>
                      {!compact ? (
                        <td className="px-3 py-3 text-muted">
                          {user.role === "ORG_INSTRUCTOR" ||
                          user.coursesCreated > 0
                            ? `${user.coursesCreated} courses · ${user.learnersTaught} learners`
                            : "—"}
                        </td>
                      ) : null}
                    </tr>
                    {expanded ? (
                      <tr className="bg-surface/30">
                        <td colSpan={compact ? 10 : 11} className="px-4 py-4">
                          <div className="grid gap-4 lg:grid-cols-2">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                                Org course enrollments
                              </p>
                              {user.courseDetails.length > 0 ? (
                                <ul className="mt-2 space-y-2">
                                  {user.courseDetails.map((course) => (
                                    <li
                                      key={course.id}
                                      className="rounded-md border border-border/60 px-3 py-2"
                                    >
                                      <div className="flex justify-between gap-2 text-sm">
                                        <Link
                                          href={`/courses/${course.id}`}
                                          className="font-medium text-ink hover:text-brand-600"
                                        >
                                          {course.title}
                                        </Link>
                                        <span className="shrink-0 text-muted">
                                          {course.completed
                                            ? "Completed"
                                            : `${course.progress}%`}
                                        </span>
                                      </div>
                                      <ProgressBar
                                        value={course.progress}
                                        className="mt-1.5 h-1"
                                      />
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="mt-2 text-sm text-muted">
                                  Not enrolled in any org courses yet.
                                </p>
                              )}
                            </div>
                            <div className="grid gap-2 text-sm sm:grid-cols-2">
                              {[
                                ["Joined", new Date(user.joinedAt).toLocaleDateString()],
                                ["Status", user.isActive ? "Active learner" : "Not started"],
                                ["Quiz points (all time)", String(user.quizPoints)],
                                ["Quiz points (this week)", String(user.weeklyQuizPoints)],
                                ["Corporate games played", String(user.corporateGamesPlayed)],
                                ["Corporate points", String(user.corporatePoints)],
                                ["Courses created", String(user.coursesCreated)],
                                ["Learners taught", String(user.learnersTaught)],
                              ].map(([label, value]) => (
                                <div
                                  key={label}
                                  className="rounded-md border border-border/60 px-3 py-2"
                                >
                                  <p className="text-xs text-muted">{label}</p>
                                  <p className="font-medium text-ink">{value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={compact ? 10 : 11}
                  className="px-4 py-10 text-center text-sm text-muted"
                >
                  No users match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableScroll>
    </div>
  );
}
