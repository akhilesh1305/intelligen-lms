import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { RegisterForm } from "./register-form";
import { getSession } from "@/lib/auth";
import { AUTH_PAGE_IMAGES, AUTH_REGISTER_PERKS } from "@/lib/auth-images";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <AuthPageShell
      image={AUTH_PAGE_IMAGES.register}
      imageAlt="Students learning in a classroom"
      heroTitle="Start learning today — it's free"
      heroSubtitle="Join thousands of learners building skills with expert-led courses."
      perks={AUTH_REGISTER_PERKS}
      title="Join for free"
      subtitle={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
            Log in
          </Link>
        </>
      }
      footer={
        <Link href="/" className="hover:text-brand-600">
          ← Back to home
        </Link>
      }
    >
      <RegisterForm />
    </AuthPageShell>
  );
}
