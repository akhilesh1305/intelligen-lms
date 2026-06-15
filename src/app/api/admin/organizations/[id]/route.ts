import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { organizationSchema } from "@/lib/validations";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = organizationSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const data: {
    name?: string;
    allowedDomains?: string[];
    allowPublicCourses?: boolean;
  } = {};

  if (parsed.data.name) data.name = parsed.data.name;
  if (parsed.data.allowedDomains) {
    data.allowedDomains = parsed.data.allowedDomains.map((d) =>
      d.replace(/^@/, "").toLowerCase()
    );
  }
  if (parsed.data.allowPublicCourses !== undefined) {
    data.allowPublicCourses = parsed.data.allowPublicCourses;
  }

  const organization = await db.organization.update({
    where: { id },
    data,
  });

  return NextResponse.json({ organization });
}
