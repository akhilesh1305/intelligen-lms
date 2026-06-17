import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { SsoButtons } from "@/components/auth/sso-buttons";
import { LoginForm } from "./login-form";
import { getSession } from "@/lib/auth";
import { getEnabledSsoProviders } from "@/lib/security/sso";
import { AUTH_LOGIN_PERKS, AUTH_PAGE_IMAGES } from "@/lib/auth-images";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const { error: errorParam } = await searchParams;
  const ssoProviders = await getEnabledSsoProviders();

  const errorMessages: Record<string, string> = {
    admin_2fa_required:
      "Administrators must enable two-factor authentication before signing in.",
    ip_blocked: "Access denied from this IP address.",
    device_revoked: "This device has been revoked. Contact your administrator.",
    sso_failed: "Single sign-on failed. Please try again or use email login.",
    invalid_sso_state: "SSO session expired. Please try again.",
  };
  const error = errorParam
    ? (errorMessages[errorParam] ?? decodeURIComponent(errorParam))
    : null;

  return (
    <AuthPageShell
      image={AUTH_PAGE_IMAGES.login}
      imageAlt="Learners collaborating online"
      heroTitle="Welcome back"
      heroSubtitle="Sign in to continue your courses, games, and career growth."
      perks={AUTH_LOGIN_PERKS}
      title="Log in"
      subtitle={
        <>
          New to IntelliGen?{" "}
          <Link
            href="/register"
            className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            Sign up for free
          </Link>
        </>
      }
      error={error}
      sso={
        ssoProviders.length > 0 ? (
          <SsoButtons providers={ssoProviders} variant="light" />
        ) : undefined
      }
      footer={
        <Link href="/" className="hover:text-brand-600">
          ← Back to home
        </Link>
      }
    >
      <LoginForm />
    </AuthPageShell>
  );
}
