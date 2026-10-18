import type {
  EventType,
  InvitationData,
  InvitationLanguage,
  NameFont,
  OpeningStyle,
  ProgramItem,
  TitleColor,
} from "@/types/invitation";

export const INVITE_LANGUAGES: { value: InvitationLanguage; label: string }[] = [
  { value: "ar", label: "العربية" },
  { value: "en", label: "الإنجليزية" },
];

export const NAME_FONTS: { value: NameFont; label: string }[] = [
  { value: "great-vibes", label: "Great Vibes" },
  { value: "pinyon", label: "Pinyon Script" },
  { value: "playfair", label: "Playfair" },
  { value: "georgia", label: "Georgia" },
  { value: "didot", label: "Didot" },
  { value: "outfit", label: "Outfit" },
  { value: "noto-arabic", label: "Noto Arabic" },
  { value: "amiri", label: "Amiri (كلاسيكي)" },
  { value: "cairo", label: "Cairo (حديث)" },
  { value: "reem-kufi", label: "Reem Kufi (كوفي)" },
  { value: "tajawal", label: "Tajawal (بسيط)" },
];

export const TITLE_COLORS: { value: TitleColor; label: string; hex: string }[] = [
  { value: "gold", label: "ذهبي", hex: "#c4a574" },
  { value: "white", label: "أبيض", hex: "#fff8ef" },
  { value: "pink", label: "وردي", hex: "#c45c6a" },
  { value: "blue", label: "أزرق", hex: "#3d5a80" },
  { value: "red", label: "أحمر", hex: "#9c2b2b" },
  { value: "green", label: "أخضر", hex: "#5d6f4f" },
  { value: "orange", label: "برتقالي", hex: "#c47a3a" },
  { value: "black", label: "أسود", hex: "#1a1410" },
];

export const QURAN_OPTIONS = [
  { value: "random", label: "اختيار عشوائي" },
  { value: "rum-21", label: "الروم — آية ٢١" },
  { value: "rum-21-fr", label: "Ar-Rum (Les Romains - Verset 21)" },
];

export const QURAN_VERSES: Record<string, { ref: string; text: string }> = {
  "rum-21": {
    ref: "سورة الروم — ٢١",
    text: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
  },
  "nisa-1": {
    ref: "سورة النساء — ١",
    text: "يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ وَخَلَقَ مِنْهَا زَوْجَهَا",
  },
};

export const GALLERY_MAX = 8;

export const DEFAULT_PROGRAM: ProgramItem[] = [
  { time: "16:00", title: "استقبال الضيوف", description: "فتح الأبواب واستقبال المدعوين" },
  { time: "17:00", title: "دخول العروسين", description: "بداية المراسم والاحتفال" },
];

export const DEFAULT_WELCOME = "يسعدنا ويشرفنا حضوركم لمشاركتنا فرحتنا.";

export function titleColorHex(color: TitleColor | undefined) {
  return TITLE_COLORS.find((item) => item.value === color)?.hex ?? "#c4a574";
}

export function pickQuran(surah: string) {
  if (surah === "random") {
    const keys = Object.keys(QURAN_VERSES);
    return QURAN_VERSES[keys[Math.floor(Math.random() * keys.length)]!]!;
  }
  return QURAN_VERSES[surah] ?? QURAN_VERSES["rum-21"]!;
}

export function studioDefaults(partial: Partial<InvitationData> = {}): Omit<
  InvitationData,
  "id" | "slug" | "templateId" | "componentKey"
> {
  return {
    groomName: "",
    brideName: "",
    eventType: "wedding",
    eventDate: "",
    eventTime: "17:00",
    venueName: "",
    address: "",
    showCountdown: true,
    showRSVP: true,
    showMessages: true,
    showGallery: true,
    showMusic: false,
    language: "ar",
    openingStyle: "template",
    nameFont: "amiri",
    nameColor: "#a48642",
    titleColor: "gold",
    welcomeText: DEFAULT_WELCOME,
    customNotesEnabled: false,
    showAttendeeCount: false,
    quranEnabled: false,
    quranSurah: "rum-21",
    calligraphyEnabled: true,
    program: DEFAULT_PROGRAM,
    giftsEnabled: false,
    privateAccess: false,
    timeFormat12h: true,
    ...partial,
  };
}

type SettingsBlob = Record<string, unknown>;

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asBool(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

export function parseSettings(raw: unknown): Partial<InvitationData> {
  if (!raw || typeof raw !== "object") return {};
  const value = raw as SettingsBlob;
  const program = Array.isArray(value.program)
    ? (value.program as ProgramItem[]).filter((item) => item && typeof item.title === "string")
    : undefined;
  return {
    language: value.language === "en" ? "en" : "ar",
    openingStyle: "template",
    nameFont: asString(value.nameFont, "amiri") as NameFont,
    nameColor: asString(value.nameColor, "#a48642"),
    titleColor: asString(value.titleColor, "gold") as TitleColor,
    address2: asString(value.address2) || undefined,
    welcomeText: asString(value.welcomeText, DEFAULT_WELCOME),
    customNotesEnabled: asBool(value.customNotesEnabled),
    customNotes: asString(value.customNotes) || undefined,
    showAttendeeCount: asBool(value.showAttendeeCount),
    quranEnabled: asBool(value.quranEnabled),
    quranSurah: asString(value.quranSurah, "rum-21"),
    calligraphyEnabled: asBool(value.calligraphyEnabled, true),
    program,
    giftsEnabled: asBool(value.giftsEnabled),
    giftsText: asString(value.giftsText) || undefined,
    whatsapp: asString(value.whatsapp) || undefined,
    phone: asString(value.phone) || undefined,
    privateAccess: asBool(value.privateAccess),
    accessCode: asString(value.accessCode) || undefined,
    timeFormat12h: asBool(value.timeFormat12h, true),
  };
}

export function toSettingsPayload(data: InvitationData) {
  return {
    language: data.language === "en" ? "en" : "ar",
    openingStyle: "template",
    nameFont: data.nameFont ?? "amiri",
    nameColor: data.nameColor ?? "#a48642",
    titleColor: data.titleColor ?? "gold",
    address2: data.address2 ?? "",
    welcomeText: data.welcomeText ?? DEFAULT_WELCOME,
    customNotesEnabled: Boolean(data.customNotesEnabled),
    customNotes: data.customNotes ?? "",
    showAttendeeCount: Boolean(data.showAttendeeCount),
    quranEnabled: Boolean(data.quranEnabled),
    quranSurah: data.quranSurah ?? "rum-21",
    calligraphyEnabled: data.calligraphyEnabled !== false,
    program: data.program ?? [],
    giftsEnabled: Boolean(data.giftsEnabled),
    giftsText: data.giftsText ?? "",
    whatsapp: data.whatsapp ?? "",
    phone: data.phone ?? "",
    privateAccess: Boolean(data.privateAccess),
    accessCode: data.accessCode ?? "",
    timeFormat12h: data.timeFormat12h !== false,
  };
}

export function eventTypeFromCategory(type: EventType) {
  return type;
}
