import { NextResponse } from "next/server";
import { createSession, getSession } from "@/lib/auth";
import { saveAvatar } from "@/lib/avatars";
import { logAudit } from "@/lib/audit";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "Please choose an image to upload" },
        { status: 400 }
      );
    }

    let avatarUrl: string;
    try {
      avatarUrl = await saveAvatar(session.id, file);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Invalid image" },
        { status: 400 }
      );
    }

    const updated = await db.user.update({
      where: { id: session.id },
      data: { avatarUrl },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
        points: true,
        createdAt: true,
      },
    });

    await createSession({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
    });

    await logAudit({
      action: "USER_UPDATED",
      userId: updated.id,
      userEmail: updated.email,
      userName: updated.name,
      targetType: "User",
      targetId: updated.id,
      metadata: { changes: ["avatar"], updateType: "avatar" },
      request,
    });

    return NextResponse.json({ user: updated });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
