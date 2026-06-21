"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { RazorpayCheckout } from "@/components/payments/razorpay-checkout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatInr } from "@/lib/currency";
import { cn } from "@/lib/utils";

type Plan = {
  id: string;
  slug: string;
  name: string;
  description: string;
  amountPaise: number;
  period: string;
};

type PricingPlansProps = {
  plans: Plan[];
  paymentsEnabled: boolean;
  hasActiveSubscription: boolean;
  isLoggedIn: boolean;
};

const perks = [
  "Unlimited access to every paid course on IntelliGen LMS",
  "New courses included while your subscription is active",
  "Verifiable certificates when you complete courses",
  "Cancel anytime from your Razorpay account",
];

function PlanCard({
  plan,
  isLoggedIn,
  router,
  featured,
}: {
  plan: Plan;
  isLoggedIn: boolean;
  router: ReturnType<typeof useRouter>;
  featured?: boolean;
}) {
  const isYearly = plan.period === "yearly";

  return (
    <Card
      glass
      className={cn(
        "relative overflow-hidden rounded-[20px]",
        featured && "ring-2 ring-brand-500/40 shadow-card-hover"
      )}
    >
      {featured ? (
        <div className="bg-gradient-to-r from-brand-600 to-cyan-600 px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-white">
          Recommended · {isYearly ? "Best value" : "Flexible billing"}
        </div>
      ) : null}
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-xl font-bold text-ink">{plan.name}</h2>
          {featured ? <Badge variant="brand">Popular</Badge> : null}
        </div>
        <p className="mt-2 text-sm text-muted">{plan.description}</p>
        <p className="mt-6 text-4xl font-bold tracking-tight text-ink">
          {formatInr(plan.amountPaise)}
          <span className="text-base font-medium text-muted">
            /{isYearly ? "year" : "month"}
          </span>
        </p>
        <ul className="mt-6 space-y-3">
          {perks.map((perk) => (
            <li key={perk} className="flex gap-2 text-sm text-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
              {perk}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          {!isLoggedIn ? (
            <Button
              type="button"
              className="w-full"
              size="lg"
              onClick={() => router.push("/register")}
            >
              Start free trial
            </Button>
          ) : (
            <RazorpayCheckout
              label={`Subscribe ${isYearly ? "yearly" : "monthly"}`}
              className="w-full"
              onCheckout={async () => {
                const res = await fetch("/api/subscriptions/create", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ planSlug: plan.slug }),
                });
                const data = await res.json();
                if (!res.ok) {
                  throw new Error(data.error || "Could not start subscription");
                }
                return {
                  keyId: data.keyId,
                  subscriptionId: data.subscriptionId,
                  planName: data.planName,
                  userName: data.userName,
                  userEmail: data.userEmail,
                  recordId: data.recordId,
                };
              }}
              onSuccess={async (response, meta) => {
                const res = await fetch("/api/subscriptions/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...response,
                    recordId: meta.recordId,
                  }),
                });
                const data = await res.json();
                if (!res.ok) {
                  throw new Error(data.error || "Subscription verification failed");
                }
                router.push("/courses");
                router.refresh();
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function PricingPlans({
  plans,
  paymentsEnabled,
  hasActiveSubscription,
  isLoggedIn,
}: PricingPlansProps) {
  const router = useRouter();
  const monthlyPlan = plans.find((p) => p.period === "monthly");
  const yearlyPlan = plans.find((p) => p.period === "yearly");
  const hasBoth = Boolean(monthlyPlan && yearlyPlan);
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  const displayPlans = useMemo(() => {
    if (hasBoth) {
      const selected = billing === "yearly" ? yearlyPlan : monthlyPlan;
      return selected ? [selected] : plans;
    }
    return plans;
  }, [billing, hasBoth, monthlyPlan, plans, yearlyPlan]);

  if (hasActiveSubscription) {
    return (
      <Card glass className="rounded-[20px]">
        <CardContent className="py-12 text-center">
          <Badge variant="success" className="mb-4">
            Active subscription
          </Badge>
          <h2 className="text-2xl font-bold text-ink">You&apos;re on All Access</h2>
          <p className="mt-2 text-muted">
            Open any paid course and start learning — no extra purchase needed.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!paymentsEnabled) {
    return (
      <Card glass className="rounded-[20px]">
        <CardContent className="py-12 text-center text-muted">
          Subscription payments are being set up. Check back soon.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {hasBoth ? (
        <div className="flex justify-center">
          <div className="inline-flex rounded-[14px] border border-border bg-panel p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={cn(
                "rounded-[12px] px-5 py-2 text-sm font-semibold transition-colors",
                billing === "monthly"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-muted hover:text-ink"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={cn(
                "rounded-[12px] px-5 py-2 text-sm font-semibold transition-colors",
                billing === "yearly"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-muted hover:text-ink"
              )}
            >
              Yearly
              <span className="ml-1.5 text-xs font-bold text-emerald-500">Save</span>
            </button>
          </div>
        </div>
      ) : null}

      <div className={cn("grid gap-6", displayPlans.length > 1 ? "lg:grid-cols-2" : "max-w-lg mx-auto")}>
        {displayPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isLoggedIn={isLoggedIn}
            router={router}
            featured={plan.period === "yearly" || displayPlans.length === 1}
          />
        ))}
      </div>
    </div>
  );
}
