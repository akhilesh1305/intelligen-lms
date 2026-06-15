import {
  combinePhoneNumber,
  getCountryByCode,
  splitPhoneNumber,
} from "@/lib/phone-countries";

export {
  PHONE_COUNTRIES,
  DEFAULT_PHONE_COUNTRY,
  getCountryByCode,
  splitPhoneNumber,
  combinePhoneNumber,
} from "@/lib/phone-countries";

/** Digits-only phone for storage and lookup (10–15 digits, E.164-style). */
export function normalizePhoneNumber(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return null;
  return digits;
}

export function isValidPhoneInput(input: string): boolean {
  return normalizePhoneNumber(input) !== null;
}

export function looksLikeEmail(input: string): boolean {
  return input.trim().includes("@");
}

export function formatPhoneForDisplay(digits: string): string {
  const { countryCode, nationalNumber } = splitPhoneNumber(digits);
  const country = getCountryByCode(countryCode);
  if (!country || !nationalNumber) return digits ? `+${digits}` : "";
  return `+${country.dial} ${nationalNumber}`;
}

export function formatPhoneNationalDisplay(nationalNumber: string): string {
  const digits = nationalNumber.replace(/\D/g, "");
  if (digits.length <= 5) return digits;
  if (digits.length <= 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return digits;
}
