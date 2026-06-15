import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateInterviewQuestions } from "@/lib/ai/interview";
import { aiInterviewSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = aiInterviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const result = await generateInterviewQuestions(
    parsed.data.role,
    parsed.data.skills ?? [],
    parsed.data.count ?? 8
  );

  return NextResponse.json(result);
}
