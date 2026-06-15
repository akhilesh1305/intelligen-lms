import { NextResponse } from "next/server";
import { publicRedirect } from "@/lib/request-url";
import { getSsoAuthorizationUrl, parseSsoProvider } from "@/lib/security/sso";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: providerParam } = await params;
  const provider = parseSsoProvider(providerParam);

  if (!provider) {
    return NextResponse.json({ error: "Invalid SSO provider" }, { status: 400 });
  }

  try {
    const url = await getSsoAuthorizationUrl(provider);
    return NextResponse.redirect(url);
  } catch (err) {
    const message = err instanceof Error ? err.message : "SSO unavailable";
    return NextResponse.redirect(
      publicRedirect(`/login?error=${encodeURIComponent(message)}`, request)
    );
  }
}
