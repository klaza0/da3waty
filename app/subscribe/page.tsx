import { SubscribeForm } from "@/components/billing/SubscribeForm";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { buttonClass } from "@/components/ui/button";
import { hasFullAccess, SUBSCRIPTION_PRICE_LABEL, VODAFONE_CASH_LABEL, VODAFONE_CASH_NUMBER } from "@/lib/billing";
import { getCurrentUser } from "@/lib/invitations/queries";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SubscribePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/subscribe");

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-dvh">
        <SiteHeader userEmail={user.email} isAdmin={user.role === "admin"} />
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <h1 className="font-display text-3xl">الاشتراك</h1>
          <p className="mt-3 text-muted">اربط مشروع Supabase لإتمام الدفع.</p>
        </div>
      </div>
    );
  }

  const paid = hasFullAccess(user.plan, user.role);
  const supabase = await createClient();
  const { data: payment } = paid
    ? { data: null }
    : await supabase
        .from("subscription_payments")
        .select("sender_phone, transaction_ref, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

  return (
    <div className="min-h-dvh">
      <SiteHeader userEmail={user.email} isAdmin={user.role === "admin"} showSubscribe={!paid} />
      <div className="mx-auto max-w-xl px-4 py-12">
        <p className="text-sm text-gold-deep">دفعة واحدة</p>
        <h1 className="mt-2 font-display text-4xl">اشتراك الموقع</h1>
        <p className="mt-3 leading-8 text-muted">
          {SUBSCRIPTION_PRICE_LABEL} تُدفع مرة واحدة، وبعد التفعيل يفتح الموقع بالكامل: كل التصميمات والنشر والتعديل، بدون تجديد.
        </p>

        {paid ? (
          <div className="mt-8 rounded-[1.8rem] border border-line bg-white p-6 shadow-soft">
            <h2 className="font-display text-2xl">اشتراكك مفعّل</h2>
            <p className="mt-2 text-sm leading-7 text-muted">دفعت مرة واحدة، وكل أدوات الموقع متاحة على حسابك.</p>
            <Link href="/templates" className={`${buttonClass("primary")} mt-6`}>
              إنشاء دعوة
            </Link>
          </div>
        ) : payment?.status === "pending" ? (
          <div className="mt-8 space-y-4 rounded-[1.8rem] border border-line bg-white p-6 shadow-soft">
            <h2 className="font-display text-2xl">بانتظار مراجعة التحويل</h2>
            <p className="text-sm leading-7 text-muted">
              استلمنا بياناتك. بعد مطابقة التحويل على {VODAFONE_CASH_NUMBER} ({VODAFONE_CASH_LABEL}) نفعّل الاشتراك.
            </p>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">حُوّل من</dt>
                <dd dir="ltr">{payment.sender_phone}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">رقم المعاملة</dt>
                <dd dir="ltr">{payment.transaction_ref}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="mt-8 rounded-[1.8rem] border border-line bg-white p-6 shadow-soft">
            {payment?.status === "rejected" ? (
              <p className="mb-4 rounded-2xl bg-rose/10 px-3 py-2 text-sm text-rose">
                لم يُقبل التحويل السابق. راجع الرقم ورقم المعاملة ثم أعد الإرسال.
              </p>
            ) : null}
            <SubscribeForm />
          </div>
        )}
      </div>
    </div>
  );
}
