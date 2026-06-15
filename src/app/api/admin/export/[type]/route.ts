import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import {
  ADMIN_EXPORT_TYPES,
  AdminExportType,
  buildAdminExport,
} from "@/lib/admin-export";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type } = await params;
  if (!ADMIN_EXPORT_TYPES.includes(type as AdminExportType)) {
    return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
  }

  try {
    const { filename, csv } = await buildAdminExport(type as AdminExportType);

    await logAudit({
      action: "USER_UPDATED",
      userId: session.id,
      userEmail: session.email,
      userName: session.name,
      metadata: { updateType: "admin_csv_export", exportType: type },
      request,
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate export" },
      { status: 500 }
    );
  }
}
