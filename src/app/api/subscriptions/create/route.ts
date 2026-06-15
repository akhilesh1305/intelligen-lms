import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/access";
import { db } from "@/lib/db";
import { getRazorpay, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";
import { getActivePlans, syncPlanWithRazorpay } from "@/lib/subscription-plans";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Payments are not configured yet" },
      { status: 503 }
    );
  }

  if (await hasActiveSubscription(session.id)) {
    return NextResponse.json(
      { error: "You already have an active subscription" },
      { status: 409 }
    );
  }

  const { planSlug } = await request.json();
  if (!planSlug) {
    return NextResponse.json({ error: "Plan slug required" }, { status: 400 });
  }

  await getActivePlans();
  let plan = await db.subscriptionPlan.findUnique({ where: { slug: planSlug } });
  if (!plan || !plan.active) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  if (!plan.razorpayPlanId) {
    plan = await syncPlanWithRazorpay(plan.id);
  }
  if (!plan?.razorpayPlanId) {
    return NextResponse.json(
      { error: "Could not prepare subscription plan" },
      { status: 500 }
    );
  }

  const razorpay = getRazorpay();
  const subscription = await razorpay.subscriptions.create({
    plan_id: plan.razorpayPlanId,
    total_count: plan.period === "yearly" ? 10 : 120,
    quantity: 1,
    customer_notify: 1,
    notes: {
      userId: session.id,
      planSlug: plan.slug,
    },
  });

  const record = await db.userSubscription.create({
    data: {
      userId: session.id,
      planId: plan.id,
      status: "CREATED",
      razorpaySubscriptionId: subscription.id,
      currentPeriodEnd: subscription.current_end
        ? new Date(subscription.current_end * 1000)
        : null,
    },
  });

  const user = await db.user.findUnique({ where: { id: session.id } });

  return NextResponse.json({
    keyId: getRazorpayKeyId(),
    subscriptionId: subscription.id,
    recordId: record.id,
    planName: plan.name,
    amountPaise: plan.amountPaise,
    userName: user?.name ?? session.name,
    userEmail: user?.email ?? session.email,
  });
}
