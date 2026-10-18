export type TemplateComponentKey =
  | "classic"
  | "luxury"
  | "romantic"
  | "floral"
  | "minimal"
  | "swans"
  | "moonlight"
  | "gardenbloom"
  | "nightrose"
  | "cygnes"
  | "couple"
  | "rings"
  | "sage";

export type EventType = "wedding" | "engagement" | "henna" | "newborn" | "katb-ketab";

export type InvitationLanguage = "ar" | "en";
export type OpeningStyle = "template";
export type NameFont =
  | "great-vibes"
  | "pinyon"
  | "playfair"
  | "georgia"
  | "didot"
  | "outfit"
  | "noto-arabic"
  | "amiri"
  | "cairo"
  | "reem-kufi"
  | "tajawal";
export type TitleColor = "gold" | "white" | "pink" | "blue" | "red" | "green" | "orange" | "black";

export interface ProgramItem {
  time: string;
  title: string;
  description?: string;
}

export type TemplateStyleTag =
  | "minimal"
  | "luxury"
  | "classic"
  | "floral"
  | "romantic"
  | "cinematic";

export interface InvitationData {
  id: string;
  slug: string;
  templateId: string;
  componentKey: TemplateComponentKey;
  groomName: string;
  brideName: string;
  eventType: EventType;
  eventDate: string;
  eventTime: string;
  venueName: string;
  address: string;
  mapUrl?: string;
  coverImage?: string;
  gallery?: string[];
  musicUrl?: string;
  showCountdown: boolean;
  showRSVP: boolean;
  showMessages: boolean;
  showGallery: boolean;
  showMusic: boolean;
  published?: boolean;
  language?: InvitationLanguage;
  openingStyle?: OpeningStyle;
  nameFont?: NameFont;
  nameColor?: string;
  titleColor?: TitleColor;
  address2?: string;
  welcomeText?: string;
  customNotesEnabled?: boolean;
  customNotes?: string;
  showAttendeeCount?: boolean;
  attendingCount?: number;
  quranEnabled?: boolean;
  quranSurah?: string;
  calligraphyEnabled?: boolean;
  program?: ProgramItem[];
  giftsEnabled?: boolean;
  giftsText?: string;
  whatsapp?: string;
  phone?: string;
  privateAccess?: boolean;
  accessCode?: string;
  timeFormat12h?: boolean;
}

export interface PublicMessage {
  id: string;
  guestName: string;
  message: string;
  createdAt: string;
}

export interface InvitationStats {
  visits: number;
  attending: number;
  declined: number;
  messages: number;
}
