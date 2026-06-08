import { NextResponse } from "next/server";
import { destroySession, getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

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
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(new URL("/", origin));
}
