import type { InvitationData, PublicMessage } from "@/types/invitation";

export const DEMO_INVITATION: InvitationData = {
  id: "00000000-0000-4000-8000-000000000001",
  slug: "seif-sama",
  templateId: "66666666-6666-4666-8666-666666666666",
  componentKey: "swans",
  groomName: "سيف",
  brideName: "سما",
  eventType: "engagement",
  eventDate: "2026-11-06",
  eventTime: "19:00",
  venueName: "نادي الجلاء",
  address: "مصر الجديدة، القاهرة",
  mapUrl: "https://maps.google.com/?q=Al+Galaa+Club+Heliopolis+Cairo",
  showCountdown: true,
  showRSVP: true,
  showMessages: true,
  showGallery: false,
  showMusic: false,
  published: true,
};

export const DEMO_MESSAGES: PublicMessage[] = [
  {
    id: "demo-m1",
    guestName: "نور",
    message: "ألف مبروك يا أحلى عروسين، ربنا يتمملكم على خير.",
    createdAt: "2026-10-01T12:00:00.000Z",
  },
  {
    id: "demo-m2",
    guestName: "يوسف",
    message: "دايمًا فرحة، مستنيين اليوم الكبير.",
    createdAt: "2026-10-02T18:20:00.000Z",
  },
];
