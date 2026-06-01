import { NextResponse } from "next/server";

export function startOfLocalDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addActiveDays(date: Date, activeDays: number, offDays: number[]) {
  const next = new Date(date);
  let added = 0;
  while (added < activeDays) {
    next.setDate(next.getDate() + 1);
    if (!offDays.includes(next.getDay())) added += 1;
  }
  return next;
}

export function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function pick<T>(items: T[], count: number) {
  return shuffle(items).slice(0, count);
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}
