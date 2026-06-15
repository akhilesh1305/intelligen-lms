import { NextResponse } from "next/server";
import { destroySession, getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import {
  anonymizeUser,
  completeGdprRequest,
  requestGdprDeletion,
} from "@/lib/gdpr";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  if (body.confirm !== "DELETE MY ACCOUNT") {
    return NextResponse.json(
      { error: 'Type "DELETE MY ACCOUNT" to confirm' },
      { status: 400 }
    );
  }

  const gdprRequest = await requestGdprDeletion(session.id);
  await anonymizeUser(session.id);
  await completeGdprRequest(gdprRequest.id);

  await logAudit({
    action: "GDPR_DELETION",
    userId: session.id,
    userEmail: session.email,
    userName: session.name,
    targetType: "GdprRequest",
    targetId: gdprRequest.id,
    request,
  });

  await destroySession();

  return NextResponse.json({ success: true });
}
