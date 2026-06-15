import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  isCorporateGameSlug,
  submitCorporateGameAttempt,
} from "@/lib/corporate-games";

type RouteContext = { params: Promise<{ gameType: string }> };

export async function POST(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { gameType } = await context.params;
  if (!isCorporateGameSlug(gameType)) {
    return NextResponse.json({ error: "Unknown game" }, { status: 404 });
  }

  const { choices } = (await request.json()) as { choices?: number[] };
  if (!Array.isArray(choices)) {
    return NextResponse.json({ error: "Invalid choices" }, { status: 400 });
  }

  try {
    const result = await submitCorporateGameAttempt(
      session.id,
      gameType,
      choices
    );
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Submit failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
