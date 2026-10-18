import { coupleTitle, eventPhrase, formatEventDate } from "@/lib/date";
import type { InvitationData } from "@/types/invitation";

export function invitationShareText(data: InvitationData, url: string) {
  const title = coupleTitle(data.groomName, data.brideName);
  const occasion = eventPhrase(data.eventType, data.groomName, data.brideName);
  return [
    `يشرفنا حضوركم ${occasion}`,
    "",
    `📅 ${formatEventDate(data.eventDate)}`,
    `📍 ${data.venueName}`,
    "",
    "رابط الدعوة:",
    url,
    "",
    title,
  ].join("\n");
}

export function whatsappShareUrl(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
