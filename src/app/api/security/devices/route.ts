import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserDevices } from "@/lib/security/devices";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const devices = await getUserDevices(session.id);
  return NextResponse.json({ devices });
}
