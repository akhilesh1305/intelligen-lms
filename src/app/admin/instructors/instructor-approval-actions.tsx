"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function InstructorApprovalActions({ instructorId }: { instructorId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function handleAction(approved: boolean) {
    setLoading(approved ? "approve" : "reject");

    let reason: string | undefined;
    if (!approved) {
      reason = prompt("Rejection reason (optional):") ?? undefined;
    }

    const res = await fetch(`/api/admin/instructors/${instructorId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved, reason }),
    });

    setLoading(null);

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Action failed");
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={() => handleAction(true)}
        disabled={!!loading}
      >
        {loading === "approve" ? "..." : "Approve"}
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => handleAction(false)}
        disabled={!!loading}
      >
        {loading === "reject" ? "..." : "Reject"}
      </Button>
    </div>
  );
}
