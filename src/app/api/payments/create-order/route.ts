import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isFreeCourse } from "@/lib/currency";
import { db } from "@/lib/db";
import { getRazorpay, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";
import { hasPurchasedCourse, hasActiveSubscription } from "@/lib/access";
import { canUserViewCourse } from "@/lib/organizations";
import { assertPrerequisitesMet } from "@/lib/prerequisites";

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

  const { courseId } = await request.json();
  if (!courseId) {
    return NextResponse.json({ error: "Course ID required" }, { status: 400 });
  }

  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course || !course.published || course.status !== "APPROVED") {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const mayView = await canUserViewCourse(
    { id: session.id, role: session.role },
    course
  );
  if (!mayView) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  if (isFreeCourse(course.pricePaise)) {
    return NextResponse.json(
      { error: "This course is free — use enroll instead" },
      { status: 400 }
    );
  }

  if (await hasPurchasedCourse(session.id, courseId)) {
    return NextResponse.json({ error: "Already purchased" }, { status: 409 });
  }

  const prereqError = await assertPrerequisitesMet(session.id, courseId);
  if (prereqError) {
    return NextResponse.json({ error: prereqError }, { status: 403 });
  }

  if (await hasActiveSubscription(session.id)) {
    return NextResponse.json(
      { error: "Your subscription already includes this course" },
      { status: 409 }
    );
  }

  const existingEnrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.id, courseId } },
  });
  if (existingEnrollment) {
    return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
  }

  const razorpay = getRazorpay();
  const order = await razorpay.orders.create({
    amount: course.pricePaise,
    currency: "INR",
    receipt: `course_${courseId.slice(-8)}_${Date.now()}`,
    notes: {
      userId: session.id,
      courseId,
    },
  });

  const payment = await db.payment.create({
    data: {
      userId: session.id,
      courseId,
      amountPaise: course.pricePaise,
      currency: "INR",
      status: "PENDING",
      razorpayOrderId: order.id,
    },
  });

  const user = await db.user.findUnique({ where: { id: session.id } });

  return NextResponse.json({
    keyId: getRazorpayKeyId(),
    orderId: order.id,
    amount: course.pricePaise,
    currency: "INR",
    paymentId: payment.id,
    courseTitle: course.title,
    userName: user?.name ?? session.name,
    userEmail: user?.email ?? session.email,
  });
}
