import { AuditAction } from "@prisma/client";
import { db } from "./db";

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  LOGIN: "Login",
  LOGIN_FAILED: "Failed login",
  LOGOUT: "Logout",
  REGISTER: "Registration",
  COURSE_CREATED: "Course created",
  COURSE_UPDATED: "Course updated",
  USER_UPDATED: "User updated",
};

type LogAuditInput = {
  action: AuditAction;
  userId?: string | null;
  userEmail?: string | null;
  userName?: string | null;
  targetType?: string | null;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
  request?: Request;
};

export function getClientInfo(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  return { ipAddress: ip, userAgent };
}

export async function logAudit({
  action,
  userId,
  userEmail,
  userName,
  targetType,
  targetId,
  metadata,
  request,
}: LogAuditInput) {
  try {
    const client = request ? getClientInfo(request) : null;

    await db.auditLog.create({
      data: {
        action,
        userId: userId ?? null,
        userEmail: userEmail ?? null,
        userName: userName ?? null,
        targetType: targetType ?? null,
        targetId: targetId ?? null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ipAddress: client?.ipAddress ?? null,
        userAgent: client?.userAgent ?? null,
      },
    });
  } catch (err) {
    console.error("Audit log failed:", err);
  }
}

export async function getAuditLogs(options?: {
  action?: AuditAction;
  limit?: number;
  offset?: number;
}) {
  const limit = options?.limit ?? 100;
  const offset = options?.offset ?? 0;

  const where = options?.action ? { action: options.action } : undefined;

  const [logs, total] = await Promise.all([
    db.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    }),
    db.auditLog.count({ where }),
  ]);

  return { logs, total };
}

export function formatAuditMetadata(metadata: string | null): string {
  if (!metadata) return "—";

  try {
    const data = JSON.parse(metadata) as Record<string, unknown>;
    const parts: string[] = [];

    if (data.email) parts.push(`Email: ${data.email}`);
    if (data.title) parts.push(`Title: ${data.title}`);
    if (data.changes) parts.push(`Changes: ${(data.changes as string[]).join(", ")}`);
    if (data.status) parts.push(`Status: ${data.status}`);
    if (data.updateType) parts.push(`Type: ${data.updateType}`);

    return parts.length > 0 ? parts.join(" · ") : metadata;
  } catch {
    return metadata;
  }
}
