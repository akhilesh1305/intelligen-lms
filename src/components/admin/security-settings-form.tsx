"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { SecuritySettingsData } from "@/lib/security/settings";

export function SecuritySettingsForm({
  initial,
}: {
  initial: SecuritySettingsData;
}) {
  const [settings, setSettings] = useState(initial);
  const [allowedIpsText, setAllowedIpsText] = useState(
    initial.allowedIps.join("\n")
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const allowedIps = allowedIpsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const res = await fetch("/api/security/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...settings, allowedIps }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error || "Failed to save settings");
      return;
    }

    setSettings(data);
    setAllowedIpsText(data.allowedIps.join("\n"));
    setMessage("Security settings saved.");
  }

  function toggle(key: keyof SecuritySettingsData) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {message ? (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      ) : null}

      <section className="space-y-3">
        <h3 className="font-semibold text-ink">Single Sign-On</h3>
        {(
          [
            ["googleSsoEnabled", "Google SSO"],
            ["microsoftSsoEnabled", "Microsoft SSO"],
            ["oktaSsoEnabled", "Okta SSO"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={() => toggle(key)}
            />
            {label}
          </label>
        ))}
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-ink">Two-Factor Authentication</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.requireAdmin2fa}
            onChange={() => toggle("requireAdmin2fa")}
          />
          Require 2FA for administrators
        </label>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-ink">IP Restriction</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.ipRestrictionEnabled}
            onChange={() => toggle("ipRestrictionEnabled")}
          />
          Enable IP allowlist
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Allowed IPs (one per line, supports CIDR e.g. 192.168.1.0/24)
        </label>
        <textarea
          value={allowedIpsText}
          onChange={(e) => setAllowedIpsText(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          placeholder="203.0.113.10&#10;192.168.1.0/24"
        />
      </section>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
