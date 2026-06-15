import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  isKnowledgeGameSlug,
  submitKnowledgeGameAttempt,
} from "@/lib/knowledge-games";

type RouteContext = { params: Promise<{ slug: string }> };

export async function POST(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await context.params;
  if (!isKnowledgeGameSlug(slug)) {
    return NextResponse.json({ error: "Unknown game" }, { status: 404 });
  }

  const body = (await request.json()) as {
    score?: number;
    payload?: Record<string, unknown>;
  };

  if (typeof body.score !== "number" || body.score < 0 || body.score > 100) {
    return NextResponse.json({ error: "Invalid score" }, { status: 400 });
  }

  try {
    const result = await submitKnowledgeGameAttempt(
      session.id,
      slug,
      Math.round(body.score),
      body.payload
    );
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Submit failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
