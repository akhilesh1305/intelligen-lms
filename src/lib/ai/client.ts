import { z } from "zod";

export function hasOpenAI() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function getModel() {
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

export async function chatCompletion(
  system: string,
  user: string,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: getModel(),
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1200,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

export async function chatJSON<T>(
  system: string,
  user: string,
  schema: z.ZodType<T>,
  options?: { temperature?: number; maxTokens?: number }
): Promise<{ data: T; source: "openai" } | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: getModel(),
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: options?.temperature ?? 0.6,
        max_tokens: options?.maxTokens ?? 3000,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) return null;
    const payload = await res.json();
    const raw = payload.choices?.[0]?.message?.content;
    if (!raw) return null;

    const parsed = schema.safeParse(JSON.parse(raw));
    if (!parsed.success) return null;
    return { data: parsed.data, source: "openai" };
  } catch {
    return null;
  }
}

export async function generateSpeech(text: string): Promise<Buffer | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text.slice(0, 4096),
        voice: "nova",
      }),
    });

    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}
