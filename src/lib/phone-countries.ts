export type PhoneCountry = {
  code: string;
  name: string;
  dial: string;
  flag: string;
  placeholder: string;
};

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { code: "IN", name: "India", dial: "91", flag: "🇮🇳", placeholder: "98765 43210" },
  { code: "US", name: "United States", dial: "1", flag: "🇺🇸", placeholder: "555 123 4567" },
  { code: "GB", name: "United Kingdom", dial: "44", flag: "🇬🇧", placeholder: "7911 123456" },
  { code: "CA", name: "Canada", dial: "1", flag: "🇨🇦", placeholder: "555 123 4567" },
  { code: "AU", name: "Australia", dial: "61", flag: "🇦🇺", placeholder: "412 345 678" },
  { code: "AE", name: "United Arab Emirates", dial: "971", flag: "🇦🇪", placeholder: "50 123 4567" },
  { code: "SA", name: "Saudi Arabia", dial: "966", flag: "🇸🇦", placeholder: "50 123 4567" },
  { code: "SG", name: "Singapore", dial: "65", flag: "🇸🇬", placeholder: "9123 4567" },
  { code: "MY", name: "Malaysia", dial: "60", flag: "🇲🇾", placeholder: "12 345 6789" },
  { code: "DE", name: "Germany", dial: "49", flag: "🇩🇪", placeholder: "151 12345678" },
  { code: "FR", name: "France", dial: "33", flag: "🇫🇷", placeholder: "6 12 34 56 78" },
  { code: "JP", name: "Japan", dial: "81", flag: "🇯🇵", placeholder: "90 1234 5678" },
  { code: "CN", name: "China", dial: "86", flag: "🇨🇳", placeholder: "131 2345 6789" },
  { code: "PK", name: "Pakistan", dial: "92", flag: "🇵🇰", placeholder: "300 1234567" },
  { code: "BD", name: "Bangladesh", dial: "880", flag: "🇧🇩", placeholder: "1712 345678" },
  { code: "LK", name: "Sri Lanka", dial: "94", flag: "🇱🇰", placeholder: "71 234 5678" },
  { code: "NP", name: "Nepal", dial: "977", flag: "🇳🇵", placeholder: "984 1234567" },
  { code: "ZA", name: "South Africa", dial: "27", flag: "🇿🇦", placeholder: "71 123 4567" },
  { code: "NG", name: "Nigeria", dial: "234", flag: "🇳🇬", placeholder: "802 123 4567" },
  { code: "KE", name: "Kenya", dial: "254", flag: "🇰🇪", placeholder: "712 345678" },
  { code: "PH", name: "Philippines", dial: "63", flag: "🇵🇭", placeholder: "912 345 6789" },
  { code: "ID", name: "Indonesia", dial: "62", flag: "🇮🇩", placeholder: "812 3456 7890" },
  { code: "TH", name: "Thailand", dial: "66", flag: "🇹🇭", placeholder: "81 234 5678" },
  { code: "VN", name: "Vietnam", dial: "84", flag: "🇻🇳", placeholder: "91 234 56 78" },
  { code: "KR", name: "South Korea", dial: "82", flag: "🇰🇷", placeholder: "10 1234 5678" },
  { code: "IT", name: "Italy", dial: "39", flag: "🇮🇹", placeholder: "312 345 6789" },
  { code: "ES", name: "Spain", dial: "34", flag: "🇪🇸", placeholder: "612 34 56 78" },
  { code: "NL", name: "Netherlands", dial: "31", flag: "🇳🇱", placeholder: "6 12345678" },
  { code: "BR", name: "Brazil", dial: "55", flag: "🇧🇷", placeholder: "11 91234 5678" },
  { code: "MX", name: "Mexico", dial: "52", flag: "🇲🇽", placeholder: "55 1234 5678" },
];

export const PHONE_COUNTRIES_BY_DIAL = [...PHONE_COUNTRIES].sort(
  (a, b) => b.dial.length - a.dial.length
);

export const DEFAULT_PHONE_COUNTRY = "IN";

export function getCountryByCode(code: string): PhoneCountry | undefined {
  return PHONE_COUNTRIES.find((c) => c.code === code);
}

export function splitPhoneNumber(
  stored: string | null | undefined,
  defaultCountry = DEFAULT_PHONE_COUNTRY
): { countryCode: string; nationalNumber: string } {
  if (!stored) {
    return { countryCode: defaultCountry, nationalNumber: "" };
  }

  const digits = stored.replace(/\D/g, "");
  if (!digits) {
    return { countryCode: defaultCountry, nationalNumber: "" };
  }

  for (const country of PHONE_COUNTRIES_BY_DIAL) {
    if (digits.startsWith(country.dial) && digits.length > country.dial.length) {
      return {
        countryCode: country.code,
        nationalNumber: digits.slice(country.dial.length),
      };
    }
  }

  return { countryCode: defaultCountry, nationalNumber: digits };
}

export function combinePhoneNumber(
  countryCode: string,
  nationalNumber: string
): string | null {
  const country = getCountryByCode(countryCode);
  if (!country) return null;

  const national = nationalNumber.replace(/\D/g, "");
  if (national.length < 6 || national.length > 12) return null;

  const full = `${country.dial}${national}`;
  if (full.length < 10 || full.length > 15) return null;
  return full;
}
