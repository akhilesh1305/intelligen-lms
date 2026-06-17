import { z } from "zod";
import { isValidPhoneInput, looksLikeEmail } from "@/lib/phone";

export const loginSchema = z
  .object({
    identifier: z.string().min(1, "Enter your email or mobile number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .superRefine((data, ctx) => {
    const value = data.identifier.trim();
    if (looksLikeEmail(value)) {
      if (!z.string().email().safeParse(value).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid email address",
          path: ["identifier"],
        });
      }
      return;
    }
    if (!isValidPhoneInput(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid mobile number (10–15 digits)",
        path: ["identifier"],
      });
    }
  });

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(7, "Enter a valid mobile number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["STUDENT"]).default("STUDENT"),
    privacyConsent: z.literal(true, {
      errorMap: () => ({ message: "You must accept the privacy policy" }),
    }),
    marketingConsent: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (!isValidPhoneInput(data.phoneNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid mobile number (10–15 digits)",
        path: ["phoneNumber"],
      });
    }
  });

export const adminCreateInstructorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const twoFactorCodeSchema = z.object({
  code: z.string().length(6, "Enter a 6-digit code"),
});

export const twoFactorVerifySchema = z.object({
  code: z.string().length(6, "Enter a 6-digit code"),
  method: z.enum(["authenticator", "email", "sms"]).default("authenticator"),
});

export const twoFactorBackupSendSchema = z
  .object({
    channel: z.enum(["email", "sms"]),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.channel === "email" && !data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required",
        path: ["email"],
      });
    }
    if (data.channel === "sms") {
      const phone = data.phone?.trim() ?? "";
      if (!phone || !/^[\d\s+\-().]{7,20}$/.test(phone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid phone number",
          path: ["phone"],
        });
      }
    }
  });

export const twoFactorBackupVerifySchema = z.object({
  channel: z.enum(["email", "sms"]),
  code: z.string().length(6, "Enter a 6-digit code"),
});

export const twoFactorBackupToggleSchema = z.object({
  channel: z.enum(["email", "sms"]),
  enabled: z.boolean(),
});

export const twoFactorSendCodeSchema = z.object({
  method: z.enum(["email", "sms"]),
});

export const coachProfileSchema = z.object({
  targetRole: z.string().max(120).optional().nullable(),
  careerGoal: z.string().max(200).optional().nullable(),
  department: z.string().max(120).optional().nullable(),
  experienceLevel: z.enum(["JUNIOR", "MID", "SENIOR", "LEAD"]).optional(),
  focusAreas: z.array(z.string().max(80)).max(8).optional(),
});

export const coachChatSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .max(20)
    .optional(),
});

export const securitySettingsSchema = z.object({
  ipRestrictionEnabled: z.boolean().optional(),
  allowedIps: z.array(z.string()).optional(),
  requireAdmin2fa: z.boolean().optional(),
  googleSsoEnabled: z.boolean().optional(),
  microsoftSsoEnabled: z.boolean().optional(),
  oktaSsoEnabled: z.boolean().optional(),
});

export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  published: z.boolean().optional(),
  priceInRupees: z.coerce.number().min(0).max(999999).optional(),
  skillLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  prerequisiteCourseId: z.string().optional().nullable(),
  organizationId: z.string().optional().nullable(),
});

export const organizationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2)
    .max(48)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens")
    .optional(),
  allowedDomains: z.array(z.string().min(3)).optional(),
  allowPublicCourses: z.boolean().optional(),
  contractStartsAt: z.string().nullable().optional(),
  contractEndsAt: z.string().nullable().optional(),
});

export const organizationTerminateSchema = z.object({
  confirm: z.literal(true),
  terminationNote: z.string().max(500).optional(),
});

export const orgAdminAccountSchema = z.object({
  name: z.string().min(2, "Admin name must be at least 2 characters"),
  email: z.string().email("Invalid admin email address"),
  employeeId: z.string().min(1, "Employee ID is required").max(64),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createOrganizationSchema = organizationSchema.extend({
  orgAdmin: orgAdminAccountSchema,
});

export const organizationMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2).optional(),
  employeeId: z.string().min(1, "Employee ID is required").max(64),
  role: z.enum(["ORG_ADMIN", "ORG_INSTRUCTOR", "ORG_LEARNER"]).default("ORG_LEARNER"),
});

export const skillAssessmentSchema = z.object({
  skillId: z.string().min(1),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
});

export const announcementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

export const aiCourseGenerateSchema = z.object({
  courseId: z.string().min(1),
  topic: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  moduleCount: z.coerce.number().int().min(1).max(6).default(3),
  lessonsPerModule: z.coerce.number().int().min(1).max(5).default(2),
  apply: z.boolean().optional(),
  outline: z
    .object({
      modules: z.array(
        z.object({
          title: z.string().min(2),
          summary: z.string().min(1),
          lessons: z.array(
            z.object({
              title: z.string().min(2),
              content: z.string().min(1),
              summary: z.string().min(1),
            })
          ),
        })
      ),
    })
    .optional(),
});

export const aiSummarizeSchema = z
  .object({
    lessonId: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    text: z.string().min(20).optional(),
  })
  .refine((data) => Boolean(data.lessonId || data.text), {
    message: "lessonId or text required",
  });

export const aiNarrateSchema = z.object({
  text: z.string().min(10).max(8000),
});

export const aiInterviewSchema = z.object({
  role: z.string().min(2),
  skills: z.array(z.string()).optional(),
  count: z.coerce.number().int().min(3).max(12).optional(),
});

export const aiCareerSchema = z.object({
  goal: z.string().min(3),
});

export const aiRoadmapSchema = z.object({
  goal: z.string().min(3),
});

export const aiEvaluateSchema = z.object({
  submissionId: z.string().min(1),
});

export const aiResumeSchema = z.object({
  careerGoal: z.string().optional(),
});

export const webinarSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  scheduledAt: z.string().min(1, "Date and time required"),
  durationMinutes: z.coerce.number().int().min(15).max(480).default(60),
  meetingUrl: z.string().url().optional().or(z.literal("")),
  courseId: z.string().optional().nullable(),
  maxAttendees: z.coerce.number().int().min(1).max(10000).optional().nullable(),
});

export const webinarAttendSchema = z.object({
  action: z.enum(["join", "leave"]),
});

export const moduleSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
});

export const lessonSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

const maritalStatusValues = [
  "SINGLE",
  "MARRIED",
  "DIVORCED",
  "WIDOWED",
  "SEPARATED",
  "PREFER_NOT_TO_SAY",
] as const;

export const profileSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z
      .string()
      .max(20, "Phone number is too long")
      .optional()
      .or(z.literal("")),
    dateOfBirth: z
      .string()
      .optional()
      .or(z.literal("")),
    maritalStatus: z.enum(maritalStatusValues).optional().nullable().or(z.literal("")),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => !data.newPassword || Boolean(data.currentPassword),
    {
      message: "Current password is required to set a new password",
      path: ["currentPassword"],
    }
  )
  .refine(
    (data) =>
      !data.phoneNumber || isValidPhoneInput(data.phoneNumber),
    {
      message: "Enter a valid phone number",
      path: ["phoneNumber"],
    }
  )
  .refine(
    (data) => {
      if (!data.dateOfBirth) return true;
      const parsed = new Date(data.dateOfBirth);
      if (Number.isNaN(parsed.getTime())) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return parsed <= today;
    },
    {
      message: "Date of birth cannot be in the future",
      path: ["dateOfBirth"],
    }
  );
