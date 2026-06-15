import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { activateSubscription } from "@/lib/payments";
import { verifySubscriptionPayment } from "@/lib/razorpay";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    razorpay_subscription_id: subscriptionId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
    recordId,
  } = body;

  if (!subscriptionId || !paymentId || !signature || !recordId) {
    return NextResponse.json({ error: "Missing subscription details" }, { status: 400 });
  }

  if (!verifySubscriptionPayment(subscriptionId, paymentId, signature)) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const record = await db.userSubscription.findFirst({
    where: {
      id: recordId,
      userId: session.id,
      razorpaySubscriptionId: subscriptionId,
    },
  });

  if (!record) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }

  await activateSubscription(session.id, record.id, subscriptionId, record.currentPeriodEnd);

  return NextResponse.json({ success: true });
}
