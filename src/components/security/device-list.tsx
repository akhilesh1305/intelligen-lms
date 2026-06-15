"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Device = {
  id: string;
  deviceName: string;
  ipAddress: string | null;
  lastSeenAt: string;
  userAgent: string;
};

export function DeviceList() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadDevices() {
    const res = await fetch("/api/security/devices");
    const data = await res.json();
    setDevices(data.devices ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadDevices();
  }, []);

  async function revokeDevice(id: string) {
    const res = await fetch(`/api/security/devices/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDevices((prev) => prev.filter((d) => d.id !== id));
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading devices…</p>;
  }

  if (devices.length === 0) {
    return <p className="text-sm text-muted">No active devices recorded.</p>;
  }

  return (
    <div className="space-y-3">
      {devices.map((device) => (
        <div
          key={device.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-4"
        >
          <div>
            <p className="font-medium text-ink">{device.deviceName}</p>
            <p className="text-xs text-muted">
              Last seen {new Date(device.lastSeenAt).toLocaleString()}
              {device.ipAddress ? ` · ${device.ipAddress}` : ""}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => revokeDevice(device.id)}>
            Revoke
          </Button>
        </div>
      ))}
    </div>
  );
}
