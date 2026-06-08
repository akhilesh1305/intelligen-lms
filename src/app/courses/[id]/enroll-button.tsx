"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EnrollButton({
  courseId,
  className,
}: {
  courseId: string;
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleEnroll() {
    setLoading(true);
    const res = await fetch("/api/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    setLoading(false);

    if (res.ok) {
      router.push(`/learn/${courseId}`);
      router.refresh();
    }
  }

  return (
    <Button
      onClick={handleEnroll}
      disabled={loading}
      size="lg"
      className={cn("w-full", className)}
    >
      {loading ? "Enrolling..." : "Enroll for Free"}
    </Button>
  );
}
