"use client";

import { useEffect, useRef } from "react";

const HOVER_SELECTOR =
  'a[href], button:not(:disabled), [role="button"]:not([aria-disabled="true"]), [data-cursor-hover]';

const RING_LERP = 0.14;
const DOT_LERP = 0.28;
const SCALE_LERP = 0.18;
const HOVER_SCALE = 1.65;

function canUseCustomCursor() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  if (!window.matchMedia("(pointer: fine)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return true;
}

function lerp(current: number, target: number, factor: number) {
  return current + (target - current) * factor;
}

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canUseCustomCursor()) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor-active");

    const target = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    const dotPos = { x: -100, y: -100 };
    let scale = 1;
    let targetScale = 1;
    let hovering = false;
    let visible = false;
    let rafId = 0;

    const applyTransforms = () => {
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
    };

    const setVisible = (next: boolean) => {
      if (visible === next) return;
      visible = next;
      const opacity = next ? "1" : "0";
      ring.style.opacity = opacity;
      dot.style.opacity = opacity;
    };

    const setHovering = (next: boolean) => {
      if (hovering === next) return;
      hovering = next;
      targetScale = next ? HOVER_SCALE : 1;
      ring.classList.toggle("is-hovering", next);
      dot.classList.toggle("is-hovering", next);
    };

    const tick = () => {
      ringPos.x = lerp(ringPos.x, target.x, RING_LERP);
      ringPos.y = lerp(ringPos.y, target.y, RING_LERP);
      dotPos.x = lerp(dotPos.x, target.x, DOT_LERP);
      dotPos.y = lerp(dotPos.y, target.y, DOT_LERP);
      scale = lerp(scale, targetScale, SCALE_LERP);
      applyTransforms();
      rafId = requestAnimationFrame(tick);
    };

    const onMouseMove = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      setVisible(true);

      const el = document.elementFromPoint(event.clientX, event.clientY);
      setHovering(!!el?.closest(HOVER_SELECTOR));
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    const onVisibilityChange = () => {
      if (document.hidden) setVisible(false);
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    root.addEventListener("mouseleave", onMouseLeave);
    root.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("visibilitychange", onVisibilityChange);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
      root.removeEventListener("mouseleave", onMouseLeave);
      root.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      root.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <div className="custom-cursor-root" aria-hidden>
      <div ref={ringRef} className="custom-cursor-ring" />
      <div ref={dotRef} className="custom-cursor-dot" />
    </div>
  );
}
