import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { completeCoursePurchase } from "@/lib/payments";
import { verifyOrderPayment } from "@/lib/razorpay";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
    courseId,
  } = body;

  if (!orderId || !paymentId || !signature || !courseId) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  if (!verifyOrderPayment(orderId, paymentId, signature)) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const payment = await db.payment.findFirst({
    where: {
      razorpayOrderId: orderId,
      userId: session.id,
      courseId,
    },
  });

  if (!payment) {
    return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
  }

  await completeCoursePurchase(session.id, courseId, payment.id, paymentId);

  return NextResponse.json({ success: true, courseId });
}
