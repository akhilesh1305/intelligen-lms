import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { organizationTerminateSchema } from "@/lib/validations";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = organizationTerminateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const organization = await db.organization.update({
    where: { id },
    data: {
      status: "TERMINATED",
      terminatedAt: new Date(),
      terminationNote: parsed.data.terminationNote?.trim() || null,
    },
  });

  return NextResponse.json({ organization });
}
