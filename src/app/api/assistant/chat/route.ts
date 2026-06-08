import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { handleAssistantChat } from "@/lib/assistant/chat";

const schema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .max(20)
    .optional(),
});

export async function POST(request: Request) {
  const session = await getSession();

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const { message, history = [] } = parsed.data;

  const response = await handleAssistantChat(
    message,
    history,
    session?.id
  );

  return NextResponse.json(response);
}
