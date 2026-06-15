import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { securitySettingsSchema } from "@/lib/validations";
import {
  getSecuritySettings,
  updateSecuritySettings,
} from "@/lib/security/settings";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const settings = await getSecuritySettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = securitySettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  await updateSecuritySettings(parsed.data);

  await logAudit({
    action: "SECURITY_SETTINGS_UPDATED",
    userId: session.id,
    userEmail: session.email,
    userName: session.name,
    metadata: parsed.data,
    request,
  });

  const settings = await getSecuritySettings();
  return NextResponse.json(settings);
}
