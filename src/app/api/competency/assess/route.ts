import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveSkillAssessment } from "@/lib/competency";
import { skillAssessmentSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = skillAssessmentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  await saveSkillAssessment(
    session.id,
    parsed.data.skillId,
    parsed.data.level
  );

  return NextResponse.json({ success: true });
}
