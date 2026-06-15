"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreateOrganizationForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [domains, setDomains] = useState("");
  const [allowPublic, setAllowPublic] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminEmployeeId, setAdminEmployeeId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const allowedDomains = domains
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    const res = await fetch("/api/admin/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        allowedDomains,
        allowPublicCourses: allowPublic,
        orgAdmin: {
          name: adminName,
          email: adminEmail,
          employeeId: adminEmployeeId,
          password: adminPassword,
        },
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to create organization");
      return;
    }

    router.push(`/admin/organizations/${data.organization.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="org-name" className="text-sm font-medium text-ink">
            Company name
          </label>
          <Input
            id="org-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Corporation"
            required
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="org-domains" className="text-sm font-medium text-ink">
            Allowed email domains (optional)
          </label>
          <Input
            id="org-domains"
            value={domains}
            onChange={(e) => setDomains(e.target.value)}
            placeholder="acme.com, acme.co.in"
            className="mt-1"
          />
          <p className="mt-1 text-xs text-muted">
            Users with these domains auto-join as learners on register/login.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={allowPublic}
            onChange={(e) => setAllowPublic(e.target.checked)}
            className="rounded border-border"
          />
          Members can also see public platform courses
        </label>
      </div>

      <div className="rounded-xl border border-border bg-surface/60 p-4">
        <div className="mb-4 flex items-center gap-2">
          <UserCog className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-sm font-bold text-ink">Organization admin account</h3>
        </div>
        <p className="mb-4 text-xs text-muted">
          Creates the first admin who can access the private org analytics dashboard
          and manage members.
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="admin-name" className="text-sm font-medium text-ink">
              Full name
            </label>
            <Input
              id="admin-name"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="Jane Admin"
              required
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="admin-email" className="text-sm font-medium text-ink">
              Email
            </label>
            <Input
              id="admin-email"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@acme.com"
              required
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="admin-employee-id"
              className="text-sm font-medium text-ink"
            >
              Employee ID
            </label>
            <Input
              id="admin-employee-id"
              value={adminEmployeeId}
              onChange={(e) => setAdminEmployeeId(e.target.value)}
              placeholder="EMP-1001"
              required
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="text-sm font-medium text-ink"
            >
              Password
            </label>
            <Input
              id="admin-password"
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-muted">
              The admin uses this to sign in and open the org dashboard.
            </p>
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Creating…" : "Create organization"}
      </Button>
    </form>
  );
}
