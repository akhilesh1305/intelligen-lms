import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activateSubscription, completeCoursePurchase } from "@/lib/payments";
import { verifyWebhookSignature } from "@/lib/razorpay";

export async function POST(request: Request) {
  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  if (!verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body) as {
    event: string;
    payload: {
      payment?: { entity: { id: string; order_id?: string; notes?: Record<string, string> } };
      subscription?: {
        entity: {
          id: string;
          current_end?: number;
          notes?: Record<string, string>;
        };
      };
    };
  };

  switch (event.event) {
    case "payment.captured": {
      const payment = event.payload.payment?.entity;
      if (!payment?.order_id) break;

      const record = await db.payment.findFirst({
        where: { razorpayOrderId: payment.order_id, status: "PENDING" },
      });
      if (record) {
        await completeCoursePurchase(
          record.userId,
          record.courseId,
          record.id,
          payment.id
        );
      }
      break;
    }
    case "subscription.activated":
    case "subscription.charged": {
      const sub = event.payload.subscription?.entity;
      if (!sub) break;

      const record = await db.userSubscription.findFirst({
        where: { razorpaySubscriptionId: sub.id },
      });
      if (record) {
        await activateSubscription(
          record.userId,
          record.id,
          sub.id,
          sub.current_end ? new Date(sub.current_end * 1000) : null
        );
      }
      break;
    }
    case "subscription.cancelled":
    case "subscription.completed": {
      const sub = event.payload.subscription?.entity;
      if (!sub) break;

      await db.userSubscription.updateMany({
        where: { razorpaySubscriptionId: sub.id },
        data: {
          status: event.event === "subscription.cancelled" ? "CANCELLED" : "COMPLETED",
        },
      });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
