/** Modern learning-platform logo concepts — pick by number (1–6). */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ConceptProps = {
  size?: number;
  className?: string;
  animated?: boolean;
};

function SvgWrap({
  size = 96,
  className,
  children,
  label,
  animated = false,
}: {
  size?: number;
  className?: string;
  children: ReactNode;
  label: string;
  animated?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={cn(animated && "logo-concept-animated", className)}
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

/** 1 — Aero: soft squircle, airy IG, thin progress arc */
export function ConceptAero({ size, className, animated = false }: ConceptProps) {
  return (
    <SvgWrap
      size={size}
      className={className}
      label="Concept 1 Aero"
      animated={animated}
    >
      <defs>
        <linearGradient id="m1-bg" x1="6" y1="4" x2="42" y2="44">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="m1-shine" x1="0" y1="0" x2="48" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="16" fill="url(#m1-bg)" />
      <path
        d="M10 34 A18 18 0 0 1 38 34"
        className={animated ? "logo-concept-arc" : undefined}
        stroke="#ffffff"
        strokeWidth="2"
        strokeOpacity="0.35"
        fill="none"
        strokeLinecap="round"
      />
      <text
        x="24"
        y="28"
        textAnchor="middle"
        fontFamily="'Source Sans 3', system-ui, sans-serif"
        fontSize="22"
        fontWeight="700"
        letterSpacing="-0.06em"
        fill="#ffffff"
        className={animated ? "logo-concept-letters" : undefined}
      >
        IG
      </text>
      <circle
        cx="36"
        cy="14"
        r="2"
        fill="#ffffff"
        fillOpacity="0.9"
        className={animated ? "logo-concept-dot" : undefined}
      />
      {animated ? (
        <rect
          width="48"
          height="48"
          fill="url(#m1-shine)"
          className="logo-concept-shine"
          opacity="0"
        />
      ) : null}
    </SvgWrap>
  );
}

/** 2 — Slate: dark minimal card, IG + single book line */
export function ConceptSlate({ size, className, animated = false }: ConceptProps) {
  return (
    <SvgWrap
      size={size}
      className={className}
      label="Concept 2 Slate"
      animated={animated}
    >
      <rect width="48" height="48" rx="14" fill="#0f172a" />
      <rect x="4" y="4" width="40" height="40" rx="12" stroke="#334155" strokeWidth="0.8" fill="none" />
      <text
        x="24"
        y="27"
        textAnchor="middle"
        fontFamily="'Source Sans 3', system-ui, sans-serif"
        fontSize="21"
        fontWeight="700"
        letterSpacing="-0.05em"
        className={animated ? "logo-concept-letters" : undefined}
      >
        <tspan fill="#f8fafc">I</tspan>
        <tspan fill="#38bdf8" dx="-1">
          G
        </tspan>
      </text>
      <path
        d="M14 34 H34"
        stroke="#475569"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M24 34 V30 M18 34 C18 31 21 29 24 29 C27 29 30 31 30 34"
        className={animated ? "logo-concept-book-line" : undefined}
        stroke="#64748b"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    </SvgWrap>
  );
}

/** 3 — Ring: course-progress ring around IG */
export function ConceptRing({ size, className, animated = false }: ConceptProps) {
  return (
    <SvgWrap
      size={size}
      className={className}
      label="Concept 3 Ring"
      animated={animated}
    >
      <rect width="48" height="48" rx="14" fill="#f0f4fa" />
      <circle cx="24" cy="24" r="17" stroke="#e2e8f0" strokeWidth="3" fill="none" />
      <circle
        cx="24"
        cy="24"
        r="17"
        className={animated ? "logo-concept-ring" : undefined}
        stroke="#0056d2"
        strokeWidth="3"
        fill="none"
        strokeDasharray="72 36"
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
      />
      <text
        x="24"
        y="28"
        textAnchor="middle"
        fontFamily="'Source Sans 3', system-ui, sans-serif"
        fontSize="15"
        fontWeight="800"
        fill="#004bb8"
        className={animated ? "logo-concept-letters" : undefined}
      >
        IG
      </text>
    </SvgWrap>
  );
}

/** 4 — Fold: geometric page fold with IG */
export function ConceptFold({ size, className, animated = false }: ConceptProps) {
  return (
    <SvgWrap
      size={size}
      className={className}
      label="Concept 4 Fold"
      animated={animated}
    >
      <defs>
        <linearGradient id="m4-bg" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#0056d2" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="m4-shine" x1="0" y1="0" x2="48" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#m4-bg)" />
      <path
        d="M30 8 L40 18 V40 H8 V8 H30 Z"
        className={animated ? "logo-concept-fold" : undefined}
        fill="#ffffff"
        fillOpacity="0.14"
      />
      <path
        d="M30 8 V18 H40"
        className={animated ? "logo-concept-fold logo-concept-fold-delay" : undefined}
        fill="#ffffff"
        fillOpacity="0.22"
      />
      <text
        x="22"
        y="30"
        textAnchor="middle"
        fontFamily="'Source Sans 3', system-ui, sans-serif"
        fontSize="20"
        fontWeight="700"
        fill="#ffffff"
        letterSpacing="-0.04em"
        className={animated ? "logo-concept-letters" : undefined}
      >
        IG
      </text>
      <path
        d="M12 36 H32"
        className={animated ? "logo-concept-arc" : undefined}
        stroke="#ffffff"
        strokeOpacity="0.35"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {animated ? (
        <rect width="48" height="48" fill="url(#m4-shine)" className="logo-concept-shine" opacity="0" />
      ) : null}
    </SvgWrap>
  );
}

/** 5 — Pulse: modular blocks + IG */
export function ConceptPulse({ size, className, animated = false }: ConceptProps) {
  return (
    <SvgWrap
      size={size}
      className={className}
      label="Concept 5 Pulse"
      animated={animated}
    >
      <rect width="48" height="48" rx="14" fill="#141b2d" />
      <rect
        x="10"
        y="32"
        width="8"
        height="6"
        rx="2"
        fill="#0056d2"
        opacity="0.5"
        className={animated ? "logo-concept-bar logo-concept-bar-d1" : undefined}
      />
      <rect
        x="20"
        y="26"
        width="8"
        height="12"
        rx="2"
        fill="#2d87e0"
        opacity="0.7"
        className={animated ? "logo-concept-bar logo-concept-bar-d2" : undefined}
      />
      <rect
        x="30"
        y="20"
        width="8"
        height="18"
        rx="2"
        fill="#38bdf8"
        className={animated ? "logo-concept-bar logo-concept-bar-d3" : undefined}
      />
      <text
        x="24"
        y="18"
        textAnchor="middle"
        fontFamily="'Source Sans 3', system-ui, sans-serif"
        fontSize="16"
        fontWeight="800"
        fill="#ffffff"
        letterSpacing="0.02em"
        className={animated ? "logo-concept-letters" : undefined}
      >
        IG
      </text>
    </SvgWrap>
  );
}

/** Ring + Pulse: progress ring around IG with rising module bars */
export function ConceptRingPulse({ size, className, animated = false }: ConceptProps) {
  return (
    <SvgWrap
      size={size}
      className={className}
      label="Ring Pulse hybrid"
      animated={animated}
    >
      <defs>
        <linearGradient id="rp-bg" x1="8" y1="6" x2="40" y2="42">
          <stop offset="0%" stopColor="#0b1220" />
          <stop offset="100%" stopColor="#141b2d" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#rp-bg)" />
      <rect
        x="4"
        y="4"
        width="40"
        height="40"
        rx="12"
        stroke="#2a3548"
        strokeWidth="0.8"
        fill="none"
      />
      <circle cx="24" cy="24" r="20" stroke="#334155" strokeWidth="2.5" fill="none" />
      <circle
        cx="24"
        cy="24"
        r="20"
        className={animated ? "logo-concept-ring logo-concept-ring-lg" : undefined}
        stroke="#38bdf8"
        strokeWidth="2.5"
        fill="none"
        strokeDasharray="84 42"
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
      />
      <text
        x="24"
        y="21"
        textAnchor="middle"
        fontFamily="'Source Sans 3', system-ui, sans-serif"
        fontSize="14"
        fontWeight="800"
        letterSpacing="-0.02em"
        className={animated ? "logo-concept-letters" : undefined}
      >
        <tspan fill="#f8fafc">I</tspan>
        <tspan fill="#7dd3fc" dx="-0.5">
          G
        </tspan>
      </text>
      <rect
        x="12.5"
        y="34"
        width="5.5"
        height="5"
        rx="1.5"
        fill="#0056d2"
        opacity="0.85"
        className={animated ? "logo-concept-bar logo-concept-bar-d1" : undefined}
      />
      <rect
        x="21.25"
        y="30.5"
        width="5.5"
        height="8.5"
        rx="1.5"
        fill="#2d87e0"
        className={animated ? "logo-concept-bar logo-concept-bar-d2" : undefined}
      />
      <rect
        x="30"
        y="27"
        width="5.5"
        height="12"
        rx="1.5"
        fill="#38bdf8"
        className={animated ? "logo-concept-bar logo-concept-bar-d3" : undefined}
      />
    </SvgWrap>
  );
}

/** 6 — Mint: fresh light card, cap dot + IG */
export function ConceptMint({ size, className, animated = false }: ConceptProps) {
  return (
    <SvgWrap
      size={size}
      className={className}
      label="Concept 6 Mint"
      animated={animated}
    >
      <rect width="48" height="48" rx="16" fill="#ecfdf5" />
      <rect x="3" y="3" width="42" height="42" rx="14" stroke="#a7f3d0" strokeWidth="1" fill="none" />
      <circle
        cx="33"
        cy="15"
        r="5"
        fill="#0056d2"
        className={animated ? "logo-concept-dot" : undefined}
      />
      <path d="M30 15 H36" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
      <text
        x="22"
        y="32"
        textAnchor="middle"
        fontFamily="'Source Sans 3', system-ui, sans-serif"
        fontSize="22"
        fontWeight="700"
        letterSpacing="-0.05em"
        className={animated ? "logo-concept-letters" : undefined}
      >
        <tspan fill="#064e3b">I</tspan>
        <tspan fill="#0056d2" dx="-1">
          G
        </tspan>
      </text>
      <path
        d="M14 38 C18 35 30 35 34 38"
        className={animated ? "logo-concept-curve" : undefined}
        stroke="#6ee7b7"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </SvgWrap>
  );
}

export const LOGO_CONCEPTS = [
  {
    id: 0,
    name: "Ring + Pulse",
    tagline: "Your pick — progress ring + rising module bars",
    Component: ConceptRingPulse,
  },
  {
    id: 1,
    name: "Aero",
    tagline: "Soft gradient · animated progress arc",
    Component: ConceptAero,
  },
  {
    id: 2,
    name: "Slate",
    tagline: "Dark minimal · pulsing book line",
    Component: ConceptSlate,
  },
  {
    id: 3,
    name: "Ring",
    tagline: "Course progress ring · fills & loops",
    Component: ConceptRing,
  },
  {
    id: 4,
    name: "Fold",
    tagline: "Page fold shimmer · gradient sweep",
    Component: ConceptFold,
  },
  {
    id: 5,
    name: "Pulse",
    tagline: "Rising module bars · staggered grow",
    Component: ConceptPulse,
  },
  {
    id: 6,
    name: "Mint",
    tagline: "Fresh light UI · cap bounce + wave",
    Component: ConceptMint,
  },
] as const;
