import type { EventType } from "@/types/invitation";

export const APP_NAME = "دعوتي";
export const APP_NAME_EN = "Da3waty";
export const TAGLINE = "اصنع دعوتك الإلكترونية في دقائق";
export const TAGLINE_ALT = "دعوتك... تبدأ من هنا";

export const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "wedding", label: "دعوة زواج" },
  { value: "engagement", label: "دعوة خطوبة" },
  { value: "henna", label: "حفل حناء" },
  { value: "newborn", label: "حفل مولد" },
  { value: "katb-ketab", label: "دعوة عقد قران" },
];

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  wedding: "دعوة زفاف",
  engagement: "دعوة خطوبة",
  henna: "حفل حناء",
  newborn: "حفل مولد",
  "katb-ketab": "دعوة عقد قران",
};

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const MUSIC_MAX_BYTES = 10 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const MUSIC_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/aac", "audio/mp4"];
