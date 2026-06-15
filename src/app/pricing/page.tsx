import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getSession } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/access";
import { getActivePlans } from "@/lib/subscription-plans";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { SectionHeader } from "@/components/ui/section-header";
import { PricingPlans } from "./pricing-plans";

export default async function PricingPage() {
  const session = await getSession();
  const plans = await getActivePlans();
  const subscribed = session ? await hasActiveSubscription(session.id) : false;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="All Access plans"
        description="Subscribe once and unlock every paid course. Free courses stay free forever."
      />

      <div className="mt-8 rounded-sm border border-brand-200 bg-brand-50 px-5 py-4 text-sm text-brand-800">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Prefer a single course? Buy it individually from the course page.
            Subscriptions include all current and future paid courses while your plan is active.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <PricingPlans
          plans={plans}
          paymentsEnabled={isRazorpayConfigured()}
          hasActiveSubscription={subscribed}
          isLoggedIn={Boolean(session)}
        />
      </div>

      <p className="mt-10 text-center text-sm text-muted">
        Payments are processed securely by{" "}
        <a
          href="https://razorpay.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand-600 hover:underline"
        >
          Razorpay
        </a>
        . Need help?{" "}
        <Link href="/courses" className="font-semibold text-brand-600 hover:underline">
          Browse courses
        </Link>
      </p>
    </div>
  );
}
