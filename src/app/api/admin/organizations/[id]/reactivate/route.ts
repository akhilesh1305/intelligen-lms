import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const organization = await db.organization.update({
    where: { id },
    data: {
      status: "ACTIVE",
      terminatedAt: null,
    },
  });

  return NextResponse.json({ organization });
}
