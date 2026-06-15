"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  PHONE_COUNTRIES,
  DEFAULT_PHONE_COUNTRY,
  combinePhoneNumber,
  getCountryByCode,
  splitPhoneNumber,
} from "@/lib/phone-countries";
import { formatPhoneNationalDisplay } from "@/lib/phone";

const variants = {
  default: {
    label: "block text-sm font-semibold text-ink",
    select:
      "h-11 max-w-[9.5rem] shrink-0 rounded-lg border border-border bg-panel px-2 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:max-w-[11rem] sm:px-2.5",
    dial: "hidden shrink-0 text-sm font-medium text-muted sm:inline",
    input:
      "flex h-11 min-w-0 flex-1 rounded-lg border border-border bg-panel px-3.5 py-2 text-sm text-ink placeholder:text-muted focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50",
    helper: "text-xs text-muted",
    error: "text-sm text-red-600 dark:text-red-400",
  },
  dark: {
    label: "block text-sm font-medium text-slate-300",
    select:
      "h-11 max-w-[9.5rem] shrink-0 rounded-lg border border-slate-600 bg-slate-900/80 px-2 text-sm text-white focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 sm:max-w-[11rem] sm:px-2.5",
    dial: "hidden shrink-0 text-sm font-medium text-slate-400 sm:inline",
    input:
      "flex h-11 min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-900/80 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:cursor-not-allowed disabled:opacity-50",
    helper: "text-xs text-slate-400",
    error: "text-sm text-red-300",
  },
} as const;

export function PhoneInput({
  id = "phone",
  name = "phoneNumber",
  label = "Mobile number",
  value = "",
  onChange,
  defaultCountry = DEFAULT_PHONE_COUNTRY,
  required,
  error,
  className,
  helperText,
  variant = "default",
}: {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  onChange?: (normalized: string) => void;
  defaultCountry?: string;
  required?: boolean;
  error?: string;
  className?: string;
  helperText?: string;
  variant?: keyof typeof variants;
}) {
  const [countryCode, setCountryCode] = useState(defaultCountry);
  const [national, setNational] = useState("");

  useEffect(() => {
    const split = splitPhoneNumber(value || null, defaultCountry);
    setCountryCode(split.countryCode);
    setNational(split.nationalNumber);
  }, [value, defaultCountry]);

  const country = getCountryByCode(countryCode) ?? getCountryByCode(defaultCountry)!;
  const combined = combinePhoneNumber(countryCode, national) ?? "";
  const styles = variants[variant];

  useEffect(() => {
    onChange?.(combined);
  }, [combined, onChange]);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <label htmlFor={`${id}-national`} className={styles.label}>
          {label}
        </label>
      ) : null}

      <div className="flex gap-2">
        <select
          aria-label="Country code"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className={styles.select}
        >
          {PHONE_COUNTRIES.map((c) => (
            <option key={c.code} value={c.code} title={c.name}>
              {c.flag} +{c.dial}
            </option>
          ))}
        </select>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className={styles.dial}>+{country.dial}</span>
          <input
            id={`${id}-national`}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            required={required}
            placeholder={country.placeholder}
            value={formatPhoneNationalDisplay(national)}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 12);
              setNational(digits);
            }}
            className={styles.input}
          />
        </div>
      </div>

      <input type="hidden" name={name} value={combined} />

      {helperText ? <p className={styles.helper}>{helperText}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
