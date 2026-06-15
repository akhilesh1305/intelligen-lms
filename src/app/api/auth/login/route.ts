import { NextResponse } from "next/server";
import { getUserByLoginIdentifier, verifyPassword } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { looksLikeEmail } from "@/lib/phone";
import { loginSchema } from "@/lib/validations";
import { joinOrganizationsByEmailDomain } from "@/lib/organizations";
import { completeLogin } from "@/lib/security/login";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { identifier, password } = parsed.data;
    const user = await getUserByLoginIdentifier(identifier);

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      await logAudit({
        action: "LOGIN_FAILED",
        userEmail: looksLikeEmail(identifier)
          ? identifier.toLowerCase()
          : undefined,
        metadata: { identifier: identifier.trim() },
        request,
      });

      return NextResponse.json(
        { error: "Invalid email, mobile number, or password" },
        { status: 401 }
      );
    }

    const result = await completeLogin(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      },
      request
    );

    if (result.status === "ip_blocked") {
      return NextResponse.json(
        { error: "Access denied from this IP address" },
        { status: 403 }
      );
    }

    if (result.status === "device_revoked") {
      return NextResponse.json(
        { error: "This device has been revoked. Contact your administrator." },
        { status: 403 }
      );
    }

    if (result.status === "requires_2fa") {
      return NextResponse.json({ requires2fa: true });
    }

    if (result.status === "admin_2fa_required") {
      return NextResponse.json(
        {
          error:
            "Administrators must enable two-factor authentication before signing in.",
        },
        { status: 403 }
      );
    }

    await joinOrganizationsByEmailDomain(user.id, user.email);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
