"use server";

import {
  isEgyptianMobile,
  normalizeEgyptianPhone,
  normalizeTransactionRef,
  SUBSCRIPTION_PRICE_EGP,
  VODAFONE_CASH_NUMBER,
  hasFullAccess,
} from "@/lib/billing";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitSubscriptionPayment(input: { senderPhone: string; transactionRef: string }) {
  if (!isSupabaseConfigured()) {
    return { error: "أضف بيانات Supabase في ملف البيئة ثم أعد المحاولة." };
  }

  const senderPhone = normalizeEgyptianPhone(input.senderPhone);
  const transactionRef = normalizeTransactionRef(input.transactionRef);

  if (!isEgyptianMobile(senderPhone) || senderPhone === VODAFONE_CASH_NUMBER) {
    return { error: "اكتب رقم الموبايل الذي حوّلت منه، مثل 010xxxxxxxx." };
  }
  if (!/^[A-Z0-9]{6,40}$/.test(transactionRef)) {
    return { error: "اكتب رقم المعاملة كما يظهر في رسالة فودافون كاش." };
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub ? String(claimsData.claims.sub) : null;
  if (!userId) return { error: "يلزم تسجيل الدخول قبل إرسال بيانات الدفع." };

  const { data: profile } = await supabase.from("profiles").select("plan, role").eq("id", userId).maybeSingle();
  if (hasFullAccess(profile?.plan, profile?.role)) {
    return { error: "اشتراكك مفعّل بالفعل، ولا حاجة لدفعة جديدة." };
  }

  const { data: pending } = await supabase
    .from("subscription_payments")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "pending")
    .maybeSingle();
  if (pending) return { error: "لديك طلب دفع قيد المراجعة. انتظر التفعيل." };

  const { error } = await supabase.from("subscription_payments").insert({
    user_id: userId,
    amount_egp: SUBSCRIPTION_PRICE_EGP,
    wallet_number: VODAFONE_CASH_NUMBER,
    sender_phone: senderPhone,
    transaction_ref: transactionRef,
    status: "pending",
  });

  if (error) {
    if (error.code === "23505" && error.message.includes("transaction_ref")) {
      return { error: "رقم المعاملة مستخدم من قبل." };
    }
    if (error.code === "23505") return { error: "لديك طلب دفع قيد المراجعة." };
    return { error: "تعذر حفظ بيانات التحويل. راجع الرقم ورقم المعاملة." };
  }

  revalidatePath("/subscribe");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { ok: true as const };
}
