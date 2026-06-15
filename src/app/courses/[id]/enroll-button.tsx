"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RazorpayCheckout } from "@/components/payments/razorpay-checkout";
import { cn } from "@/lib/utils";

type EnrollButtonProps = {
  courseId: string;
  pricePaise: number;
  paymentsEnabled: boolean;
  className?: string;
};

export function EnrollButton({
  courseId,
  pricePaise,
  paymentsEnabled,
  className,
}: EnrollButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isFree = pricePaise <= 0;

  async function handleFreeEnroll() {
    setError("");
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
      return;
    }

    const data = await res.json();
    setError(data.error || "Enrollment failed");
  }

  if (isFree) {
    return (
      <div>
        <Button
          onClick={handleFreeEnroll}
          disabled={loading}
          size="lg"
          className={cn("w-full", className)}
        >
          {loading ? "Enrolling..." : "Enroll for Free"}
        </Button>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </div>
    );
  }

  if (!paymentsEnabled) {
    return (
      <Button disabled size="lg" className={cn("w-full", className)}>
        Payments coming soon
      </Button>
    );
  }

  return (
    <RazorpayCheckout
      label="Buy this course"
      className={cn("w-full", className)}
      onCheckout={async () => {
        const res = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Could not start payment");
        }
        return {
          keyId: data.keyId,
          amount: data.amount,
          currency: data.currency,
          orderId: data.orderId,
          courseTitle: data.courseTitle,
          userName: data.userName,
          userEmail: data.userEmail,
          courseId,
        };
      }}
      onSuccess={async (response) => {
        const res = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...response, courseId }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Payment verification failed");
        }
        router.push(`/learn/${courseId}`);
      }}
    />
  );
}
