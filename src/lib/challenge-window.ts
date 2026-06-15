import type { ChallengePeriod } from "@prisma/client";

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

function startOfWeek(date: Date) {
  const d = startOfDay(date);
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}

function endOfWeek(date: Date) {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 7);
  end.setUTCMilliseconds(end.getUTCMilliseconds() - 1);
  return end;
}

export function getChallengeSlug(period: ChallengePeriod, date = new Date()) {
  if (period === "DAILY") {
    return `daily-${date.toISOString().slice(0, 10)}`;
  }
  const start = startOfWeek(date);
  const year = start.getUTCFullYear();
  const jan1 = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(
    ((start.getTime() - jan1.getTime()) / 86400000 + jan1.getUTCDay() + 1) / 7
  );
  return `weekly-${year}-W${String(week).padStart(2, "0")}`;
}

export function getChallengeWindow(period: ChallengePeriod, date = new Date()) {
  if (period === "DAILY") {
    return {
      slug: getChallengeSlug("DAILY", date),
      startsAt: startOfDay(date),
      endsAt: endOfDay(date),
    };
  }
  return {
    slug: getChallengeSlug("WEEKLY", date),
    startsAt: startOfWeek(date),
    endsAt: endOfWeek(date),
  };
}

export function getQuizBatchPrefix(period: ChallengePeriod, date = new Date()) {
  const { slug } = getChallengeWindow(period, date);
  return `${slug}-q`;
}
