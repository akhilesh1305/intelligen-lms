import { getChallengeSlug, getChallengeWindow } from "@/lib/challenge-window";

export const WEEKDAY_SLOTS = [
  { slug: "mon", label: "Monday", short: "M", index: 1 },
  { slug: "tue", label: "Tuesday", short: "T", index: 2 },
  { slug: "wed", label: "Wednesday", short: "W", index: 3 },
  { slug: "thu", label: "Thursday", short: "T", index: 4 },
  { slug: "fri", label: "Friday", short: "F", index: 5 },
  { slug: "sat", label: "Saturday", short: "S", index: 6 },
  { slug: "sun", label: "Sunday", short: "S", index: 7 },
] as const;

export const DAILY_WEEKDAY_COUNT = WEEKDAY_SLOTS.length;
export const DAILY_QUESTIONS_MIN = 5;
export const DAILY_QUESTIONS_MAX = 10;

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date) {
  const d = startOfDay(date);
  d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCMilliseconds(d.getUTCMilliseconds() - 1);
  return d;
}

export function getDailyWeekBatchPrefix(date = new Date()) {
  const weekSlug = getChallengeSlug("WEEKLY", date);
  return `${weekSlug}-daily-`;
}

export function getWeekdayDayWindow(weekdayIndex: number, date = new Date()) {
  const { startsAt: weekStart } = getChallengeWindow("WEEKLY", date);
  const dayStart = new Date(weekStart);
  dayStart.setUTCDate(dayStart.getUTCDate() + (weekdayIndex - 1));
  return {
    startsAt: startOfDay(dayStart),
    endsAt: endOfDay(dayStart),
  };
}

export function getUtcWeekdayIndex(date = new Date()) {
  const day = date.getUTCDay();
  return day === 0 ? 7 : day;
}

export function getTodayWeekdaySlot(date = new Date()) {
  const index = getUtcWeekdayIndex(date);
  return WEEKDAY_SLOTS.find((slot) => slot.index === index) ?? WEEKDAY_SLOTS[0];
}

export function randomDailyQuestionCount() {
  return (
    DAILY_QUESTIONS_MIN +
    Math.floor(Math.random() * (DAILY_QUESTIONS_MAX - DAILY_QUESTIONS_MIN + 1))
  );
}

export function getDailyQuizStatus(
  weekdayIndex: number,
  date = new Date()
): "locked" | "today" | "missed" {
  const todayIndex = getUtcWeekdayIndex(date);
  if (weekdayIndex > todayIndex) return "locked";
  if (weekdayIndex === todayIndex) return "today";
  return "missed";
}

/** Each daily quiz is playable only during its 24-hour UTC window on that weekday. */
export function isDailyQuizPlayable(
  weekdayIndex: number,
  startsAt: Date,
  endsAt: Date,
  date = new Date()
) {
  if (getDailyQuizStatus(weekdayIndex, date) !== "today") return false;
  const now = date.getTime();
  return now >= startsAt.getTime() && now <= endsAt.getTime();
}

export function formatDailyQuizWindow(startsAt: Date, endsAt: Date) {
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  };
  return `${startsAt.toLocaleString("en-US", opts)} – ${endsAt.toLocaleString("en-US", opts)}`;
}
