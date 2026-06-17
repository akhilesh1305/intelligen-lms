import { NextResponse } from "next/server";
import { z } from "zod";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { assertCanManageOrg } from "@/lib/org-admin";
import { saveOrganizationSignature } from "@/lib/org-signatures";

const nameSchema = z.object({
  signatoryName: z.string().trim().min(1).max(120),
});

const orgSelect = {
  id: true,
  name: true,
  slug: true,
  logoUrl: true,
  signatoryName: true,
  signatureUrl: true,
} as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const session = await getSession();
    const { organizationId } = await params;
    const denied = await assertCanManageOrg(session, organizationId);
    if (denied) return denied;

    const body = await request.json();
    const parsed = nameSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter a valid signatory name" },
        { status: 400 }
      );
    }

    const organization = await db.organization.update({
      where: { id: organizationId },
      data: { signatoryName: parsed.data.signatoryName },
      select: orgSelect,
    });

    return NextResponse.json({ organization });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

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
    const file = formData.get("signature");
    const signatoryName = formData.get("signatoryName");

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "Please choose a signature image to upload" },
        { status: 400 }
      );
    }

    let signatureUrl: string;
    try {
      signatureUrl = await saveOrganizationSignature(organizationId, file);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Invalid image" },
        { status: 400 }
      );
    }

    const data: { signatureUrl: string; signatoryName?: string } = {
      signatureUrl,
    };

    if (typeof signatoryName === "string" && signatoryName.trim()) {
      data.signatoryName = signatoryName.trim().slice(0, 120);
    }

    const organization = await db.organization.update({
      where: { id: organizationId },
      data,
      select: orgSelect,
    });

    return NextResponse.json({ organization });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
