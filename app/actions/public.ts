"use server";

import { messageSchema, rsvpSchema } from "@/lib/validations/invitation";
import { DEMO_INVITATION } from "@/lib/demo/seif-sama";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

function sanitize(text: string) {
  return text.replace(/[<>]/g, "").trim();
}

async function fingerprint() {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ua = headerList.get("user-agent") ?? "unknown";
  return `${ip}:${ua.slice(0, 80)}`;
}

export async function submitRsvp(input: { invitationId: string; guestName: string; attending: boolean }) {
  const parsed = rsvpSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  if (!isSupabaseConfigured()) {
    return { error: "الدعوة التجريبية لا تحفظ الردود حتى يتم ربط قاعدة البيانات." };
  }
  if (parsed.data.invitationId === DEMO_INVITATION.id) {
    return { error: "هذه دعوة تجريبية للعرض فقط." };
  }

  const supabase = await createClient();
  const { data: invitation } = await supabase
    .from("invitations")
    .select("id, slug, published, show_rsvp")
    .eq("id", parsed.data.invitationId)
    .maybeSingle();

  if (!invitation?.published || !invitation.show_rsvp) {
    return { error: "لا يمكن إرسال الرد على هذه الدعوة." };
  }

  const guestName = sanitize(parsed.data.guestName);
  const { count } = await supabase
    .from("rsvps")
    .select("id", { count: "exact", head: true })
    .eq("invitation_id", invitation.id)
    .eq("guest_name", guestName)
    .gte("created_at", new Date(Date.now() - 10 * 60 * 1000).toISOString());

  if ((count ?? 0) > 2) return { error: "تم إرسال ردود كثيرة خلال وقت قصير." };

  const { error } = await supabase.from("rsvps").insert({
    invitation_id: invitation.id,
    guest_name: guestName,
    attending: parsed.data.attending,
  });
  if (error) return { error: "تعذر حفظ الرد." };
  revalidatePath(`/invite/${invitation.slug}`);
  return { ok: true };
}

export async function submitMessage(input: { invitationId: string; guestName: string; message: string }) {
  const parsed = messageSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  if (!isSupabaseConfigured()) {
    return { error: "الدعوة التجريبية لا تحفظ التهاني حتى يتم ربط قاعدة البيانات." };
  }
  if (parsed.data.invitationId === DEMO_INVITATION.id) {
    return { error: "هذه دعوة تجريبية للعرض فقط." };
  }

  const supabase = await createClient();
  const { data: invitation } = await supabase
    .from("invitations")
    .select("id, slug, published, show_messages")
    .eq("id", parsed.data.invitationId)
    .maybeSingle();

  if (!invitation?.published || !invitation.show_messages) {
    return { error: "لا يمكن إرسال تهنئة على هذه الدعوة." };
  }

  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("invitation_id", invitation.id)
    .gte("created_at", since);

  if ((count ?? 0) >= 8) return { error: "محاولات كثيرة. حاول بعد قليل." };

  await fingerprint();

  const { error } = await supabase.from("messages").insert({
    invitation_id: invitation.id,
    guest_name: sanitize(parsed.data.guestName),
    message: sanitize(parsed.data.message),
    approved: true,
  });
  if (error) return { error: "تعذر إرسال التهنئة." };
  revalidatePath(`/invite/${invitation.slug}`);
  return { ok: true };
}

export async function recordVisit(slug: string) {
  if (!isSupabaseConfigured() || slug === DEMO_INVITATION.slug) return;
  try {
    const supabase = await createClient();
    await supabase.rpc("touch_invitation_visit", { p_slug: slug });
  } catch {
    // Visit counting should never block the invitation page.
  }
}
