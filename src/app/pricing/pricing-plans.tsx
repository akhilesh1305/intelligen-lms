"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { RazorpayCheckout } from "@/components/payments/razorpay-checkout";
import { Badge } from "@/components/ui/badge";
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
  "Access every paid course on IntelliGen LMS",
  "New courses included while subscribed",
  "Certificates on course completion",
  "Cancel anytime from your Razorpay account",
];

export function PricingPlans({
  plans,
  paymentsEnabled,
  hasActiveSubscription,
  isLoggedIn,
}: PricingPlansProps) {
  const router = useRouter();

  if (hasActiveSubscription) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
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
      <Card>
        <CardContent className="py-10 text-center text-muted">
          Subscription payments are being set up. Check back soon.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {plans.map((plan) => {
        const isYearly = plan.period === "yearly";
        return (
          <Card
            key={plan.id}
            className={cn(
              "relative overflow-hidden",
              isYearly && "border-brand-300 shadow-elevated"
            )}
          >
            {isYearly ? (
              <div className="bg-brand-600 px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-white">
                Best value
              </div>
            ) : null}
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-ink">{plan.name}</h2>
              <p className="mt-2 text-sm text-muted">{plan.description}</p>
              <p className="mt-6 text-4xl font-bold text-ink">
                {formatInr(plan.amountPaise)}
                <span className="text-base font-medium text-muted">
                  /{plan.period === "yearly" ? "year" : "month"}
                </span>
              </p>
              <ul className="mt-6 space-y-3">
                {perks.map((perk) => (
                  <li key={perk} className="flex gap-2 text-sm text-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    {perk}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                {!isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="w-full rounded-sm bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700"
                  >
                    Log in to subscribe
                  </button>
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
      })}
    </div>
  );
}
