import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { coachChatSchema } from "@/lib/validations";
import { handleCoachChat } from "@/lib/coach/chat";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = coachChatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const response = await handleCoachChat(
    parsed.data.message,
    parsed.data.history ?? [],
    session.id
  );

  return NextResponse.json(response);
}
