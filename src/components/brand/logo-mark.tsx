"use client";

import { useId } from "react";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

type LogoMarkProps = {
  size?: number;
  className?: string;
  animated?: boolean;
  inverted?: boolean;
  /** Icon only — hide IntelliGen / LMS text (use with a separate wordmark). */
  iconOnly?: boolean;
};

/** Book + profile + pixels — transparent SVG, adapts to light & dark UI. */
export function LogoMark({
  size = 48,
  className,
  animated = true,
  inverted = false,
  iconOnly = false,
}: LogoMarkProps) {
  const { resolvedTheme } = useTheme();
  const uid = useId().replace(/:/g, "");
  const motion = animated ? "logo-mark-animated" : "";
  const onDark = inverted || resolvedTheme === "dark";

  const intelliFill = onDark ? "#f0f7ff" : "#0c2d5e";
  const genFill = onDark ? "#93c5fd" : "#003d96";
  const lmsFill = onDark ? "#67e8f9" : "#0891b2";
  const headStroke = onDark ? "#7dd3fc" : "#003d96";
  const headAccent = onDark ? "#93c5fd" : "#004bb8";
  const textFilter = onDark
    ? `url(#${uid}-text-shadow-dark)`
    : `url(#${uid}-text-shadow-light)`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={iconOnly ? "0 0 48 46" : "0 0 48 56"}
      width={size}
      height={size * (iconOnly ? 46 / 48 : 56 / 48)}
      fill="none"
      role="img"
      aria-hidden={animated}
      aria-label={animated ? undefined : "IntelliGen LMS"}
      className={cn("shrink-0 bg-transparent", motion, className)}
    >
      <defs>
        <linearGradient id={`${uid}-pg1`} x1="10" y1="28" x2="24" y2="40">
          <stop offset="0%" stopColor="#84cc16" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id={`${uid}-pg2`} x1="10" y1="38" x2="24" y2="46">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id={`${uid}-pg3`} x1="24" y1="28" x2="38" y2="40">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0056d2" />
        </linearGradient>
        <linearGradient id={`${uid}-pg4`} x1="24" y1="38" x2="38" y2="46">
          <stop offset="0%" stopColor="#0056d2" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <filter
          id={`${uid}-text-shadow-light`}
          x="-35%"
          y="-45%"
          width="170%"
          height="190%"
        >
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="0.7"
            floodColor="#003d96"
            floodOpacity="0.3"
          />
        </filter>
        <filter
          id={`${uid}-text-shadow-dark`}
          x="-35%"
          y="-45%"
          width="170%"
          height="190%"
        >
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="0.85"
            floodColor="#000000"
            floodOpacity="0.45"
          />
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="0.5"
            floodColor="#22d3ee"
            floodOpacity="0.2"
          />
        </filter>
      </defs>

      <g className={animated ? "logo-scholar-book" : undefined}>
        <path
          d="M24 39 Q11 34 9.5 28"
          stroke={`url(#${uid}-pg1)`}
          strokeWidth="3.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M24 39 Q11 41.5 9.5 46.5"
          stroke={`url(#${uid}-pg2)`}
          strokeWidth="3.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M24 39 Q37 34 38.5 28"
          stroke={`url(#${uid}-pg3)`}
          strokeWidth="3.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M24 39 Q37 41.5 38.5 46.5"
          stroke={`url(#${uid}-pg4)`}
          strokeWidth="3.4"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      <path
        d="M21 39 C21 33.5 25.5 29.5 31.5 29.5 C34.5 29.5 36.5 31.5 36.5 34.5 C36.5 37 34.5 39 31.5 39.5 C28.5 40 25.5 39.5 23.5 38.5 C22 39 21 39 21 39 Z"
        fill="none"
        stroke={headStroke}
        strokeWidth="1.15"
        strokeLinejoin="round"
        className={animated ? "logo-scholar-cap" : undefined}
      />
      <path
        d="M31 32 C33 31 35 32.5 35.5 34.5 C35 33 33.5 32 31.5 32.2 Z"
        fill={headAccent}
      />

      <g className={animated ? "logo-scholar-pixels" : undefined}>
        {[
          [11, 20, "#a855f7", 2.6],
          [14, 17, "#f97316", 2.2],
          [17, 15, "#84cc16", 2.8],
          [13, 23, "#38bdf8", 2.0],
          [16, 21, "#0056d2", 2.4],
          [19, 18, "#eab308", 2.2],
        ].map(([x, y, fill, w], i) => (
          <rect
            key={i}
            x={Number(x)}
            y={Number(y)}
            width={Number(w)}
            height={Number(w)}
            rx="0.35"
            fill={String(fill)}
            className={animated ? `logo-pixel logo-pixel-d${i}` : undefined}
          />
        ))}
      </g>

      {!iconOnly ? (
        <g filter={textFilter}>
          <text
            x="24"
            y="51.5"
            textAnchor="middle"
            fontFamily="'Source Sans 3', system-ui, sans-serif"
            fontSize="9.5"
            fontWeight="800"
            letterSpacing="-0.03em"
          >
            <tspan fill={intelliFill}>Intelli</tspan>
            <tspan fill={genFill}>Gen</tspan>
          </text>
          <line
            x1="11"
            y1="53.8"
            x2="16"
            y2="53.8"
            stroke={lmsFill}
            strokeWidth="0.65"
            strokeOpacity="0.85"
            strokeLinecap="round"
          />
          <text
            x="24"
            y="54.8"
            textAnchor="middle"
            fontFamily="'Source Sans 3', system-ui, sans-serif"
            fontSize="4.2"
            fontWeight="700"
            letterSpacing="0.18em"
            fill={lmsFill}
            className={animated ? "logo-scholar-lms" : undefined}
          >
            LMS
          </text>
          <line
            x1="32"
            y1="53.8"
            x2="37"
            y2="53.8"
            stroke={lmsFill}
            strokeWidth="0.65"
            strokeOpacity="0.85"
            strokeLinecap="round"
          />
        </g>
      ) : null}
    </svg>
  );
}
