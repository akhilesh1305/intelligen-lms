"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Save } from "lucide-react";
import { MaritalStatus, Role } from "@prisma/client";
import { formatOrgRole, formatRole } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const MARITAL_STATUS_OPTIONS: { value: MaritalStatus; label: string }[] = [
  { value: "SINGLE", label: "Single" },
  { value: "MARRIED", label: "Married" },
  { value: "DIVORCED", label: "Divorced" },
  { value: "WIDOWED", label: "Widowed" },
  { value: "SEPARATED", label: "Separated" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
];

const selectClassName =
  "flex h-11 w-full rounded-lg border border-border bg-panel px-3.5 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50";

type ProfileUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  maritalStatus: MaritalStatus | null;
  role: Role;
  points: number;
  createdAt: string;
};

type OrgMembershipInfo = {
  organizationName: string;
  employeeId: string | null;
  role: string;
};

export function ProfileForm({
  user,
  orgMemberships = [],
}: {
  user: ProfileUser;
  orgMemberships?: OrgMembershipInfo[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth ?? "");
  const [maritalStatus, setMaritalStatus] = useState(user.maritalStatus ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [detailsLoading, setDetailsLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [detailsSuccess, setDetailsSuccess] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [avatarSuccess, setAvatarSuccess] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

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
        phoneNumber,
        dateOfBirth,
        maritalStatus: maritalStatus || null,
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
    setPhoneNumber(data.user.phoneNumber ?? "");
    setDateOfBirth(
      data.user.dateOfBirth
        ? new Date(data.user.dateOfBirth).toISOString().slice(0, 10)
        : ""
    );
    setMaritalStatus(data.user.maritalStatus ?? "");
    setCurrentPassword("");
    setNewPassword("");
    setShowPasswordForm(false);
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
            <Badge variant="brand">{formatRole(user.role)}</Badge>
            <Badge>{user.points} points</Badge>
          </div>

          {orgMemberships.length > 0 ? (
            <div className="mt-4 w-full space-y-3 border-t border-border pt-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Organization
              </p>
              {orgMemberships.map((membership) => (
                <div
                  key={`${membership.organizationName}-${membership.employeeId ?? "none"}`}
                  className="rounded-lg border border-border bg-surface/50 px-3 py-2.5"
                >
                  <p className="text-sm font-semibold text-ink">
                    {membership.organizationName}
                  </p>
                  <dl className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted">Employee ID</dt>
                      <dd className="font-mono font-medium text-ink">
                        {membership.employeeId ?? "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted">Org role</dt>
                      <dd>
                        <Badge variant="brand" className="text-[10px]">
                          {formatOrgRole(membership.role)}
                        </Badge>
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          ) : null}

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
          <p className="text-sm text-muted">
            Update your personal information, email, or password
          </p>
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

            {orgMemberships.length > 0 ? (
              <div className="rounded-lg border border-border bg-surface/50 p-4">
                <h3 className="text-sm font-semibold text-ink">Organization details</h3>
                <p className="mt-1 text-xs text-muted">
                  Managed by your organization admin — contact them to update
                </p>
                <div className="mt-4 space-y-3">
                  {orgMemberships.map((membership) => (
                    <div
                      key={`details-${membership.organizationName}-${membership.employeeId ?? "none"}`}
                      className="rounded-md border border-border/70 bg-panel px-3 py-3"
                    >
                      <p className="text-sm font-medium text-ink">
                        {membership.organizationName}
                      </p>
                      <div className="mt-2 grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold text-muted">Employee ID</p>
                          <p className="mt-0.5 font-mono text-sm text-ink">
                            {membership.employeeId ?? "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted">Organization role</p>
                          <p className="mt-0.5 text-sm text-ink">
                            {formatOrgRole(membership.role)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="rounded-lg border border-border bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-ink">Personal information</h3>
              <p className="mt-1 text-xs text-muted">
                Phone number, date of birth, and marital status
              </p>

              <div className="mt-4 space-y-4">
                <PhoneInput
                  id="phoneNumber"
                  label="Phone number"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  defaultCountry="IN"
                  helperText="Used for sign-in with your mobile number."
                />

                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  label="Date of birth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  autoComplete="bday"
                />

                <div className="space-y-1.5">
                  <label htmlFor="maritalStatus" className="block text-sm font-semibold text-ink">
                    Marital status
                  </label>
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Select status</option>
                    {MARITAL_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-5">
              {!showPasswordForm ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto px-0 py-0 text-sm font-medium text-brand-600 hover:bg-transparent hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                  onClick={() => setShowPasswordForm(true)}
                >
                  Change password
                </Button>
              ) : (
                <div className="rounded-lg border border-border bg-surface/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-ink">Change password</h3>
                      <p className="mt-1 text-xs text-muted">
                        Enter your current password, then choose a new one
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto shrink-0 px-2 py-1 text-xs text-muted"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setCurrentPassword("");
                        setNewPassword("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>

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
              )}
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
