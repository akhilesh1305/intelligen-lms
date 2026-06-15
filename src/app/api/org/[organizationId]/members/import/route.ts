import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import {
  assertCanManageOrg,
  importOrganizationMembersFromCsv,
} from "@/lib/org-admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  const session = await getSession();
  const { organizationId } = await params;
  const denied = await assertCanManageOrg(session, organizationId);
  if (denied) return denied;

  const contentType = request.headers.get("content-type") ?? "";
  let csvText = "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "CSV file is required" }, { status: 400 });
    }
    csvText = await file.text();
  } else {
    const body = await request.json();
    csvText = body.csv ?? body.csvText ?? "";
  }

  if (!csvText.trim()) {
    return NextResponse.json({ error: "CSV content is empty" }, { status: 400 });
  }

  const result = await importOrganizationMembersFromCsv(organizationId, csvText);
  return NextResponse.json(result);
}
