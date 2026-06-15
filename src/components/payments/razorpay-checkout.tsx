"use client";

import { useCallback, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RazorpayHandlerResponse = {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature: string;
};

type RazorpayCheckoutProps = {
  label: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline" | "accent";
  disabled?: boolean;
  onCheckout: () => Promise<{
    keyId: string;
    amount?: number;
    currency?: string;
    orderId?: string;
    subscriptionId?: string;
    courseTitle?: string;
    planName?: string;
    userName: string;
    userEmail: string;
    courseId?: string;
    recordId?: string;
  }>;
  onSuccess: (response: RazorpayHandlerResponse, meta: { courseId?: string; recordId?: string }) => Promise<void>;
};

export function RazorpayCheckout({
  label,
  className,
  size = "md",
  variant = "primary",
  disabled,
  onCheckout,
  onSuccess,
}: RazorpayCheckoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scriptReady, setScriptReady] = useState(false);

  const handleClick = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const checkout = await onCheckout();
      if (!window.Razorpay) {
        setError("Payment gateway failed to load. Please refresh and try again.");
        return;
      }

      const isSubscription = Boolean(checkout.subscriptionId);
      const options = {
        key: checkout.keyId,
        amount: checkout.amount,
        currency: checkout.currency ?? "INR",
        name: "IntelliGen LMS",
        description: checkout.courseTitle ?? checkout.planName ?? "Course purchase",
        order_id: checkout.orderId,
        subscription_id: checkout.subscriptionId,
        prefill: {
          name: checkout.userName,
          email: checkout.userEmail,
        },
        theme: { color: "#2563eb" },
        handler: async (response: RazorpayHandlerResponse) => {
          try {
            await onSuccess(response, {
              courseId: checkout.courseId,
              recordId: checkout.recordId,
            });
            router.refresh();
          } catch {
            setError("Payment succeeded but verification failed. Contact support.");
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      if (isSubscription) {
        delete (options as { amount?: number }).amount;
        delete (options as { order_id?: string }).order_id;
      } else {
        delete (options as { subscription_id?: string }).subscription_id;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setLoading(false);
      });
      razorpay.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout");
    } finally {
      setLoading(false);
    }
  }, [onCheckout, onSuccess, router]);

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />
      <div>
        <Button
          onClick={handleClick}
          disabled={disabled || loading || !scriptReady}
          size={size}
          variant={variant}
          className={cn(className)}
        >
          {loading ? "Processing..." : label}
        </Button>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </div>
    </>
  );
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: () => void) => void;
    };
  }
}
