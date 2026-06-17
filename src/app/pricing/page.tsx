import Link from "next/link";
import { Shield, Sparkles } from "lucide-react";
import { getSession } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/access";
import { getActivePlans } from "@/lib/subscription-plans";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { GradientOrbs } from "@/components/decorative/gradient-orbs";
import { PricingPlans } from "./pricing-plans";
import { PricingFaq } from "./pricing-faq";

export default async function PricingPage() {
  const session = await getSession();
  const plans = await getActivePlans();
  const subscribed = session ? await hasActiveSubscription(session.id) : false;

  return (
    <div className="relative overflow-hidden">
      <GradientOrbs variant="section" className="opacity-40" />

      <section className="relative border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Simple, transparent pricing
          </p>
          <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Unlock every course with{" "}
            <span className="gradient-text">All Access</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Subscribe once for unlimited paid courses, AI tools, certificates, and
            new content — or buy individual courses anytime.
          </p>
        </div>
      </section>

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[20px] border border-brand-200/80 bg-brand-50/80 px-5 py-4 text-sm text-brand-900 dark:border-brand-800 dark:bg-brand-950/30 dark:text-brand-100">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" />
            <p>
              Prefer a single course? Purchase from the course page. Subscriptions
              include all current and future paid courses while your plan is active.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <PricingPlans
            plans={plans}
            paymentsEnabled={isRazorpayConfigured()}
            hasActiveSubscription={subscribed}
            isLoggedIn={Boolean(session)}
          />
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand-500" />
            Secure Razorpay checkout
          </span>
          <span>Cancel anytime</span>
          <span>Certificates included</span>
        </div>

        <section className="mt-20">
          <h2 className="text-center text-2xl font-bold text-ink">Frequently asked questions</h2>
          <p className="mt-2 text-center text-muted">
            Everything you need to know before subscribing
          </p>
          <div className="mx-auto mt-10 max-w-2xl">
            <PricingFaq />
          </div>
        </section>

        <p className="mt-16 text-center text-sm text-muted">
          Payments are processed securely by{" "}
          <a
            href="https://razorpay.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            Razorpay
          </a>
          . Need help?{" "}
          <Link href="/courses" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
            Browse courses
          </Link>{" "}
          or{" "}
          <a
            href="mailto:hello@intelligenlms.com"
            className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            contact us
          </a>
          .
        </p>
      </div>
    </div>
  );
}
