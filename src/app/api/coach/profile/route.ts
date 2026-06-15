import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { coachProfileSchema } from "@/lib/validations";
import { getCoachProfile, upsertCoachProfile } from "@/lib/coach/profile";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getCoachProfile(session.id);
  return NextResponse.json(profile);
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = coachProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  await upsertCoachProfile(session.id, parsed.data);
  const profile = await getCoachProfile(session.id);
  return NextResponse.json(profile);
}
