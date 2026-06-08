import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { LoginForm } from "./login-form";
import { getSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <div className="hidden w-1/2 bg-ink lg:flex lg:flex-col lg:justify-center lg:px-16">
        <Logo variant="full" size="lg" className="brightness-0 invert" />
        <h1 className="mt-12 text-4xl font-bold leading-tight text-white">
          Welcome back to your learning journey
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          Pick up where you left off. Your courses, progress, and goals are
          waiting for you.
        </p>
      </div>

      <div className="flex w-full items-center justify-center px-4 py-8 sm:py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <Logo variant="full" size="md" />
          </div>
          <h2 className="text-xl font-bold text-ink sm:text-2xl">Log in</h2>
          <p className="mt-2 text-muted">
            New to IntelliGen?{" "}
            <Link href="/register" className="font-semibold text-brand-600 hover:underline">
              Sign up for free
            </Link>
          </p>
          <div className="mt-6 rounded-sm border border-slate-200 bg-white p-5 shadow-card sm:mt-8 sm:p-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
