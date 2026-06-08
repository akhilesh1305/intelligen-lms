import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { RegisterForm } from "./register-form";
import { getSession } from "@/lib/auth";

const perks = [
  "Access to all free courses",
  "Track your learning progress",
  "Learn at your own pace",
  "Join a community of learners",
];

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <div className="hidden w-1/2 bg-gradient-to-br from-brand-600 to-brand-800 lg:flex lg:flex-col lg:justify-center lg:px-16">
        <Logo variant="full" size="lg" className="brightness-0 invert" />
        <h1 className="mt-12 text-4xl font-bold leading-tight text-white">
          Start learning today — it&apos;s free
        </h1>
        <ul className="mt-8 space-y-4">
          {perks.map((perk) => (
            <li key={perk} className="flex items-center gap-3 text-white/90">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-200" />
              {perk}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex w-full items-center justify-center px-4 py-8 sm:py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <Logo variant="full" size="md" />
          </div>
          <h2 className="text-xl font-bold text-ink sm:text-2xl">Join for free</h2>
          <p className="mt-2 text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-600 hover:underline">
              Log in
            </Link>
          </p>
          <div className="mt-6 rounded-sm border border-slate-200 bg-white p-5 shadow-card sm:mt-8 sm:p-8">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
