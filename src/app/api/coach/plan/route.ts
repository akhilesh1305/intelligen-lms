import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getActionPlan } from "@/lib/coach/insights";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = await getActionPlan(session.id);
  return NextResponse.json(plan);
}
