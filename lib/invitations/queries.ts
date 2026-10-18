import { DEMO_INVITATION, DEMO_MESSAGES } from "@/lib/demo/seif-sama";
import { mapInvitationRow } from "@/lib/invitations/map";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { InvitationData, PublicMessage } from "@/types/invitation";

export async function getPublishedInvitation(slug: string): Promise<InvitationData | null> {
  if (!isSupabaseConfigured()) {
    return slug === DEMO_INVITATION.slug ? DEMO_INVITATION : null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) {
    return slug === DEMO_INVITATION.slug ? DEMO_INVITATION : null;
  }

  const { data: galleryRows } = await supabase
    .from("invitation_gallery")
    .select("image_url, sort_order")
    .eq("invitation_id", data.id)
    .order("sort_order", { ascending: true });

  return mapInvitationRow(
    data,
    (galleryRows ?? []).map((row) => row.image_url),
  );
}

export async function getAttendingCount(invitationId: string) {
  if (!isSupabaseConfigured()) return 0;
  const supabase = await createClient();
  const { count } = await supabase
    .from("rsvps")
    .select("*", { count: "exact", head: true })
    .eq("invitation_id", invitationId)
    .eq("attending", true);
  return count ?? 0;
}

export async function getApprovedMessages(invitationId: string): Promise<PublicMessage[]> {
  if (!isSupabaseConfigured()) {
    return invitationId === DEMO_INVITATION.id ? DEMO_MESSAGES : [];
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("id, guest_name, message, created_at")
    .eq("invitation_id", invitationId)
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(40);

  return (data ?? []).map((row) => ({
    id: row.id,
    guestName: row.guest_name,
    message: row.message,
    createdAt: row.created_at,
  }));
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) return null;
  const userId = String(data.claims.sub);
  const email = typeof data.claims.email === "string" ? data.claims.email : null;
  const { data: profile } = await supabase.from("profiles").select("plan, role, email").eq("id", userId).maybeSingle();
  const resolvedEmail = email ?? profile?.email ?? null;
  const isOwner = resolvedEmail?.toLowerCase() === "imontaser6@gmail.com";
  return {
    id: userId,
    email: resolvedEmail,
    plan: isOwner ? "premium" : (profile?.plan ?? "free"),
    role: isOwner || profile?.role === "admin" ? "admin" : "user",
  };
}
