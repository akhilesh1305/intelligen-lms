"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function CreateInstructorForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const res = await fetch("/api/admin/instructors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to create instructor");
      return;
    }

    setName("");
    setEmail("");
    setPassword("");
    setSuccess(
      `Instructor account created for ${data.user.name}. They can sign in at /login.`
    );
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="flex items-center gap-2 font-semibold text-ink">
          <UserPlus className="h-5 w-5 text-brand-600" />
          Add instructor
        </h2>
        <p className="text-sm text-muted">
          Create an instructor account with login credentials. The account is approved
          immediately and can create courses.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          {success ? (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              {success}
            </p>
          ) : null}

          <Input
            id="instructorName"
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dr. Sarah Chen"
            required
          />
          <Input
            id="instructorEmail"
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="instructor@example.com"
            required
          />
          <Input
            id="instructorPassword"
            type="password"
            label="Temporary password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
            required
          />
          <p className="text-xs text-muted">
            Share these credentials with the instructor. They can change the password
            from Profile settings after signing in.
          </p>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Create instructor account
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
