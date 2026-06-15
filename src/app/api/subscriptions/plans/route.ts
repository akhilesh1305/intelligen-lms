import { NextResponse } from "next/server";
import { getActivePlans } from "@/lib/subscription-plans";
import { getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";
import { hasActiveSubscription } from "@/lib/access";
import { getSession } from "@/lib/auth";

export async function GET() {
  const plans = await getActivePlans();
  const session = await getSession();
  const subscribed = session ? await hasActiveSubscription(session.id) : false;

  return NextResponse.json({
    plans: plans.map((plan) => ({
      id: plan.id,
      slug: plan.slug,
      name: plan.name,
      description: plan.description,
      amountPaise: plan.amountPaise,
      period: plan.period,
    })),
    paymentsEnabled: isRazorpayConfigured(),
    keyId: isRazorpayConfigured() ? getRazorpayKeyId() : null,
    hasActiveSubscription: subscribed,
  });
}
