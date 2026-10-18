"use server";

import { hasFullAccess, SUBSCRIPTION_PRICE_LABEL } from "@/lib/billing";
import { toSettingsPayload } from "@/lib/design-studio";
import { invitationFormSchema } from "@/lib/validations/invitation";
import { buildCoupleSlug, isValidSlug, nextSlugCandidate } from "@/lib/slug";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { getTemplateById } from "@/lib/templates/catalog";
import type { Json } from "@/types/database";
import type { EventType, InvitationData } from "@/types/invitation";
import { revalidatePath } from "next/cache";

export async function saveInvitation(input: {
  id?: string;
  templateId: string;
  groomName: string;
  brideName: string;
  eventType: EventType;
  eventDate: string;
  eventTime: string;
  venueName: string;
  address: string;
  mapUrl?: string;
  slug?: string;
  coverImage?: string;
  gallery?: string[];
  musicUrl?: string;
  showCountdown: boolean;
  showRSVP: boolean;
  showMessages: boolean;
  showGallery: boolean;
  showMusic: boolean;
  published?: boolean;
} & Partial<InvitationData>) {
  if (!isSupabaseConfigured()) {
    return { error: "أضف بيانات Supabase في ملف البيئة ثم أعد المحاولة." };
  }

  const parsed = invitationFormSchema.safeParse({
    ...input,
    mapUrl: input.mapUrl ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير مكتملة" };
  }

  const template = getTemplateById(input.templateId);
  if (!template) return { error: "التصميم غير موجود." };

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub ? String(claimsData.claims.sub) : null;
  if (!userId) return { error: "يلزم تسجيل الدخول لحفظ الدعوة." };

  const { data: profile } = await supabase.from("profiles").select("plan, role").eq("id", userId).maybeSingle();
  if (!hasFullAccess(profile?.plan, profile?.role)) {
    return { error: `نشر الدعوة يتطلب اشتراك الموقع (${SUBSCRIPTION_PRICE_LABEL} مرة واحدة).` };
  }

  const baseSlug = input.slug && isValidSlug(input.slug)
    ? input.slug
    : buildCoupleSlug(input.groomName, input.brideName);

  let slug = baseSlug;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    slug = nextSlugCandidate(baseSlug, attempt);
    const { data: existing } = await supabase
      .from("invitations")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing || existing.id === input.id) break;
    if (attempt === 11) return { error: "تعذر إنشاء رابط فريد، جرّب أسماءً مختلفة." };
  }

  const payload = {
    user_id: userId,
    template_id: template.id,
    slug,
    groom_name: parsed.data.groomName,
    bride_name: parsed.data.brideName,
    event_type: parsed.data.eventType,
    event_date: parsed.data.eventDate,
    event_time: parsed.data.eventTime,
    venue_name: parsed.data.venueName,
    address: parsed.data.address,
    map_url: parsed.data.mapUrl || null,
    cover_image: input.coverImage || null,
    music_url: input.musicUrl || null,
    show_countdown: parsed.data.showCountdown,
    show_rsvp: parsed.data.showRSVP,
    show_messages: parsed.data.showMessages,
    show_gallery: parsed.data.showGallery,
    show_music: parsed.data.showMusic,
    published: Boolean(input.published),
    settings: toSettingsPayload(input as InvitationData) as unknown as Json,
  };

  const emptyId = "00000000-0000-4000-8000-000000000099";
  let invitationId = input.id && input.id !== emptyId ? input.id : undefined;

  if (invitationId) {
    const { error } = await supabase.from("invitations").update(payload).eq("id", invitationId).eq("user_id", userId);
    if (error) return { error: error.message.includes("template_id") ? "التصميم غير مسجّل في قاعدة البيانات." : "تعذر تحديث الدعوة." };
  } else {
    const { data, error } = await supabase.from("invitations").insert(payload).select("id").single();
    if (error || !data) {
      return {
        error: error?.message?.includes("template_id")
          ? "التصميم غير مسجّل في قاعدة البيانات."
          : error?.message ?? "تعذر حفظ الدعوة.",
      };
    }
    invitationId = data.id;
  }

  if (invitationId && input.gallery) {
    await supabase.from("invitation_gallery").delete().eq("invitation_id", invitationId);
    if (input.gallery.length) {
      await supabase.from("invitation_gallery").insert(
        input.gallery.map((image_url, sort_order) => ({
          invitation_id: invitationId!,
          image_url,
          sort_order,
        })),
      );
    }
  }

  revalidatePath("/dashboard");
  revalidatePath(`/invite/${slug}`);
  return { slug, id: invitationId };
}

export async function deleteInvitation(id: string) {
  if (!isSupabaseConfigured()) return { error: "Supabase غير متصل." };
  const supabase = await createClient();
  const { error } = await supabase.from("invitations").delete().eq("id", id);
  if (error) return { error: "تعذر حذف الدعوة." };
  revalidatePath("/dashboard");
  return { ok: true };
}
