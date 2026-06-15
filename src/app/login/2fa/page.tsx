import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { getPending2FAUserId, getSession } from "@/lib/auth";
import { AUTH_PAGE_IMAGES } from "@/lib/auth-images";
import { TwoFactorForm } from "./two-factor-form";

export default async function TwoFactorPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const pendingUserId = await getPending2FAUserId();
  if (!pendingUserId) redirect("/login");

  return (
    <AuthPageShell
      image={AUTH_PAGE_IMAGES.twoFactor}
      imageAlt="Secure authentication"
      heroTitle="Extra layer of security"
      heroSubtitle="Your account is protected with two-factor authentication."
      perks={[
        "Verify with authenticator app",
        "Backup email or phone option",
        "Keeps your learning data safe",
      ]}
      title="Two-factor authentication"
      subtitle="Enter the code from your authenticator app, alternate email, or phone."
      footer={
        <Link href="/login" className="hover:text-brand-600">
          ← Back to login
        </Link>
      }
    >
      <TwoFactorForm />
    </AuthPageShell>
  );
}
