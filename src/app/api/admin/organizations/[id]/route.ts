import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  parseContractEndDate,
  parseContractStartDate,
} from "@/lib/organization-lifecycle";
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
    contractStartsAt?: Date | null;
    contractEndsAt?: Date | null;
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

  if (parsed.data.contractStartsAt !== undefined) {
    data.contractStartsAt = parsed.data.contractStartsAt
      ? parseContractStartDate(parsed.data.contractStartsAt)
      : null;
  }
  if (parsed.data.contractEndsAt !== undefined) {
    data.contractEndsAt = parsed.data.contractEndsAt
      ? parseContractEndDate(parsed.data.contractEndsAt)
      : null;
  }

  if (
    data.contractStartsAt &&
    data.contractEndsAt &&
    data.contractStartsAt.getTime() > data.contractEndsAt.getTime()
  ) {
    return NextResponse.json(
      { error: "Contract start date must be before the end date" },
      { status: 400 }
    );
  }

  const organization = await db.organization.update({
    where: { id },
    data,
  });

  return NextResponse.json({ organization });
}
