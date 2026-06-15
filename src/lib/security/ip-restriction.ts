import { getSecuritySettings } from "./settings";

function normalizeIp(ip: string) {
  return ip.trim().toLowerCase();
}

function ipMatchesRule(ip: string, rule: string) {
  const normalizedIp = normalizeIp(ip);
  const normalizedRule = normalizeIp(rule);

  if (normalizedRule.includes("/")) {
    const [base, bitsStr] = normalizedRule.split("/");
    const bits = Number(bitsStr);
    if (!base || Number.isNaN(bits) || bits < 0 || bits > 32) return false;

    const ipParts = normalizedIp.split(".").map(Number);
    const baseParts = base.split(".").map(Number);
    if (ipParts.length !== 4 || baseParts.length !== 4) return false;
    if (ipParts.some((p) => Number.isNaN(p)) || baseParts.some((p) => Number.isNaN(p))) {
      return false;
    }

    const ipNum =
      (ipParts[0]! << 24) | (ipParts[1]! << 16) | (ipParts[2]! << 8) | ipParts[3]!;
    const baseNum =
      (baseParts[0]! << 24) |
      (baseParts[1]! << 16) |
      (baseParts[2]! << 8) |
      baseParts[3]!;
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    return (ipNum & mask) === (baseNum & mask);
  }

  if (normalizedRule.endsWith("*")) {
    return normalizedIp.startsWith(normalizedRule.slice(0, -1));
  }

  return normalizedIp === normalizedRule;
}

export async function isIpAllowed(ip: string): Promise<boolean> {
  const settings = await getSecuritySettings();
  if (!settings.ipRestrictionEnabled) return true;
  if (settings.allowedIps.length === 0) return true;

  const normalized = normalizeIp(ip);
  if (normalized === "unknown" || normalized === "127.0.0.1" || normalized === "::1") {
    return process.env.NODE_ENV !== "production";
  }

  return settings.allowedIps.some((rule) => ipMatchesRule(ip, rule));
}
