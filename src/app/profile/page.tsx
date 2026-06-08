import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage() {
  const session = await requireAuth();

  const user = await db.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      role: true,
      points: true,
      createdAt: true,
    },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="mt-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-ink">
          <User className="h-6 w-6 text-brand-600" />
          Profile settings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage your profile picture and account details
        </p>
      </div>

      <div className="mt-8">
        <ProfileForm
          user={{
            ...user,
            createdAt: user.createdAt.toISOString(),
          }}
        />
      </div>
    </div>
  );
}
