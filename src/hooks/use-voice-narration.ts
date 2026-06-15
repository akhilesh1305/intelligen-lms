"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type NarrationState = "idle" | "loading" | "playing" | "paused";

let activeNarrationStop: (() => void) | null = null;

export function stripMarkdownForSpeech(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>`_]/g, "")
    .replace(/\n+/g, " ")
    .trim()
    .slice(0, 3000);
}

export function useVoiceNarration() {
  const [state, setState] = useState<NarrationState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const modeRef = useRef<"audio" | "speech" | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    modeRef.current = null;
    if (stopRef.current && activeNarrationStop === stopRef.current) {
      activeNarrationStop = null;
    }
    setState("idle");
  }, []);

  stopRef.current = cleanup;

  useEffect(() => () => cleanup(), [cleanup]);

  const pause = useCallback(() => {
    if (state !== "playing") return;
    if (modeRef.current === "audio" && audioRef.current) {
      audioRef.current.pause();
      setState("paused");
      return;
    }
    if (modeRef.current === "speech" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
      setState("paused");
    }
  }, [state]);

  const resume = useCallback(() => {
    if (state !== "paused") return;
    if (modeRef.current === "audio" && audioRef.current) {
      void audioRef.current.play();
      setState("playing");
      return;
    }
    if (modeRef.current === "speech" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
      setState("playing");
    }
  }, [state]);

  const speak = useCallback(
    async (rawText: string) => {
      activeNarrationStop?.();
      cleanup();

      const text = stripMarkdownForSpeech(rawText);
      if (!text) return;

      activeNarrationStop = stopRef.current;
      setState("loading");

      try {
        const res = await fetch("/api/ai/narrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          objectUrlRef.current = url;
          const audio = new Audio(url);
          audioRef.current = audio;
          modeRef.current = "audio";
          audio.onended = () => cleanup();
          audio.onerror = () => cleanup();
          await audio.play();
          setState("playing");
          return;
        }

        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.95;
          modeRef.current = "speech";
          utterance.onend = () => cleanup();
          utterance.onerror = () => cleanup();
          window.speechSynthesis.speak(utterance);
          setState("playing");
          return;
        }

        cleanup();
        throw new Error("Narration not available in this browser.");
      } catch {
        cleanup();
        throw new Error("Narration failed");
      }
    },
    [cleanup]
  );

  return { state, speak, pause, resume, stop: cleanup };
}
