import { UserCheck, Users, UserX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TableScroll } from "@/components/ui/table-scroll";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

type AttendanceRow = {
  id: string;
  user: { name: string; email: string };
  joinedAt: Date;
  leftAt: Date | null;
  durationMinutes: number;
  present: boolean;
};

type RegistrationRow = {
  user: { id: string; name: string; email: string };
  registeredAt: Date;
};

export function AttendanceReport({
  stats,
  attendance,
  registrations,
}: {
  stats: {
    registered: number;
    joined: number;
    attended: number;
    attendanceRate: number;
  };
  attendance: AttendanceRow[];
  registrations: RegistrationRow[];
}) {
  const noShows = registrations.filter(
    (r) => !attendance.some((a) => a.user.email === r.user.email && a.present)
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-5 text-center">
            <Users className="mx-auto h-6 w-6 text-brand-600" />
            <p className="mt-2 text-2xl font-bold text-ink">{stats.registered}</p>
            <p className="text-xs text-muted">Registered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <Users className="mx-auto h-6 w-6 text-sky-600" />
            <p className="mt-2 text-2xl font-bold text-ink">{stats.joined}</p>
            <p className="text-xs text-muted">Joined</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <UserCheck className="mx-auto h-6 w-6 text-emerald-600" />
            <p className="mt-2 text-2xl font-bold text-ink">{stats.attended}</p>
            <p className="text-xs text-muted">Present</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <p className="mt-2 text-2xl font-bold text-brand-600">
              {stats.attendanceRate}%
            </p>
            <p className="text-xs text-muted">Attendance rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-5">
          <h3 className="font-bold text-ink">Attendance log</h3>
          {attendance.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No attendance recorded yet.</p>
          ) : (
            <TableScroll className="mt-4">
              <table className="w-full min-w-[400px] text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase text-muted">
                    <th className="pb-2 pr-4">Learner</th>
                    <th className="pb-2 pr-4">Joined</th>
                    <th className="pb-2 pr-4">Duration</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {attendance.map((row) => (
                    <tr key={row.id}>
                      <td className="py-3 pr-4">
                        <p className="font-medium text-ink">{row.user.name}</p>
                        <p className="text-xs text-muted">{row.user.email}</p>
                      </td>
                      <td className="py-3 pr-4 text-muted">
                        {formatDateTime(row.joinedAt)}
                      </td>
                      <td className="py-3 pr-4 text-muted">
                        {row.durationMinutes > 0
                          ? `${row.durationMinutes} min`
                          : "—"}
                      </td>
                      <td className="py-3">
                        <Badge variant={row.present ? "success" : "warning"}>
                          {row.present ? "Present" : "Joined"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScroll>
          )}
        </CardContent>
      </Card>

      {noShows.length > 0 ? (
        <Card>
          <CardContent className="pt-5">
            <h3 className="flex items-center gap-2 font-bold text-ink">
              <UserX className="h-4 w-4 text-amber-600" />
              Registered but not present ({noShows.length})
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {noShows.map((r) => (
                <li key={r.user.id}>
                  {r.user.name} — registered {formatDateTime(r.registeredAt)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
