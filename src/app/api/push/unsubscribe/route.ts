import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { removePushSubscription } from "@/lib/push";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { endpoint } = await request.json();
  if (!endpoint) {
    return NextResponse.json({ error: "Endpoint required" }, { status: 400 });
  }

  await removePushSubscription(endpoint);
  return NextResponse.json({ success: true });
}
