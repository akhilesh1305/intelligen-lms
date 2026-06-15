import { Role } from "@prisma/client";
import { createSession, createPending2FA } from "@/lib/auth";
import { logAudit, getClientInfo } from "@/lib/audit";
import { db } from "@/lib/db";
import { isIpAllowed } from "./ip-restriction";
import { trackDevice } from "./devices";
import { getSecuritySettings } from "./settings";

type LoginUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  twoFactorEnabled: boolean;
};

export type LoginResult =
  | { status: "success" }
  | { status: "requires_2fa" }
  | { status: "ip_blocked" }
  | { status: "device_revoked" }
  | { status: "admin_2fa_required" };

export async function completeLogin(
  user: LoginUser,
  request: Request,
  options?: { skip2fa?: boolean; auditAction?: "LOGIN" | "SSO_LOGIN" }
): Promise<LoginResult> {
  const { ipAddress, userAgent } = getClientInfo(request);

  const ipAllowed = await isIpAllowed(ipAddress);
  if (!ipAllowed) {
    await logAudit({
      action: "IP_BLOCKED",
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      metadata: { ipAddress },
      request,
    });
    return { status: "ip_blocked" };
  }

  const deviceResult = await trackDevice(user.id, userAgent, ipAddress);
  if (!deviceResult.allowed) {
    await logAudit({
      action: "LOGIN_FAILED",
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      metadata: { reason: "revoked_device" },
      request,
    });
    return { status: "device_revoked" };
  }

  const settings = await getSecuritySettings();
  if (
    !options?.skip2fa &&
    settings.requireAdmin2fa &&
    user.role === "ADMIN" &&
    !user.twoFactorEnabled
  ) {
    return { status: "admin_2fa_required" };
  }

  const needs2fa = !options?.skip2fa && user.twoFactorEnabled;

  if (needs2fa) {
    await createPending2FA(user.id);
    return { status: "requires_2fa" };
  }

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await logAudit({
    action: options?.auditAction ?? "LOGIN",
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    targetType: "User",
    targetId: user.id,
    metadata: { device: deviceResult.device.deviceName },
    request,
  });

  return { status: "success" };
}

export async function finalize2FALogin(userId: string, request: Request) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  return completeLogin(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      twoFactorEnabled: user.twoFactorEnabled,
    },
    request,
    { skip2fa: true }
  );
}
