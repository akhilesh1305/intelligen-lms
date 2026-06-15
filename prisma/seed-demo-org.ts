import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const DEMO_ORG = {
  name: "Acme Corporation",
  slug: "acme",
  allowedDomains: ["acme.intelligen.lms"],
  allowPublicCourses: false,
};

const DEMO_PASSWORD = "password123";

const DEMO_MEMBERS = [
  {
    email: "org.admin@intelligen.lms",
    name: "Sam Rivera",
    employeeId: "EMP-1001",
    orgRole: "ORG_ADMIN" as const,
    platformRole: "STUDENT" as const,
    instructorStatus: null,
  },
  {
    email: "org.instructor@intelligen.lms",
    name: "Taylor Chen",
    employeeId: "EMP-1002",
    orgRole: "ORG_INSTRUCTOR" as const,
    platformRole: "INSTRUCTOR" as const,
    instructorStatus: "APPROVED" as const,
  },
  {
    email: "org.learner@intelligen.lms",
    name: "Casey Morgan",
    employeeId: "EMP-1003",
    orgRole: "ORG_LEARNER" as const,
    platformRole: "STUDENT" as const,
    instructorStatus: null,
  },
];

export async function seedDemoOrganization() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const org = await db.organization.upsert({
    where: { slug: DEMO_ORG.slug },
    create: DEMO_ORG,
    update: {
      name: DEMO_ORG.name,
      allowedDomains: [...DEMO_ORG.allowedDomains],
      allowPublicCourses: DEMO_ORG.allowPublicCourses,
    },
  });

  const users: Record<string, string> = {};

  for (const member of DEMO_MEMBERS) {
    const user = await db.user.upsert({
      where: { email: member.email },
      update: {
        name: member.name,
        role: member.platformRole,
        ...(member.instructorStatus
          ? { instructorStatus: member.instructorStatus }
          : {}),
      },
      create: {
        email: member.email,
        name: member.name,
        passwordHash,
        role: member.platformRole,
        instructorStatus: member.instructorStatus,
      },
    });

    await db.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: org.id,
          userId: user.id,
        },
      },
      create: {
        organizationId: org.id,
        userId: user.id,
        employeeId: member.employeeId,
        role: member.orgRole,
      },
      update: {
        employeeId: member.employeeId,
        role: member.orgRole,
      },
    });

    users[member.email] = user.id;
  }

  const instructorId = users["org.instructor@intelligen.lms"];
  const learnerId = users["org.learner@intelligen.lms"];

  const existingCourse = await db.course.findFirst({
    where: {
      title: "Acme Security & Compliance Onboarding",
      organizationId: org.id,
    },
  });

  if (!existingCourse) {
    const course = await db.course.create({
      data: {
        title: "Acme Security & Compliance Onboarding",
        description:
          "Private Acme-only training on security policies, data handling, and workplace compliance. Visible only to Acme Corporation members.",
        published: true,
        status: "APPROVED",
        visibility: "ORGANIZATION",
        organizationId: org.id,
        instructorId,
        skillLevel: "BEGINNER",
        modules: {
          create: [
            {
              title: "Security essentials",
              order: 1,
              lessons: {
                create: [
                  {
                    title: "Welcome to Acme",
                    order: 1,
                    content:
                      "Welcome to Acme Corporation's private learning workspace.\n\nThis course covers the security and compliance basics every employee must complete during onboarding.",
                  },
                  {
                    title: "Password and access hygiene",
                    order: 2,
                    content:
                      "Use unique passwords, enable MFA where available, and never share credentials.\n\nReport suspicious access attempts to IT immediately.",
                  },
                ],
              },
            },
            {
              title: "Data handling",
              order: 2,
              lessons: {
                create: [
                  {
                    title: "Classifying company data",
                    order: 1,
                    content:
                      "Acme data is classified as Public, Internal, Confidential, or Restricted.\n\nOnly share data on approved channels and follow the least-privilege principle.",
                  },
                ],
              },
            },
          ],
        },
      },
    });

    await db.enrollment.upsert({
      where: {
        userId_courseId: { userId: learnerId, courseId: course.id },
      },
      create: {
        userId: learnerId,
        courseId: course.id,
        progressPercent: 33,
      },
      update: { progressPercent: 33 },
    });

    const firstLesson = await db.lesson.findFirst({
      where: { module: { courseId: course.id } },
      orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
    });

    if (firstLesson) {
      await db.lessonProgress.upsert({
        where: {
          userId_lessonId: { userId: learnerId, lessonId: firstLesson.id },
        },
        create: {
          userId: learnerId,
          lessonId: firstLesson.id,
          completed: true,
          completedAt: new Date(),
        },
        update: {
          completed: true,
          completedAt: new Date(),
        },
      });
    }

    console.log("  + Acme private org course");
  }

  console.log("Demo organization accounts (password: password123):");
  console.log(`  Org:        ${DEMO_ORG.name} → /org/${DEMO_ORG.slug}`);
  for (const member of DEMO_MEMBERS) {
    console.log(
      `  ${member.orgRole.replace("ORG_", "").padEnd(11)} ${member.email} (${member.employeeId})`
    );
  }

  return org;
}

async function main() {
  console.log("Seeding demo organization...");
  await seedDemoOrganization();
  console.log("Done.");
}

const invokedDirectly =
  typeof require !== "undefined" &&
  typeof require.main !== "undefined" &&
  require.main === module;

if (invokedDirectly) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => db.$disconnect());
}
