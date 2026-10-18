import type { EventType, InvitationData } from "@/types/invitation";

export const OCCASION_HEADLINE: Record<EventType, string> = {
  wedding: "دعوة زفاف",
  engagement: "دعوة خطوبة",
  henna: "حفل حناء",
  newborn: "حفل مولد",
  "katb-ketab": "دعوة عقد قران",
};

export function occasionHeadline(type: EventType) {
  return OCCASION_HEADLINE[type];
}

export function coupleLine(data: InvitationData) {
  const bride = data.brideName.trim() || "العروسة";
  const groom = data.groomName.trim() || "العريس";
  return { bride, groom, joined: `${bride} و ${groom}` };
}

export function coupleInitials(data: InvitationData) {
  const { bride, groom } = coupleLine(data);
  return `${groom.charAt(0)} & ${bride.charAt(0)}`;
}

export const MUSIC_TRACKS = [
  { id: "none", label: "بدون موسيقى", src: "" },
  { id: "golden-dusk", label: "غروب ذهبي", src: "/music/golden-dusk.wav" },
  { id: "quiet-garden", label: "حديقة هادئة", src: "/music/quiet-garden.wav" },
  { id: "soft-oud", label: "عود خفيف", src: "/music/soft-oud.wav" },
  { id: "moon-veil", label: "ستار القمر", src: "/music/moon-veil.wav" },
] as const;

export function resolveMusicUrl(data: InvitationData) {
  if (!data.showMusic) return "";
  return data.musicUrl?.trim() || "";
}
