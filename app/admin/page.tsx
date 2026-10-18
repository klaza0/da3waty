import {
  adminDeleteInvitation,
  adminDeleteMessage,
  adminReviewPayment,
  adminSetMessageApproved,
  adminSetPlan,
  adminSetPublished,
  adminSetRole,
  adminSetTemplate,
} from "@/app/actions/admin";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { buttonClass } from "@/components/ui/button";
import { hasAdminAccess, SITE_OWNER_EMAIL } from "@/lib/admin";
import { getCurrentUser } from "@/lib/invitations/queries";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (!hasAdminAccess(user)) redirect("/dashboard");
  if (!isSupabaseConfigured()) redirect("/dashboard");

  const supabase = await createClient();
  const [{ count: usersCount }, { count: invitationsCount }, { count: messagesCount }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("invitations").select("*", { count: "exact", head: true }),
    supabase.from("messages").select("*", { count: "exact", head: true }),
  ]);
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  const { data: invitations } = await supabase.from("invitations").select("*").order("created_at", { ascending: false });
  const { data: templates } = await supabase.from("templates").select("*").order("created_at", { ascending: true });
  const { data: messages } = await supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(40);
  const { data: payments } = await supabase
    .from("subscription_payments")
    .select("*")
    .order("created_at", { ascending: false });
  const emailByUser = new Map((users ?? []).map((item) => [item.id, item.email]));
  const pendingPayments = (payments ?? []).filter((item) => item.status === "pending").length;

  return (
    <div className="min-h-dvh">
      <SiteHeader userEmail={user.email} isAdmin />
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
        <div>
          <p className="text-sm text-gold-deep">مالك المنصة</p>
          <h1 className="font-display text-4xl">لوحة الأدمن</h1>
          <p className="mt-2 text-sm text-muted">{SITE_OWNER_EMAIL} لديه التحكم الكامل في المستخدمين والدعوات والتصميمات.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <Stat label="المستخدمون" value={usersCount ?? 0} />
          <Stat label="الدعوات" value={invitationsCount ?? 0} />
          <Stat label="التهاني" value={messagesCount ?? 0} />
          <Stat label="تحويلات بانتظار المراجعة" value={pendingPayments} />
        </div>

        <section className="space-y-4">
          <h2 className="font-display text-2xl">طلبات الاشتراك</h2>
          <p className="text-sm text-muted">١٠٠٠ جنيه مرة واحدة على فودافون كاش 01023645480. الموافقة تفعّل الموقع بالكامل للحساب.</p>
          <div className="overflow-x-auto rounded-[1.6rem] border border-line bg-white">
            <table className="w-full min-w-[760px] text-right text-sm">
              <thead className="bg-ivory text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">الحساب</th>
                  <th className="px-4 py-3 font-medium">حُوّل من</th>
                  <th className="px-4 py-3 font-medium">رقم المعاملة</th>
                  <th className="px-4 py-3 font-medium">الحالة</th>
                  <th className="px-4 py-3 font-medium">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {(payments ?? []).length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-muted" colSpan={5}>
                      لا توجد طلبات دفع بعد.
                    </td>
                  </tr>
                ) : null}
                {(payments ?? []).map((item) => (
                  <tr key={item.id} className="border-t border-line">
                    <td className="px-4 py-3">{emailByUser.get(item.user_id) ?? "—"}</td>
                    <td className="px-4 py-3" dir="ltr">
                      {item.sender_phone}
                    </td>
                    <td className="px-4 py-3" dir="ltr">
                      {item.transaction_ref}
                    </td>
                    <td className="px-4 py-3">
                      {item.status === "pending" ? "قيد المراجعة" : item.status === "approved" ? "مقبول" : "مرفوض"}
                    </td>
                    <td className="px-4 py-3">
                      {item.status === "pending" ? (
                        <div className="flex flex-wrap gap-2">
                          <form
                            action={async () => {
                              "use server";
                              await adminReviewPayment(item.id, "approved");
                            }}
                          >
                            <button className={buttonClass("primary", "sm")} type="submit">
                              قبول وتفعيل
                            </button>
                          </form>
                          <form
                            action={async () => {
                              "use server";
                              await adminReviewPayment(item.id, "rejected");
                            }}
                          >
                            <button className={buttonClass("danger", "sm")} type="submit">
                              رفض
                            </button>
                          </form>
                        </div>
                      ) : (
                        <span className="text-xs text-muted">تمت المراجعة</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl">المستخدمون</h2>
          <div className="overflow-x-auto rounded-[1.6rem] border border-line bg-white">
            <table className="w-full min-w-[640px] text-right text-sm">
              <thead className="bg-ivory text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">الإيميل</th>
                  <th className="px-4 py-3 font-medium">الخطة</th>
                  <th className="px-4 py-3 font-medium">الصلاحية</th>
                  <th className="px-4 py-3 font-medium">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {(users ?? []).map((item) => {
                  const owner = item.email?.toLowerCase() === SITE_OWNER_EMAIL;
                  return (
                    <tr key={item.id} className="border-t border-line">
                      <td className="px-4 py-3">
                        {item.email}
                        {owner ? <span className="mr-2 text-xs text-gold-deep">المالك</span> : null}
                      </td>
                      <td className="px-4 py-3">{item.plan === "premium" ? "مشترك" : "غير مشترك"}</td>
                      <td className="px-4 py-3">{item.role}</td>
                      <td className="px-4 py-3">
                        {owner ? (
                          <span className="text-xs text-muted">محمي</span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <form
                              action={async () => {
                                "use server";
                                await adminSetPlan(item.id, item.plan === "premium" ? "free" : "premium");
                              }}
                            >
                              <button className={buttonClass("secondary", "sm")} type="submit">
                                {item.plan === "premium" ? "إلغاء الاشتراك" : "تفعيل الاشتراك"}
                              </button>
                            </form>
                            <form
                              action={async () => {
                                "use server";
                                await adminSetRole(item.id, item.role === "admin" ? "user" : "admin");
                              }}
                            >
                              <button className={buttonClass("secondary", "sm")} type="submit">
                                {item.role === "admin" ? "إلغاء أدمن" : "جعله أدمن"}
                              </button>
                            </form>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl">التصميمات</h2>
          <div className="grid gap-3">
            {(templates ?? []).map((item) => (
              <article key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] border border-line bg-white p-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted">
                    {item.slug} · {item.is_active ? "ظاهر" : "مخفي"} · ضمن اشتراك الموقع
                  </p>
                </div>
                <div className="flex gap-2">
                  <form
                    action={async () => {
                      "use server";
                      await adminSetTemplate(item.id, { is_active: !item.is_active });
                    }}
                  >
                    <button className={buttonClass("secondary", "sm")} type="submit">
                      {item.is_active ? "إخفاء" : "إظهار"}
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl">كل الدعوات</h2>
          <div className="grid gap-3">
            {(invitations ?? []).length === 0 ? <p className="text-sm text-muted">لا توجد دعوات بعد.</p> : null}
            {(invitations ?? []).map((item) => (
              <article key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] border border-line bg-white p-4">
                <div>
                  <p className="font-display text-xl">
                    {item.groom_name} و {item.bride_name}
                  </p>
                  <p className="text-xs text-muted">
                    /invite/{item.slug} · {item.published ? "منشورة" : "مسودة"} · {item.visits_count} زيارة
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/invite/${item.slug}`} className={buttonClass("secondary", "sm")} target="_blank">
                    عرض
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await adminSetPublished(item.id, !item.published);
                    }}
                  >
                    <button className={buttonClass("secondary", "sm")} type="submit">
                      {item.published ? "إيقاف النشر" : "نشر"}
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await adminDeleteInvitation(item.id);
                    }}
                  >
                    <button className={buttonClass("danger", "sm")} type="submit">
                      حذف
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl">التهاني</h2>
          <div className="grid gap-3">
            {(messages ?? []).length === 0 ? <p className="text-sm text-muted">لا توجد تهاني بعد.</p> : null}
            {(messages ?? []).map((item) => (
              <article key={item.id} className="rounded-[1.4rem] border border-line bg-white p-4">
                <p className="text-sm font-medium">{item.guest_name}</p>
                <p className="mt-1 text-sm leading-7">{item.message}</p>
                <p className="mt-2 text-xs text-muted">{item.approved ? "مقبولة" : "بانتظار المراجعة"}</p>
                <div className="mt-3 flex gap-2">
                  <form
                    action={async () => {
                      "use server";
                      await adminSetMessageApproved(item.id, !item.approved);
                    }}
                  >
                    <button className={buttonClass("secondary", "sm")} type="submit">
                      {item.approved ? "إخفاء" : "قبول"}
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await adminDeleteMessage(item.id);
                    }}
                  >
                    <button className={buttonClass("danger", "sm")} type="submit">
                      حذف
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[1.6rem] border border-line bg-white p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-display text-4xl">{value}</p>
    </div>
  );
}
