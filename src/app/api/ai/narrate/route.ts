import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateSpeech } from "@/lib/ai/client";
import { aiNarrateSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = aiNarrateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const audio = await generateSpeech(parsed.data.text);
  if (!audio) {
    return NextResponse.json(
      { error: "Narration unavailable", fallback: "browser" },
      { status: 503 }
    );
  }

  return new NextResponse(new Uint8Array(audio), {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": String(audio.length),
    },
  });
}
