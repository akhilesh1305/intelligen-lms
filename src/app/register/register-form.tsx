"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PhoneInput } from "@/components/ui/phone-input";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phoneNumber: formData.get("phoneNumber"),
        password: formData.get("password"),
        role: formData.get("role"),
        privacyConsent: formData.get("privacyConsent") === "on",
        marketingConsent: formData.get("marketingConsent") === "on",
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}
      <Input
        id="name"
        name="name"
        label="Full name"
        placeholder="Jane Doe"
        required
      />
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        required
      />
      <PhoneInput
        id="phoneNumber"
        name="phoneNumber"
        label="Mobile number"
        defaultCountry="IN"
        required
        helperText="Select your country code, then enter your mobile number without the leading zero."
      />
      <PasswordInput
        id="password"
        name="password"
        label="Password"
        placeholder="••••••••"
        minLength={6}
        required
        autoComplete="new-password"
      />
      <input type="hidden" name="role" value="STUDENT" />
      <Checkbox
        id="privacyConsent"
        name="privacyConsent"
        required
        label={
          <>
            I agree to the privacy policy and consent to processing my personal
            data (GDPR).
          </>
        }
      />
      <Checkbox
        id="marketingConsent"
        name="marketingConsent"
        label="Send me product updates and learning tips (optional)."
      />
      <Button type="submit" className="h-11 w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
