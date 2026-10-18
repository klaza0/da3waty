import { formatEventTime } from "@/lib/date";
import { OCCASION_HEADLINE } from "@/lib/invite-copy";
import type { EventType, InvitationData, TemplateComponentKey } from "@/types/invitation";

export type CinematicThemeId = Extract<
  TemplateComponentKey,
  "swans" | "moonlight" | "gardenbloom" | "nightrose"
>;

export interface CinematicTheme {
  id: CinematicThemeId;
  category: EventType;
  paper: string;
  ink: string;
  gold: string;
  rose: string;
  envelopeSrc?: string;
  videoSrc?: string;
  posterSrc?: string;
  overlaySrc?: string;
  leftFlowerSrc?: string;
  rightFlowerSrc?: string;
  dividerSrc?: string;
  countdownPanelSrc?: string;
  timelineSrc?: string;
  flowerDotSrc?: string;
  rsvpPanelSrc?: string;
  footerSrc?: string;
  envelopeTitle: string;
  openHint: string;
  heroEyebrow: (eventLabel: string) => string;
  greeting: string;
}

export const CINEMATIC_THEMES: Record<CinematicThemeId, CinematicTheme> = {
  swans: {
    id: "swans",
    category: "engagement",
    paper: "#fbf2e3",
    ink: "#79695d",
    gold: "#a48642",
    rose: "#7b2c3d",
    envelopeSrc: "/templates/swans/envelope-pink.webp",
    videoSrc: "/templates/swans/hero-background.mp4",
    posterSrc: "/templates/swans/hero-poster.jpg",
    overlaySrc: "/templates/swans/swans.webp",
    leftFlowerSrc: "/templates/swans/left-flowers.png",
    rightFlowerSrc: "/templates/swans/right-flowers.png",
    dividerSrc: "/templates/swans/divider.png",
    countdownPanelSrc: "/templates/swans/countdown-panel.webp",
    timelineSrc: "/templates/swans/timeline.webp",
    flowerDotSrc: "/templates/swans/flower-dot.png",
    rsvpPanelSrc: "/templates/swans/rsvp-panel.webp",
    footerSrc: "/templates/swans/footer.jpg",
    envelopeTitle: "دعوة خاصة",
    openHint: "اضغطوا على الختم لفتح الدعوة",
    heroEyebrow: (eventLabel) => `موعد ${eventLabel}`,
    greeting: "يسعدنا أن ندعو حضرتكم لمشاركتنا الفرحة.",
  },
  moonlight: {
    id: "moonlight",
    category: "wedding",
    paper: "#f4efe6",
    ink: "#d7c7a2",
    gold: "#e0c078",
    rose: "#1b2740",
    envelopeTitle: "ليلة القمر",
    openHint: "افتحوا الظرف الذهبي",
    heroEyebrow: () => "تحت ضوء القمر",
    greeting: "ليلة هادئة، وفرحة تكتمل بحضوركم.",
  },
  gardenbloom: {
    id: "gardenbloom",
    category: "henna",
    paper: "#f6f1e4",
    ink: "#5c4a38",
    gold: "#8c6b3a",
    rose: "#5d6f4f",
    envelopeTitle: "حديقة الذهب",
    openHint: "افتحوا دعوة الحديقة",
    heroEyebrow: () => "بين الورد والذهب",
    greeting: "أجواء الحديقة بانتظاركم، والحنة أحلى بوجودكم.",
  },
  nightrose: {
    id: "nightrose",
    category: "wedding",
    paper: "#f8efe8",
    ink: "#ead7c4",
    gold: "#d4a574",
    rose: "#4a1d2b",
    envelopeTitle: "ورد الليل",
    openHint: "افتحوا الظرف المخملي",
    heroEyebrow: () => "سهرة على ضوء الشموع",
    greeting: "سهرة دافئة، وتفاصيل مخملية تليق بيومكم.",
  },
};

export function displayName(value: string, fallback: string) {
  const trimmed = value.trim();
  return trimmed || fallback;
}

export function mapsEmbedUrl(address: string, mapUrl?: string) {
  const query = address.trim() || mapUrl || "";
  if (!query) return "";
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed&hl=ar`;
}

function shiftTime(time: string, hours: number) {
  const safe = time.length >= 4 ? time : "19:00";
  const [hour = 19, minute = 0] = safe.split(":").map(Number);
  const date = new Date(2000, 0, 1, hour, minute);
  date.setHours(date.getHours() + hours);
  const next = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  return formatEventTime(next);
}

export function programItems(data: InvitationData): { time: string; label: string; description?: string }[] {
  if (Array.isArray(data.program)) {
    return data.program
      .filter((item) => item?.title?.trim())
      .map((item) => ({ time: formatEventTime(item.time || data.eventTime), label: item.title, description: item.description }));
  }
  const labels: Record<EventType, string[]> = {
    wedding: ["حضور المعازيم", "فقرة ترفيهية", "لبس الدبل", "الزفة"],
    engagement: ["حضور المعازيم", "فقرة ترفيهية", "لبس الدبل", "الزفة"],
    henna: ["وصول الضيوف", "ليلة الحنة", "الدبكة والفرح", "الختام"],
    newborn: ["الاستقبال", "رؤية المولود", "توزيع الهدايا", "الختام"],
    "katb-ketab": ["حضور المعازيم", "تلاوة القرآن", "عقد القران", "التهنئة"],
  };
  return (labels[data.eventType] ?? labels.wedding).map((label, index) => ({
    time: shiftTime(data.eventTime, index),
    label,
  }));
}

export function occasionLine(eventType: EventType) {
  return OCCASION_HEADLINE[eventType];
}
