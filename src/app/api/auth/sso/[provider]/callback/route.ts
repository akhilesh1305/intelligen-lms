import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { publicRedirect } from "@/lib/request-url";
import {
  exchangeSsoCode,
  parseSsoProvider,
  verifySsoState,
} from "@/lib/security/sso";
import { completeLogin } from "@/lib/security/login";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: providerParam } = await params;
  const provider = parseSsoProvider(providerParam);
  const url = new URL(request.url);

  if (!provider) {
    return NextResponse.redirect(publicRedirect("/login?error=invalid_provider", request));
  }

  const error = url.searchParams.get("error");
  if (error) {
    return NextResponse.redirect(
      publicRedirect(`/login?error=${encodeURIComponent(error)}`, request)
    );
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state || !(await verifySsoState(provider, state))) {
    return NextResponse.redirect(publicRedirect("/login?error=invalid_sso_state", request));
  }

  try {
    const profile = await exchangeSsoCode(provider, code);

    let user = await db.user.findFirst({
      where: {
        OR: [
          { ssoProvider: provider, ssoSubjectId: profile.subjectId },
          { email: profile.email },
        ],
      },
    });

    if (!user) {
      const passwordHash = await hashPassword(crypto.randomUUID());
      user = await db.user.create({
        data: {
          name: profile.name,
          email: profile.email,
          passwordHash,
          role: "STUDENT",
          ssoProvider: provider,
          ssoSubjectId: profile.subjectId,
          privacyConsentAt: new Date(),
        },
      });
    } else if (!user.ssoProvider || !user.ssoSubjectId) {
      user = await db.user.update({
        where: { id: user.id },
        data: { ssoProvider: provider, ssoSubjectId: profile.subjectId },
      });
    }

    const result = await completeLogin(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      },
      request,
      { auditAction: "SSO_LOGIN", skip2fa: false }
    );

    if (result.status === "requires_2fa") {
      return NextResponse.redirect(publicRedirect("/login/2fa", request));
    }

    if (result.status === "admin_2fa_required") {
      return NextResponse.redirect(
        publicRedirect("/login?error=admin_2fa_required", request)
      );
    }

    if (result.status === "ip_blocked") {
      return NextResponse.redirect(publicRedirect("/login?error=ip_blocked", request));
    }

    if (result.status === "device_revoked") {
      return NextResponse.redirect(
        publicRedirect("/login?error=device_revoked", request)
      );
    }

    return NextResponse.redirect(publicRedirect("/dashboard", request));
  } catch {
    return NextResponse.redirect(publicRedirect("/login?error=sso_failed", request));
  }
}
