"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  PHONE_COUNTRIES,
  DEFAULT_PHONE_COUNTRY,
  combinePhoneNumber,
  getCountryByCode,
  splitPhoneNumber,
} from "@/lib/phone-countries";
import { formatPhoneNationalDisplay } from "@/lib/phone";

const fieldBase =
  "flex h-11 min-w-0 rounded-xl border px-3.5 py-2 text-sm transition-[border-color,box-shadow] duration-150 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  default: {
    label: "block text-sm font-semibold text-ink",
    select: cn(
      fieldBase,
      "max-w-[9.5rem] shrink-0 bg-panel px-2 sm:max-w-[11rem] sm:px-2.5",
      "border-border text-ink",
      "focus:border-brand-500 focus:ring-brand-500/25"
    ),
    dial: "hidden shrink-0 text-sm font-medium text-muted sm:inline",
    input: cn(
      fieldBase,
      "flex-1 bg-panel text-ink placeholder:text-muted",
      "border-border",
      "focus:border-brand-500 focus:ring-brand-500/25"
    ),
    helper: "text-xs text-muted",
    error: "text-sm text-red-600 dark:text-red-400",
  },
  dark: {
    label: "block text-sm font-medium text-slate-300",
    select: cn(
      fieldBase,
      "max-w-[9.5rem] shrink-0 bg-slate-900 px-2 sm:max-w-[11rem] sm:px-2.5",
      "border-slate-600 text-white",
      "focus:border-brand-400 focus:ring-brand-500/30"
    ),
    dial: "hidden shrink-0 text-sm font-medium text-slate-400 sm:inline",
    input: cn(
      fieldBase,
      "flex-1 bg-slate-900 text-white placeholder:text-slate-500",
      "border-slate-600",
      "focus:border-brand-400 focus:ring-brand-500/30"
    ),
    helper: "text-xs text-slate-400",
    error: "text-sm text-red-300",
  },
} as const;

export function PhoneInput({
  id = "phone",
  name = "phoneNumber",
  label = "Mobile number",
  value,
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
  const isControlled = value !== undefined;
  const [countryCode, setCountryCode] = useState(defaultCountry);
  const [national, setNational] = useState("");
  const lastEmitted = useRef<string | null>(null);

  const emitChange = useCallback(
    (country: string, nationalDigits: string) => {
      const next = combinePhoneNumber(country, nationalDigits) ?? "";
      lastEmitted.current = next;
      onChange?.(next);
      return next;
    },
    [onChange]
  );

  useEffect(() => {
    if (!isControlled) return;

    const external = value ?? "";
    if (external === lastEmitted.current) return;

    const split = splitPhoneNumber(external || null, defaultCountry);
    setCountryCode(split.countryCode);
    setNational(split.nationalNumber);
    lastEmitted.current = external;
  }, [value, defaultCountry, isControlled]);

  const country = getCountryByCode(countryCode) ?? getCountryByCode(defaultCountry)!;
  const combined = combinePhoneNumber(countryCode, national) ?? "";
  const styles = variants[variant];

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
          onChange={(e) => {
            const nextCountry = e.target.value;
            setCountryCode(nextCountry);
            emitChange(nextCountry, national);
          }}
          className={styles.select}
        >
          {PHONE_COUNTRIES.map((c) => (
            <option key={c.code} value={c.code} title={c.name}>
              {c.flag} +{c.dial}
            </option>
          ))}
        </select>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className={styles.dial} aria-hidden>
            +{country.dial}
          </span>
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
              emitChange(countryCode, digits);
            }}
            className={styles.input}
          />
        </div>
      </div>

      <input type="hidden" name={name} value={combined} readOnly />

      {helperText ? <p className={styles.helper}>{helperText}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
