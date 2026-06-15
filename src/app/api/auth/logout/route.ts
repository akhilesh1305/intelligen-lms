import { NextResponse } from "next/server";
import { destroySession, getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { publicRedirect } from "@/lib/request-url";

export async function POST(request: Request) {
  const session = await getSession();

  if (session) {
    await logAudit({
      action: "LOGOUT",
      userId: session.id,
      userEmail: session.email,
      userName: session.name,
      targetType: "User",
      targetId: session.id,
      request,
    });
  }

  await destroySession();
  return NextResponse.redirect(publicRedirect("/", request));
}
