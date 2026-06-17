import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { assertCanManageOrg } from "@/lib/org-admin";
import { saveOrganizationLogo } from "@/lib/org-logos";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const session = await getSession();
    const { organizationId } = await params;
    const denied = await assertCanManageOrg(session, organizationId);
    if (denied) return denied;

    const formData = await request.formData();
    const file = formData.get("logo");

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "Please choose a logo image to upload" },
        { status: 400 }
      );
    }

    let logoUrl: string;
    try {
      logoUrl = await saveOrganizationLogo(organizationId, file);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Invalid image" },
        { status: 400 }
      );
    }

    const organization = await db.organization.update({
      where: { id: organizationId },
      data: { logoUrl },
      select: { id: true, name: true, slug: true, logoUrl: true },
    });

    return NextResponse.json({ organization });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
