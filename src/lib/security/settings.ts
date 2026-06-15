import { db } from "@/lib/db";

export type SecuritySettingsData = {
  ipRestrictionEnabled: boolean;
  allowedIps: string[];
  requireAdmin2fa: boolean;
  googleSsoEnabled: boolean;
  microsoftSsoEnabled: boolean;
  oktaSsoEnabled: boolean;
};

const DEFAULTS: SecuritySettingsData = {
  ipRestrictionEnabled: false,
  allowedIps: [],
  requireAdmin2fa: false,
  googleSsoEnabled: true,
  microsoftSsoEnabled: true,
  oktaSsoEnabled: true,
};

function parseAllowedIps(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((ip): ip is string => typeof ip === "string")
      : [];
  } catch {
    return [];
  }
}

export async function getSecuritySettings(): Promise<SecuritySettingsData> {
  const row = await db.securitySettings.findUnique({ where: { id: "default" } });
  if (!row) return { ...DEFAULTS };

  return {
    ipRestrictionEnabled: row.ipRestrictionEnabled,
    allowedIps: parseAllowedIps(row.allowedIps),
    requireAdmin2fa: row.requireAdmin2fa,
    googleSsoEnabled: row.googleSsoEnabled,
    microsoftSsoEnabled: row.microsoftSsoEnabled,
    oktaSsoEnabled: row.oktaSsoEnabled,
  };
}

export async function updateSecuritySettings(
  data: Partial<SecuritySettingsData>
) {
  const allowedIps =
    data.allowedIps !== undefined ? JSON.stringify(data.allowedIps) : undefined;

  return db.securitySettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      ipRestrictionEnabled: data.ipRestrictionEnabled ?? DEFAULTS.ipRestrictionEnabled,
      allowedIps: allowedIps ?? JSON.stringify(DEFAULTS.allowedIps),
      requireAdmin2fa: data.requireAdmin2fa ?? DEFAULTS.requireAdmin2fa,
      googleSsoEnabled: data.googleSsoEnabled ?? DEFAULTS.googleSsoEnabled,
      microsoftSsoEnabled:
        data.microsoftSsoEnabled ?? DEFAULTS.microsoftSsoEnabled,
      oktaSsoEnabled: data.oktaSsoEnabled ?? DEFAULTS.oktaSsoEnabled,
    },
    update: {
      ...(data.ipRestrictionEnabled !== undefined && {
        ipRestrictionEnabled: data.ipRestrictionEnabled,
      }),
      ...(allowedIps !== undefined && { allowedIps }),
      ...(data.requireAdmin2fa !== undefined && {
        requireAdmin2fa: data.requireAdmin2fa,
      }),
      ...(data.googleSsoEnabled !== undefined && {
        googleSsoEnabled: data.googleSsoEnabled,
      }),
      ...(data.microsoftSsoEnabled !== undefined && {
        microsoftSsoEnabled: data.microsoftSsoEnabled,
      }),
      ...(data.oktaSsoEnabled !== undefined && {
        oktaSsoEnabled: data.oktaSsoEnabled,
      }),
    },
  });
}

export async function ensureSecuritySettings() {
  const requireAdmin2fa = process.env.REQUIRE_ADMIN_2FA === "true";

  await db.securitySettings.upsert({
    where: { id: "default" },
    create: { id: "default", requireAdmin2fa },
    update: { requireAdmin2fa },
  });
}
