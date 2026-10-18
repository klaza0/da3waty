import { z } from "zod";
import { isValidSlug } from "@/lib/slug";

export const eventTypeSchema = z.enum(["wedding", "engagement", "henna", "newborn", "katb-ketab"]);

export const invitationFormSchema = z.object({
  templateId: z.string().min(1),
  groomName: z.string().trim().min(2, "اسم العريس مطلوب").max(60),
  brideName: z.string().trim().min(2, "اسم العروسة مطلوب").max(60),
  eventType: eventTypeSchema,
  eventDate: z.string().min(1, "التاريخ مطلوب"),
  eventTime: z.string().min(1, "الوقت مطلوب"),
  venueName: z.string().trim().min(2, "اسم المكان مطلوب").max(120),
  address: z.string().trim().min(2, "العنوان مطلوب").max(240),
  mapUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || /^https?:\/\//i.test(value), "رابط الخريطة غير صالح"),
  slug: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || isValidSlug(value), "الرابط يجب أن يحتوي حروفًا وأرقامًا وشرطات فقط"),
  showCountdown: z.boolean(),
  showRSVP: z.boolean(),
  showMessages: z.boolean(),
  showGallery: z.boolean(),
  showMusic: z.boolean(),
  welcomeText: z.string().trim().max(400).optional(),
  address2: z.string().trim().max(240).optional(),
  customNotes: z.string().trim().max(500).optional(),
  giftsText: z.string().trim().max(400).optional(),
  whatsapp: z.string().trim().max(40).optional(),
  phone: z.string().trim().max(40).optional(),
  accessCode: z.string().trim().max(40).optional(),
});

export const rsvpSchema = z.object({
  invitationId: z.string().uuid(),
  guestName: z.string().trim().min(2, "الاسم مطلوب").max(80),
  attending: z.boolean(),
});

export const messageSchema = z.object({
  invitationId: z.string().uuid(),
  guestName: z.string().trim().min(2, "الاسم مطلوب").max(80),
  message: z.string().trim().min(2, "اكتب تهنئة قصيرة").max(500),
});

export type InvitationFormValues = z.infer<typeof invitationFormSchema>;
