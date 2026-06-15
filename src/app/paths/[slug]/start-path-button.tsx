"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function StartPathButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  async function handleStart() {
    setLoading(true);
    const res = await fetch(`/api/learning-paths/${slug}/start`, {
      method: "POST",
    });
    setLoading(false);
    if (res.ok) {
      setStarted(true);
      router.refresh();
    }
  }

  return (
    <Button onClick={handleStart} disabled={loading || started} variant="outline">
      {loading ? "Saving..." : started ? "Path tracked" : "Track this path"}
    </Button>
  );
}
