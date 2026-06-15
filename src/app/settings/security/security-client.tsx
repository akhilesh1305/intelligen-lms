"use client";

import { useRouter } from "next/navigation";
import { TwoFactorSetup } from "@/components/security/two-factor-setup";

export function SecuritySettingsClient({ enabled }: { enabled: boolean }) {
  const router = useRouter();

  return (
    <TwoFactorSetup
      enabled={enabled}
      onChanged={() => router.refresh()}
    />
  );
}
