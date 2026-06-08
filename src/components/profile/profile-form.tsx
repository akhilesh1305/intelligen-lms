"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Save } from "lucide-react";
import { Role } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type ProfileUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: Role;
  points: number;
  createdAt: string;
};

export function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [detailsLoading, setDetailsLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [detailsSuccess, setDetailsSuccess] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [avatarSuccess, setAvatarSuccess] = useState("");

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError("");
    setAvatarSuccess("");
    setAvatarLoading(true);

    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch("/api/profile/avatar", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setAvatarLoading(false);

    if (!res.ok) {
      setAvatarError(data.error || "Failed to upload photo");
      return;
    }

    setAvatarUrl(`${data.user.avatarUrl}?t=${Date.now()}`);
    setAvatarSuccess("Profile picture updated.");
    router.refresh();
    window.location.reload();
  }

  async function handleDetailsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDetailsError("");
    setDetailsSuccess("");
    setDetailsLoading(true);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      }),
    });

    const data = await res.json();
    setDetailsLoading(false);

    if (!res.ok) {
      setDetailsError(data.error || "Failed to update profile");
      return;
    }

    setName(data.user.name);
    setEmail(data.user.email);
    setCurrentPassword("");
    setNewPassword("");
    setDetailsSuccess("Profile updated successfully.");
    router.refresh();
    window.location.reload();
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <Card>
        <CardContent className="flex flex-col items-center pt-8 text-center">
          <div className="relative">
            <UserAvatar
              name={name}
              avatarUrl={avatarUrl}
              size="xl"
              className="ring-4 ring-brand-50"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarLoading}
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white shadow-md transition-colors hover:bg-brand-700 disabled:opacity-50"
              aria-label="Upload profile picture"
            >
              {avatarLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <h2 className="mt-4 text-lg font-bold text-ink">{name}</h2>
          <p className="text-sm text-muted">{email}</p>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Badge variant="brand">{user.role}</Badge>
            <Badge>{user.points} points</Badge>
          </div>

          <p className="mt-4 text-xs text-muted">Member since {joinedDate}</p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            disabled={avatarLoading}
            onClick={() => fileInputRef.current?.click()}
          >
            {avatarLoading ? "Uploading..." : "Change photo"}
          </Button>

          <p className="mt-2 text-xs text-muted">JPEG, PNG, WebP, or GIF · Max 2MB</p>

          {avatarError && (
            <p className="mt-3 w-full rounded-sm bg-red-50 px-3 py-2 text-sm text-red-700">
              {avatarError}
            </p>
          )}
          {avatarSuccess && (
            <p className="mt-3 w-full rounded-sm bg-green-50 px-3 py-2 text-sm text-green-700">
              {avatarSuccess}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-ink">Account details</h2>
          <p className="text-sm text-muted">Update your name, email, or password</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDetailsSubmit} className="space-y-5">
            {detailsError && (
              <p className="rounded-sm bg-red-50 px-3 py-2 text-sm text-red-700">
                {detailsError}
              </p>
            )}
            {detailsSuccess && (
              <p className="rounded-sm bg-green-50 px-3 py-2 text-sm text-green-700">
                {detailsSuccess}
              </p>
            )}

            <Input
              id="name"
              name="name"
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-sm font-semibold text-ink">Change password</h3>
              <p className="mt-1 text-xs text-muted">Leave blank to keep your current password</p>

              <div className="mt-4 space-y-4">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  label="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  label="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button type="submit" disabled={detailsLoading}>
              {detailsLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
