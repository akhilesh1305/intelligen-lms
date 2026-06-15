import { db } from "./db";
import { ensureEnrollment } from "./access";
import { assertPrerequisitesMet } from "./prerequisites";
import { createNotification } from "./notifications";
import { sendEnrollmentEmail } from "./email";

export async function completeCoursePurchase(
  userId: string,
  courseId: string,
  paymentId: string,
  razorpayPaymentId: string
) {
  const existing = await db.payment.findUnique({ where: { id: paymentId } });
  if (!existing || existing.status === "PAID") {
    return existing;
  }

  await db.payment.update({
    where: { id: paymentId },
    data: {
      status: "PAID",
      razorpayPaymentId,
      paidAt: new Date(),
    },
  });

  const prereqError = await assertPrerequisitesMet(userId, courseId);
  if (prereqError) {
    throw new Error(prereqError);
  }

  await ensureEnrollment(userId, courseId);

  const [user, course] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    db.course.findUnique({ where: { id: courseId } }),
  ]);

  if (user && course) {
    await sendEnrollmentEmail(user.email, user.name, course.title);
    await createNotification({
      userId,
      type: "PAYMENT_RECEIVED",
      title: "Payment successful",
      message: `You now have access to ${course.title}`,
      link: `/learn/${courseId}`,
    });
    await createNotification({
      userId,
      type: "ENROLLMENT",
      title: "Enrollment confirmed",
      message: `You're enrolled in ${course.title}`,
      link: `/learn/${courseId}`,
    });
  }

  return db.payment.findUnique({ where: { id: paymentId } });
}

export async function activateSubscription(
  userId: string,
  subscriptionRecordId: string,
  razorpaySubscriptionId: string,
  currentPeriodEnd?: Date | null
) {
  const record = await db.userSubscription.findUnique({
    where: { id: subscriptionRecordId },
    include: { plan: true },
  });
  if (!record) return null;

  await db.userSubscription.update({
    where: { id: subscriptionRecordId },
    data: {
      status: "ACTIVE",
      razorpaySubscriptionId,
      currentPeriodEnd: currentPeriodEnd ?? null,
    },
  });

  await createNotification({
    userId,
    type: "SUBSCRIPTION_ACTIVE",
    title: "Subscription active",
    message: `Your ${record.plan.name} plan is now active. Enjoy all paid courses!`,
    link: "/courses",
  });

  return db.userSubscription.findUnique({
    where: { id: subscriptionRecordId },
    include: { plan: true },
  });
}
