"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function AnimatedCounter({
  value,
  label,
  color,
  suffix = "",
}: {
  value: string;
  label: string;
  color: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const numeric = parseInt(value.replace(/\D/g, ""), 10);
  const hasNumber = !Number.isNaN(numeric) && numeric > 0;
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active || !hasNumber) return;
    const duration = 1200;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(numeric * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, hasNumber, numeric]);

  const display = hasNumber
    ? `${count}${value.includes("+") ? "+" : ""}${suffix}`
    : value;

  return (
    <div ref={ref} className="px-4 py-8 text-center sm:py-10">
      <p className={cn("text-3xl font-bold tabular-nums", color)}>{display}</p>
      <p className="mt-1 text-sm font-medium text-muted">{label}</p>
    </div>
  );
}
