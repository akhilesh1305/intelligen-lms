"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function OrganizationMemberActions({
  organizationId,
  userId,
  userName,
}: {
  organizationId: string;
  userId: string;
  userName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function removeMember() {
    if (!confirm(`Remove ${userName} from this organization?`)) return;
    setLoading(true);
    await fetch(`/api/admin/organizations/${organizationId}/members`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={loading}
      onClick={removeMember}
    >
      {loading ? "Removing…" : "Remove"}
    </Button>
  );
}
