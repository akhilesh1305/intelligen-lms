import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import {
  completeGdprRequest,
  exportUserData,
  requestGdprExport,
} from "@/lib/gdpr";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gdprRequest = await requestGdprExport(session.id);
  const data = await exportUserData(session.id);

  if (!data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await completeGdprRequest(gdprRequest.id);

  await logAudit({
    action: "GDPR_EXPORT",
    userId: session.id,
    userEmail: session.email,
    userName: session.name,
    targetType: "GdprRequest",
    targetId: gdprRequest.id,
    request,
  });

  return NextResponse.json(data);
}
