"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ApprovalActions({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function handleAction(approved: boolean) {
    setLoading(approved ? "approve" : "reject");

    let reason: string | undefined;
    if (!approved) {
      reason = prompt("Rejection reason (optional):") ?? undefined;
    }

    await fetch(`/api/courses/${courseId}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved, reason }),
    });

    setLoading(null);
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
