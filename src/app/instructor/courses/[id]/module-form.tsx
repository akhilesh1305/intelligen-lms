"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ModuleForm({
  courseId,
  nextOrder,
}: {
  courseId: string;
  nextOrder: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    await fetch(`/api/courses/${courseId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        order: nextOrder,
      }),
    });

    setLoading(false);
    router.refresh();
    (e.target as HTMLFormElement).reset();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        name="title"
        placeholder="Module title"
        required
        className="flex-1"
      />
      <Button type="submit" size="sm" disabled={loading}>
        {loading ? "Adding..." : "Add"}
      </Button>
    </form>
  );
}
