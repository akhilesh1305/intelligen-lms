import { db } from "./db";
import { getRazorpay, isRazorpayConfigured } from "./razorpay";

export const DEFAULT_PLANS = [
  {
    slug: "monthly-all-access",
    name: "Monthly All Access",
    description: "Unlimited access to all paid courses. Billed every month.",
    amountPaise: 49900,
    period: "monthly",
    interval: 1,
  },
  {
    slug: "yearly-all-access",
    name: "Yearly All Access",
    description: "Unlimited access to all paid courses. Best value — billed yearly.",
    amountPaise: 399900,
    period: "yearly",
    interval: 1,
  },
] as const;

export async function ensureSubscriptionPlans() {
  for (const plan of DEFAULT_PLANS) {
    await db.subscriptionPlan.upsert({
      where: { slug: plan.slug },
      create: plan,
      update: {
        name: plan.name,
        description: plan.description,
        amountPaise: plan.amountPaise,
        period: plan.period,
        interval: plan.interval,
        active: true,
      },
    });
  }
}

export async function syncPlanWithRazorpay(planId: string) {
  if (!isRazorpayConfigured()) return null;

  const plan = await db.subscriptionPlan.findUnique({ where: { id: planId } });
  if (!plan || plan.razorpayPlanId) return plan;

  const razorpay = getRazorpay();
  const created = await razorpay.plans.create({
    period: plan.period as "monthly" | "yearly",
    interval: plan.interval,
    item: {
      name: plan.name,
      amount: plan.amountPaise,
      currency: "INR",
      description: plan.description,
    },
  });

  return db.subscriptionPlan.update({
    where: { id: plan.id },
    data: { razorpayPlanId: created.id },
  });
}

export async function getActivePlans() {
  await ensureSubscriptionPlans();
  const plans = await db.subscriptionPlan.findMany({
    where: { active: true },
    orderBy: { amountPaise: "asc" },
  });

  if (isRazorpayConfigured()) {
    for (const plan of plans) {
      if (!plan.razorpayPlanId) {
        await syncPlanWithRazorpay(plan.id);
      }
    }
  }

  return db.subscriptionPlan.findMany({
    where: { active: true },
    orderBy: { amountPaise: "asc" },
  });
}
