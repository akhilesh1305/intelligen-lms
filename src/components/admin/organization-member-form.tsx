"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function OrganizationMemberForm({ organizationId }: { organizationId: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [role, setRole] = useState<"ORG_LEARNER" | "ORG_INSTRUCTOR" | "ORG_ADMIN">(
    "ORG_LEARNER"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/admin/organizations/${organizationId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, employeeId, role }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to add member");
      return;
    }

    setEmail("");
    setName("");
    setEmployeeId("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="member-email" className="text-sm font-medium text-ink">
          User email
        </label>
        <Input
          id="member-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="employee@acme.com"
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="member-name" className="text-sm font-medium text-ink">
          Full name
        </label>
        <Input
          id="member-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="member-employee-id" className="text-sm font-medium text-ink">
          Employee ID
        </label>
        <Input
          id="member-employee-id"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          placeholder="EMP-1001"
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="member-role" className="text-sm font-medium text-ink">
          Organization role
        </label>
        <select
          id="member-role"
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "ORG_LEARNER" | "ORG_INSTRUCTOR" | "ORG_ADMIN")
          }
          className="mt-1 w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm"
        >
          <option value="ORG_LEARNER">Learner</option>
          <option value="ORG_INSTRUCTOR">Instructor (can create org courses)</option>
          <option value="ORG_ADMIN">Admin</option>
        </select>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={loading}>
        {loading ? "Adding…" : "Add member"}
      </Button>
    </form>
  );
}
