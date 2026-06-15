import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createOrganizationWithAdmin } from "@/lib/org-admin";
import { createOrganizationSchema } from "@/lib/validations";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const organizations = await db.organization.findMany({
    include: {
      _count: { select: { members: true, courses: true } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ organizations });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createOrganizationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const domains = (parsed.data.allowedDomains ?? []).map((d) =>
    d.replace(/^@/, "").toLowerCase()
  );

  try {
    const { organization, member } = await createOrganizationWithAdmin(
      {
        name: parsed.data.name,
        slug: parsed.data.slug,
        allowedDomains: domains,
        allowPublicCourses: parsed.data.allowPublicCourses,
      },
      parsed.data.orgAdmin
    );

    return NextResponse.json({ organization, orgAdmin: member }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create organization";
    const status = message.includes("already exists") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
