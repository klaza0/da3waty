import type { Database } from "@/types/database";
import type { EventType, InvitationData, TemplateComponentKey } from "@/types/invitation";
import { parseSettings, studioDefaults } from "@/lib/design-studio";
import { getTemplateById } from "@/lib/templates/catalog";

type InvitationRow = Database["public"]["Tables"]["invitations"]["Row"];

const EVENT_TYPES: EventType[] = ["wedding", "engagement", "henna", "newborn", "katb-ketab"];

const LEGACY_EVENT_TYPES: Record<string, EventType> = {
  birthday: "newborn",
  other: "wedding",
};

const COMPONENT_KEYS: TemplateComponentKey[] = [
  "classic",
  "luxury",
  "romantic",
  "floral",
  "minimal",
  "swans",
  "moonlight",
  "gardenbloom",
  "nightrose",
  "cygnes",
  "couple",
  "rings",
  "sage",
];

export function toEventType(value: string): EventType {
  if (EVENT_TYPES.includes(value as EventType)) return value as EventType;
  return LEGACY_EVENT_TYPES[value] ?? "wedding";
}

export function toComponentKey(value: string): TemplateComponentKey {
  return COMPONENT_KEYS.includes(value as TemplateComponentKey)
    ? (value as TemplateComponentKey)
    : "classic";
}

export function mapInvitationRow(
  row: InvitationRow,
  gallery: string[] = [],
  componentKey?: string,
): InvitationData {
  const template = getTemplateById(row.template_id);
  const settings = parseSettings(row.settings);
  return {
    id: row.id,
    slug: row.slug,
    templateId: row.template_id,
    componentKey: toComponentKey(componentKey ?? template?.componentKey ?? row.template_id),
    ...studioDefaults(settings),
    groomName: row.groom_name,
    brideName: row.bride_name,
    eventType: toEventType(row.event_type),
    eventDate: row.event_date,
    eventTime: row.event_time,
    venueName: row.venue_name,
    address: row.address,
    mapUrl: row.map_url ?? undefined,
    coverImage: row.cover_image ?? undefined,
    gallery,
    musicUrl: row.music_url ?? undefined,
    showCountdown: row.show_countdown,
    showRSVP: row.show_rsvp,
    showMessages: row.show_messages,
    showGallery: row.show_gallery,
    showMusic: row.show_music,
    published: row.published,
  };
}
