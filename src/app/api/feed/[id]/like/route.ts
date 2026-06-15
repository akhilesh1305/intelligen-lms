import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { toggleFeedLike } from "@/lib/feed";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const result = await toggleFeedLike(session.id, id);

  if (!result) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
