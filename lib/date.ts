import type { EventType } from "@/types/invitation";
import { EVENT_TYPE_LABEL } from "@/lib/constants";

const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("ar-EG", {
  hour: "numeric",
  minute: "2-digit",
});

export function combineDateTime(date: string, time: string) {
  const normalized = time.length === 5 ? `${time}:00` : time;
  return new Date(`${date}T${normalized}`);
}

export function formatEventDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return dateFormatter.format(parsed);
}

export function formatEventTime(time: string) {
  const parsed = new Date(`1970-01-01T${time.length === 5 ? `${time}:00` : time}`);
  if (Number.isNaN(parsed.getTime())) return time;
  return timeFormatter.format(parsed);
}

export function coupleTitle(groomName: string, brideName: string) {
  return `${groomName} ❤️ ${brideName}`;
}

export function eventPhrase(eventType: EventType, groomName: string, brideName: string) {
  if (eventType === "newborn") return `مولود جديد ${groomName} و${brideName}`;
  return `${EVENT_TYPE_LABEL[eventType]} ${groomName} و${brideName}`;
}
