"use server";

import { hasAdminAccess } from "@/lib/admin";
import { getCurrentUser } from "@/lib/invitations/queries";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  if (!isSupabaseConfigured()) return { error: "Supabase غير متصل." as const, user: null };
  const user = await getCurrentUser();
  if (!hasAdminAccess(user)) return { error: "غير مسموح." as const, user: null };
  return { error: null, user };
}

export async function adminSetPlan(userId: string, plan: "free" | "premium") {
  const gate = await requireAdmin();
  if (gate.error) return { error: gate.error };
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      plan,
      subscription_status: plan === "premium" ? "active" : "none",
    })
    .eq("id", userId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

export async function adminSetRole(userId: string, role: "user" | "admin") {
  const gate = await requireAdmin();
  if (gate.error) return { error: gate.error };
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

export async function adminDeleteInvitation(id: string) {
  const gate = await requireAdmin();
  if (gate.error) return { error: gate.error };
  const supabase = await createClient();
  const { error } = await supabase.from("invitations").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

export async function adminSetPublished(id: string, published: boolean) {
  const gate = await requireAdmin();
  if (gate.error) return { error: gate.error };
  const supabase = await createClient();
  const { error } = await supabase.from("invitations").update({ published }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

export async function adminSetTemplate(id: string, patch: { is_active?: boolean; is_premium?: boolean }) {
  const gate = await requireAdmin();
  if (gate.error) return { error: gate.error };
  const supabase = await createClient();
  const { error } = await supabase.from("templates").update(patch).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

export async function adminSetMessageApproved(id: string, approved: boolean) {
  const gate = await requireAdmin();
  if (gate.error) return { error: gate.error };
  const supabase = await createClient();
  const { error } = await supabase.from("messages").update({ approved }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

export async function adminReviewPayment(id: string, status: "approved" | "rejected") {
  const gate = await requireAdmin();
  if (gate.error) return { error: gate.error };
  const supabase = await createClient();
  const { data: payment } = await supabase
    .from("subscription_payments")
    .select("id, user_id, status")
    .eq("id", id)
    .maybeSingle();
  if (!payment) return { error: "طلب الدفع غير موجود." };
  if (payment.status !== "pending") return { error: "هذا الطلب تمت مراجعته." };

  if (status === "approved") {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ plan: "premium", subscription_status: "active", expires_at: null })
      .eq("id", payment.user_id);
    if (profileError) return { error: profileError.message };
  }

  const { error } = await supabase
    .from("subscription_payments")
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/subscribe");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function adminDeleteMessage(id: string) {
  const gate = await requireAdmin();
  if (gate.error) return { error: gate.error };
  const supabase = await createClient();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}
