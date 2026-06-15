import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { revokeDevice } from "@/lib/security/devices";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const device = await revokeDevice(session.id, id);

  if (!device) {
    return NextResponse.json({ error: "Device not found" }, { status: 404 });
  }

  await logAudit({
    action: "DEVICE_REVOKED",
    userId: session.id,
    userEmail: session.email,
    userName: session.name,
    targetType: "UserDevice",
    targetId: device.id,
    metadata: { deviceName: device.deviceName },
    request,
  });

  return NextResponse.json({ success: true });
}
