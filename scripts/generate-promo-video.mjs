/**
 * IntelliGen LMS promo video — animated screen capture + TTS + ffmpeg.
 * Output: public/promo/intelligen-lms-promo.mp4
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import ffmpegPath from "ffmpeg-static";
import { EdgeTTS } from "node-edge-tts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "promo");
const TMP = path.join(OUT_DIR, "_tmp");

const BASE_URL =
  process.env.PROMO_BASE_URL ??
  "https://intelligen-web-production.up.railway.app";

const FADE_SEC = 0.55;
const FPS = 30;

/** @typedef {{ voice: string, rate?: string, pitch?: string, volume?: string, text: string, pauseMs?: number }} VoiceLine */

const SCENES = [
  {
    id: "01-hook",
    path: "/",
    minRecordSec: 10,
    transition: "fade",
    voiceLines: [
      {
        voice: "en-US-GuyNeural",
        rate: "+2%",
        pitch: "default",
        text: "Want to grow your skills without juggling five different apps?",
        pauseMs: 450,
      },
      {
        voice: "en-US-AriaNeural",
        rate: "+4%",
        pitch: "default",
        text: "Meet IntelliGen LMS — learning built for real careers.",
      },
    ],
  },
  {
    id: "02-courses",
    path: "/courses",
    minRecordSec: 12,
    transition: "slideleft",
    voiceLines: [
      {
        voice: "en-US-AriaNeural",
        rate: "+3%",
        pitch: "default",
        text: "Explore expert-led courses in development, design, data, and more. Learn with videos, quizzes, and assignments while your progress updates in real time.",
      },
    ],
  },
  {
    id: "03-paths",
    path: "/paths",
    minRecordSec: 10,
    transition: "slideright",
    voiceLines: [
      {
        voice: "en-US-AriaNeural",
        rate: "+3%",
        pitch: "default",
        text: "Follow structured learning paths or choose your own route. Your dashboard keeps courses, points, badges, and certificates in one place.",
      },
    ],
  },
  {
    id: "04-ai",
    path: "/ai",
    minRecordSec: 11,
    transition: "circleopen",
    voiceLines: [
      {
        voice: "en-US-GuyNeural",
        rate: "+2%",
        pitch: "default",
        text: "Not sure what to learn next?",
        pauseMs: 400,
      },
      {
        voice: "en-US-AriaNeural",
        rate: "+4%",
        pitch: "default",
        text: "AI tools help with interview prep, career advice, and custom roadmaps.",
      },
    ],
  },
  {
    id: "05-coach",
    path: "/coach",
    minRecordSec: 10,
    transition: "fadeblack",
    voiceLines: [
      {
        voice: "en-US-AriaNeural",
        rate: "+2%",
        pitch: "default",
        text: "The Corporate Coach gives personalized guidance. Stay motivated with leaderboards, challenges, and community features.",
      },
    ],
  },
  {
    id: "06-certificate",
    path: "/certificates/demo",
    minRecordSec: 10,
    transition: "dissolve",
    voiceLines: [
      {
        voice: "en-US-AriaNeural",
        rate: "+2%",
        pitch: "default",
        text: "Complete a course and earn a verified certificate you can print or share — proof of the skills you have built.",
      },
    ],
  },
  {
    id: "07-cta",
    path: "/register",
    minRecordSec: 11,
    transition: "fade",
    voiceLines: [
      {
        voice: "en-US-GuyNeural",
        rate: "+5%",
        pitch: "default",
        text: "IntelliGen LMS — learn without limits!",
        pauseMs: 400,
      },
      {
        voice: "en-US-AriaNeural",
        rate: "+5%",
        pitch: "default",
        text: "Join free today and start your next chapter.",
      },
    ],
  },
];

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: "inherit", ...opts });
  if (r.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(" ")}`);
  }
}

function runFfmpeg(args, quiet = false) {
  if (!ffmpegPath) throw new Error("ffmpeg-static not found");
  const r = spawnSync(ffmpegPath, args, {
    stdio: quiet ? "pipe" : "inherit",
    encoding: "utf8",
  });
  if (r.status !== 0) {
    throw new Error(`ffmpeg failed: ${args.join(" ")}`);
  }
  return r;
}

function getMediaDuration(file) {
  const r = spawnSync(ffmpegPath, ["-hide_banner", "-i", file], {
    encoding: "utf8",
  });
  const match = (r.stderr || "").match(
    /Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/
  );
  if (!match) return 8;
  const [, h, m, s] = match;
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

async function smoothScroll(page, toY) {
  await page.evaluate((y) => {
    window.scrollTo({ top: y, behavior: "smooth" });
  }, toY);
  await page.waitForTimeout(700);
}

async function runSceneAnimation(page, scene) {
  const totalMs = scene.minRecordSec * 1000;
  const start = Date.now();

  switch (scene.id) {
    case "01-hook": {
      await smoothScroll(page, 0);
      await page.waitForTimeout(500);
      await page.hover("h1").catch(() => {});
      await smoothScroll(page, 320);
      await smoothScroll(page, 720);
      await page.mouse.move(960, 400);
      await page.waitForTimeout(400);
      break;
    }
    case "02-courses": {
      await smoothScroll(page, 0);
      await smoothScroll(page, 380);
      await page
        .locator("a[href*='/courses/']")
        .first()
        .hover({ timeout: 3000 })
        .catch(() => {});
      await page.waitForTimeout(500);
      await smoothScroll(page, 700);
      break;
    }
    case "03-paths": {
      await smoothScroll(page, 0);
      await page.waitForTimeout(400);
      await page.locator("a[href*='/paths/']").first().hover().catch(() => {});
      await smoothScroll(page, 250);
      break;
    }
    case "04-ai": {
      await smoothScroll(page, 0);
      await page.waitForTimeout(300);
      await page.locator("button").first().click().catch(() => {});
      await page.waitForTimeout(600);
      await smoothScroll(page, 450);
      break;
    }
    case "05-coach": {
      await smoothScroll(page, 0);
      await smoothScroll(page, 300);
      await page.waitForTimeout(500);
      await smoothScroll(page, 0);
      break;
    }
    case "06-certificate": {
      await smoothScroll(page, 0);
      await page.mouse.move(960, 540);
      await page.waitForTimeout(800);
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(500);
      break;
    }
    case "07-cta": {
      await smoothScroll(page, 0);
      await page.locator("a[href='/register'], button").first().hover().catch(() => {});
      await page.waitForTimeout(700);
      break;
    }
    default:
      await smoothScroll(page, 200);
  }

  const elapsed = Date.now() - start;
  if (elapsed < totalMs) {
    await page.waitForTimeout(totalMs - elapsed);
  }
}

async function captureSceneVideos(browser) {
  fs.mkdirSync(TMP, { recursive: true });

  for (const scene of SCENES) {
    const url = `${BASE_URL}${scene.path}`;
    console.log(`Recording: ${url}`);

    const context = await browser.newContext({
      recordVideo: {
        dir: TMP,
        size: { width: 1920, height: 1080 },
      },
      viewport: { width: 1920, height: 1080 },
    });

    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(1000);
    await runSceneAnimation(page, scene);

    const video = page.video();
    await context.close();

    const rawPath = path.join(TMP, `${scene.id}-raw.webm`);
    await video.saveAs(rawPath);
  }
}

function makeSilenceMp3(ms, file) {
  runFfmpeg([
    "-y",
    "-f",
    "lavfi",
    "-i",
    "anullsrc=r=24000:cl=mono",
    "-t",
    String(ms / 1000),
    "-c:a",
    "libmp3lame",
    "-q:a",
    "5",
    file,
  ]);
}

async function speakLine(line, file) {
  const tts = new EdgeTTS({
    voice: line.voice,
    lang: "en-US",
    rate: line.rate ?? "default",
    pitch: line.pitch ?? "default",
    volume: "default",
    timeout: 30000,
  });
  // Plain text only — node-edge-tts escapes XML and wraps SSML itself.
  await tts.ttsPromise(line.text, file);
}

function concatAudio(files, out) {
  const inputs = files.flatMap((f) => ["-i", f]);
  const streamRefs = files.map((_, i) => `[${i}:a]`).join("");
  runFfmpeg([
    "-y",
    ...inputs,
    "-filter_complex",
    `${streamRefs}concat=n=${files.length}:v=0:a=1,aresample=44100[a]`,
    "-map",
    "[a]",
    "-c:a",
    "libmp3lame",
    "-q:a",
    "2",
    out,
  ]);
}

async function synthesizeVoice(scene) {
  const mp3 = path.join(TMP, `${scene.id}.mp3`);
  const lines = scene.voiceLines ?? [];

  if (lines.length === 0) {
    throw new Error(`Scene ${scene.id} has no voiceLines`);
  }

  const parts = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const part = path.join(TMP, `${scene.id}-vo-${i}.mp3`);
    console.log(`  → ${line.voice.split("-").pop()} (${line.rate ?? "default"})`);
    await speakLine(line, part);
    parts.push(part);

    if (line.pauseMs && i < lines.length - 1) {
      const gap = path.join(TMP, `${scene.id}-gap-${i}.mp3`);
      makeSilenceMp3(line.pauseMs, gap);
      parts.push(gap);
    }
  }

  if (parts.length === 1) {
    fs.copyFileSync(parts[0], mp3);
  } else {
    concatAudio(parts, mp3);
  }

  return mp3;
}

function buildSceneClip(scene) {
  const webm = path.join(TMP, `${scene.id}-raw.webm`);
  const mp3 = path.join(TMP, `${scene.id}.mp3`);
  const clip = path.join(TMP, `${scene.id}.mp4`);

  const rawDur = getMediaDuration(webm);
  const fadeOut = Math.max(0.2, rawDur - FADE_SEC);

  // Slow zoom (Ken Burns) + fade in/out, synced to voice
  const vf = [
    `fps=${FPS}`,
    "scale=2112:1188",
    `zoompan=z='min(1.02+0.00035*on,1.1)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=${FPS}`,
    `fade=t=in:st=0:d=${FADE_SEC}`,
    `fade=t=out:st=${fadeOut.toFixed(2)}:d=${FADE_SEC}`,
  ].join(",");

  runFfmpeg([
    "-y",
    "-i",
    webm,
    "-i",
    mp3,
    "-vf",
    vf,
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "19",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-af",
    "highpass=f=90,alimiter=limit=0.92",
    "-pix_fmt",
    "yuv420p",
    "-shortest",
    clip,
  ]);

  return clip;
}

function concatWithCrossfade(clips, scenes) {
  if (clips.length === 1) return clips[0];

  let current = clips[0];
  let currentScene = scenes[0];

  for (let i = 1; i < clips.length; i++) {
    const next = clips[i];
    const nextScene = scenes[i];
    const out = path.join(TMP, `merged-${i}.mp4`);
    const dur = getMediaDuration(current);
    const offset = Math.max(0.1, dur - FADE_SEC);
    const transition = nextScene.transition || "fade";

    console.log(`Crossfade ${i}: ${transition} @ ${offset.toFixed(2)}s`);

    runFfmpeg([
      "-y",
      "-i",
      current,
      "-i",
      next,
      "-filter_complex",
      `[0:v][1:v]xfade=transition=${transition}:duration=${FADE_SEC}:offset=${offset.toFixed(3)}[v];` +
        `[0:a][1:a]acrossfade=d=${FADE_SEC}[a]`,
      "-map",
      "[v]",
      "-map",
      "[a]",
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-crf",
      "19",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-pix_fmt",
      "yuv420p",
      out,
    ]);

    current = out;
    currentScene = nextScene;
  }

  const final = path.join(OUT_DIR, "intelligen-lms-promo.mp4");
  fs.copyFileSync(current, final);
  return final;
}

async function main() {
  console.log("IntelliGen LMS promo video (animated + multi-voice)");
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const skipCapture = process.env.SKIP_CAPTURE === "1";
  const hasCapture = SCENES.every((s) =>
    fs.existsSync(path.join(TMP, `${s.id}-raw.webm`))
  );

  if (!skipCapture || !hasCapture) {
    if (fs.existsSync(TMP)) {
      fs.rmSync(TMP, { recursive: true, force: true });
    }
    fs.mkdirSync(TMP, { recursive: true });

    const browser = await chromium.launch({ headless: true });
    try {
      await captureSceneVideos(browser);
    } finally {
      await browser.close();
    }
  } else {
    fs.mkdirSync(TMP, { recursive: true });
    console.log("Skipping screen capture (SKIP_CAPTURE=1, reusing footage)");
  }

  for (const scene of SCENES) {
    console.log(`Voice: ${scene.id}`);
    await synthesizeVoice(scene);
  }

  const clips = SCENES.map((scene) => {
    console.log(`Clip: ${scene.id}`);
    return buildSceneClip(scene);
  });

  const output = concatWithCrossfade(clips, SCENES);
  console.log(`\nDone: ${output}`);

  // Poster from first scene clip
  runFfmpeg([
    "-y",
    "-i",
    output,
    "-ss",
    "00:00:01.5",
    "-frames:v",
    "1",
    "-update",
    "1",
    path.join(OUT_DIR, "poster.png"),
  ]);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
