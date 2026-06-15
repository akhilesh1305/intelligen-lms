import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  generateTwoFactorSecret,
  getQrCodeDataUrl,
} from "@/lib/security/2fa";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = generateTwoFactorSecret();
  const qrCode = await getQrCodeDataUrl(session.email, secret);

  return NextResponse.json({ secret, qrCode });
}
