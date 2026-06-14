import type { UrgencyLevel } from "@/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "Sin fecha";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Sin fecha";

  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "Sin registro";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin registro";

  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function addBusinessDays(from: Date, days: number) {
  const result = new Date(from);
  let added = 0;

  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      added += 1;
    }
  }

  return result;
}

export function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function matchesSearch(haystack: string, query: string) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;

  const normalizedHaystack = normalizeText(haystack);
  return normalizedQuery
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => normalizedHaystack.includes(token));
}

export function urgencyClasses(level: UrgencyLevel) {
  const classes: Record<UrgencyLevel, string> = {
    alta: "border-red-200 bg-red-50 text-danger",
    media: "border-orange-200 bg-orange-50 text-review",
    baja: "border-blue-200 bg-blue-50 text-navy"
  };

  return classes[level];
}

export function urgencyDotClasses(level: UrgencyLevel) {
  const classes: Record<UrgencyLevel, string> = {
    alta: "bg-danger",
    media: "bg-review",
    baja: "bg-navy"
  };

  return classes[level];
}

export function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}
