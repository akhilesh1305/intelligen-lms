import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { registerForWebinar } from "@/lib/webinars";
import { createNotification } from "@/lib/notifications";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const registration = await registerForWebinar(id, session.id);
    if (!registration) {
      return NextResponse.json({ error: "Webinar not found" }, { status: 404 });
    }

    const webinar = await db.webinar.findUnique({
      where: { id },
      select: { title: true, hostId: true },
    });

    if (webinar && webinar.hostId !== session.id) {
      await createNotification({
        userId: webinar.hostId,
        type: "WEBINAR_REGISTERED",
        title: "New webinar registration",
        message: `${session.name} registered for ${webinar.title}`,
        link: `/webinars/${id}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
