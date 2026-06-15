import { db } from "./db";
import { isFreeCourse } from "./currency";

export type CourseAccess = {
  enrolled: boolean;
  purchased: boolean;
  hasSubscription: boolean;
  canLearn: boolean;
  isFree: boolean;
};

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const sub = await db.userSubscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      OR: [
        { currentPeriodEnd: null },
        { currentPeriodEnd: { gt: new Date() } },
      ],
    },
  });
  return Boolean(sub);
}

export async function hasPurchasedCourse(
  userId: string,
  courseId: string
): Promise<boolean> {
  const payment = await db.payment.findFirst({
    where: { userId, courseId, status: "PAID" },
  });
  return Boolean(payment);
}

export async function getCourseAccess(
  userId: string,
  courseId: string,
  role: string
): Promise<CourseAccess> {
  if (role !== "STUDENT") {
    return {
      enrolled: true,
      purchased: true,
      hasSubscription: true,
      canLearn: true,
      isFree: true,
    };
  }

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { pricePaise: true },
  });
  if (!course) {
    return {
      enrolled: false,
      purchased: false,
      hasSubscription: false,
      canLearn: false,
      isFree: true,
    };
  }

  const enrolled = Boolean(
    await db.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    })
  );

  const isFree = isFreeCourse(course.pricePaise);
  const purchased = await hasPurchasedCourse(userId, courseId);
  const hasSubscription =
    !isFree && (await hasActiveSubscription(userId));

  const canLearn =
    enrolled || isFree || purchased || hasSubscription;

  return { enrolled, purchased, hasSubscription, canLearn, isFree };
}

export async function ensureEnrollment(userId: string, courseId: string) {
  const existing = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) return existing;

  return db.enrollment.create({
    data: { userId, courseId },
  });
}
