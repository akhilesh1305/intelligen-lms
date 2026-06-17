import type { OrganizationStatus } from "@prisma/client";

export type OrganizationLifecycle =
  | "active"
  | "pending"
  | "expired"
  | "terminated";

export type OrganizationLifecycleFields = {
  status: OrganizationStatus | string;
  contractStartsAt: Date | string | null;
  contractEndsAt: Date | string | null;
};

export function getOrganizationLifecycle(
  org: OrganizationLifecycleFields
): OrganizationLifecycle {
  if (org.status === "TERMINATED") return "terminated";

  const now = Date.now();
  const start = org.contractStartsAt
    ? new Date(org.contractStartsAt).getTime()
    : null;
  const end = org.contractEndsAt ? new Date(org.contractEndsAt).getTime() : null;

  if (start !== null && now < start) return "pending";
  if (end !== null && now > end) return "expired";
  return "active";
}

export function isOrganizationOperational(
  org: OrganizationLifecycleFields
): boolean {
  return getOrganizationLifecycle(org) === "active";
}

export function getOrganizationLifecycleLabel(
  lifecycle: OrganizationLifecycle
): string {
  switch (lifecycle) {
    case "active":
      return "Active";
    case "pending":
      return "Contract not started";
    case "expired":
      return "Contract ended";
    case "terminated":
      return "Terminated";
  }
}

export function getOrganizationLifecycleDescription(
  org: OrganizationLifecycleFields & {
    terminationNote?: string | null;
  }
): string {
  const lifecycle = getOrganizationLifecycle(org);

  switch (lifecycle) {
    case "active":
      if (org.contractEndsAt) {
        return `Contract access until ${formatContractDate(org.contractEndsAt)}`;
      }
      return "Full organization access is active.";
    case "pending":
      return org.contractStartsAt
        ? `Access begins on ${formatContractDate(org.contractStartsAt)}`
        : "Contract access has not started yet.";
    case "expired":
      return org.contractEndsAt
        ? `Contract ended on ${formatContractDate(org.contractEndsAt)}`
        : "Contract period has ended.";
    case "terminated":
      return org.terminationNote?.trim()
        ? org.terminationNote.trim()
        : "This organization was terminated by platform admin.";
  }
}

export function formatContractDate(value: Date | string): string {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function toContractDateInputValue(value: Date | string | null): string {
  if (!value) return "";
  const date = new Date(value);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseContractStartDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

export function parseContractEndDate(dateStr: string): Date {
  return new Date(`${dateStr}T23:59:59.999Z`);
}
