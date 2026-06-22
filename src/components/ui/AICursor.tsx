"use client";

import { useEffect, useRef } from "react";

const HOVER_SELECTOR =
  '[data-ai-cursor], [data-cursor-hover], button:not(:disabled), a[href]:not([aria-disabled="true"]), [role="button"]:not([aria-disabled="true"])';

const MAX_PARTICLES = 8;
const PARTICLE_LIFETIME_MS = 420;
const SPAWN_DISTANCE_PX = 22;
const SPAWN_INTERVAL_MS = 45;
const RING_LERP = 0.12;
const CORE_LERP = 0.32;
const SCALE_LERP = 0.16;
const HOVER_SCALE = 1.5;
const RIPPLE_DURATION_MS = 420;

const PARTICLE_COLORS = ["#06B6D4", "#4F46E5"] as const;

type Particle = {
  el: HTMLDivElement;
  x: number;
  y: number;
  born: number;
  color: string;
  active: boolean;
};

function canUseAICursor() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  if (!window.matchMedia("(pointer: fine)").matches) return false;
  if (window.matchMedia("(hover: none)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return true;
}

function lerp(current: number, target: number, factor: number) {
  return current + (target - current) * factor;
}

export function AICursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const particlesWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canUseAICursor()) return;

    const root = rootRef.current;
    const ring = ringRef.current;
    const core = coreRef.current;
    const ripple = rippleRef.current;
    const particlesWrap = particlesWrapRef.current;
    if (!root || !ring || !core || !ripple || !particlesWrap) return;

    const html = document.documentElement;
    html.classList.add("ai-cursor-active");
    root.classList.add("is-enabled");

    const particles: Particle[] = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const el = document.createElement("div");
      el.className = "ai-cursor-particle";
      el.style.opacity = "0";
      particlesWrap.appendChild(el);
      particles.push({ el, x: 0, y: 0, born: 0, color: PARTICLE_COLORS[0], active: false });
    }

    const target = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    const corePos = { x: -100, y: -100 };
    let scale = 1;
    let targetScale = 1;
    let hovering = false;
    let visible = false;
    let rafId = 0;
    let particleCursor = 0;
    let lastSpawn = { x: -100, y: -100, time: 0 };
    let rippleStart = 0;
    let ripplePlaying = false;
    let rippleX = 0;
    let rippleY = 0;

    const setVisible = (next: boolean) => {
      if (visible === next) return;
      visible = next;
      root.style.opacity = next ? "1" : "0";
    };

    const setHovering = (next: boolean) => {
      if (hovering === next) return;
      hovering = next;
      targetScale = next ? HOVER_SCALE : 1;
      ring.classList.toggle("is-hovering", next);
      core.classList.toggle("is-hovering", next);
      if (next) startRipple(corePos.x, corePos.y);
    };

    const startRipple = (x: number, y: number) => {
      if (ripplePlaying) return;
      ripplePlaying = true;
      rippleStart = performance.now();
      rippleX = x;
      rippleY = y;
      ripple.style.opacity = "1";
      ripple.style.transform = `translate3d(${rippleX}px, ${rippleY}px, 0) translate(-50%, -50%) scale(1)`;
    };

    const spawnParticle = (x: number, y: number) => {
      const slot = particles[particleCursor % MAX_PARTICLES];
      particleCursor += 1;
      slot.x = x;
      slot.y = y;
      slot.born = performance.now();
      slot.color = PARTICLE_COLORS[particleCursor % PARTICLE_COLORS.length];
      slot.active = true;
      slot.el.style.backgroundColor = slot.color;
      slot.el.style.boxShadow = `0 0 6px ${slot.color}88`;
    };

    const applyOrbTransforms = () => {
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      core.style.transform = `translate3d(${corePos.x}px, ${corePos.y}px, 0) translate(-50%, -50%)`;
    };

    const tick = (now: number) => {
      ringPos.x = lerp(ringPos.x, target.x, RING_LERP);
      ringPos.y = lerp(ringPos.y, target.y, RING_LERP);
      corePos.x = lerp(corePos.x, target.x, CORE_LERP);
      corePos.y = lerp(corePos.y, target.y, CORE_LERP);
      scale = lerp(scale, targetScale, SCALE_LERP);
      applyOrbTransforms();

      if (ripplePlaying) {
        const t = (now - rippleStart) / RIPPLE_DURATION_MS;
        if (t >= 1) {
          ripplePlaying = false;
          ripple.style.opacity = "0";
        } else {
          const eased = 1 - (1 - t) ** 2;
          ripple.style.opacity = String(1 - t);
          ripple.style.transform = `translate3d(${rippleX}px, ${rippleY}px, 0) translate(-50%, -50%) scale(${1 + eased * 1.4})`;
        }
      }

      for (const particle of particles) {
        if (!particle.active) continue;
        const age = now - particle.born;
        if (age >= PARTICLE_LIFETIME_MS) {
          particle.active = false;
          particle.el.style.opacity = "0";
          continue;
        }
        const t = age / PARTICLE_LIFETIME_MS;
        const fade = 1 - t;
        const particleScale = 1 - t * 0.65;
        particle.el.style.opacity = String(fade * 0.75);
        particle.el.style.transform = `translate3d(${particle.x}px, ${particle.y}px, 0) translate(-50%, -50%) scale(${particleScale})`;
      }

      rafId = requestAnimationFrame(tick);
    };

    const onMouseMove = (event: MouseEvent) => {
      const { clientX: x, clientY: y } = event;
      target.x = x;
      target.y = y;
      setVisible(true);

      const now = performance.now();
      const dist = Math.hypot(x - lastSpawn.x, y - lastSpawn.y);
      if (dist >= SPAWN_DISTANCE_PX && now - lastSpawn.time >= SPAWN_INTERVAL_MS) {
        spawnParticle(x, y);
        lastSpawn = { x, y, time: now };
      }

      const el = document.elementFromPoint(x, y);
      setHovering(!!el?.closest(HOVER_SELECTOR));
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    const onVisibilityChange = () => {
      if (document.hidden) setVisible(false);
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    html.addEventListener("mouseleave", onMouseLeave);
    html.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("visibilitychange", onVisibilityChange);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
      html.removeEventListener("mouseleave", onMouseLeave);
      html.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      html.classList.remove("ai-cursor-active");
      particles.forEach((p) => p.el.remove());
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="ai-cursor-root pointer-events-none fixed inset-0 z-[99999] overflow-hidden opacity-0"
      aria-hidden
    >
      <div ref={particlesWrapRef} className="absolute inset-0" />
      <div ref={rippleRef} className="ai-cursor-ripple" />
      <div ref={ringRef} className="ai-cursor-ring" />
      <div ref={coreRef} className="ai-cursor-core" />
    </div>
  );
}
