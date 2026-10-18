import { deleteInvitation } from "@/app/actions/invitations";
import { signOut } from "@/app/actions/auth";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { buttonClass } from "@/components/ui/button";
import { hasFullAccess, SUBSCRIPTION_PRICE_LABEL } from "@/lib/billing";
import { coupleTitle } from "@/lib/date";
import { getCurrentUser } from "@/lib/invitations/queries";
import { invitationShareText, whatsappShareUrl } from "@/lib/share";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { getTemplateById } from "@/lib/templates/catalog";
import { getSiteUrl } from "@/lib/utils";
import { mapInvitationRow } from "@/lib/invitations/map";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-dvh">
        <SiteHeader userEmail={user.email} isAdmin={user.role === "admin"} />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="font-display text-3xl">دعواتي</h1>
          <p className="mt-3 text-muted">اربط مشروع Supabase لحفظ دعواتك هنا.</p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: invitations } = await supabase
    .from("invitations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const paid = hasFullAccess(user.plan, user.role);
  const ids = (invitations ?? []).map((item) => item.id);
  const { data: rsvps } = ids.length
    ? await supabase.from("rsvps").select("invitation_id, attending").in("invitation_id", ids)
    : { data: [] };
  const { data: messages } = ids.length
    ? await supabase.from("messages").select("invitation_id").in("invitation_id", ids)
    : { data: [] };

  return (
    <div className="min-h-dvh">
      <SiteHeader userEmail={user.email} isAdmin={user.role === "admin"} showSubscribe={!paid} />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl">دعواتي</h1>
            <p className="mt-1 text-sm text-muted">{user.email}</p>
          </div>
          <div className="flex gap-2">
            {user.role === "admin" ? (
              <Link href="/admin" className={buttonClass("gold")}>
                لوحة الأدمن
              </Link>
            ) : null}
            <Link href={paid ? "/templates" : "/subscribe"} className={buttonClass("primary")}>
              {paid ? "إنشاء دعوة" : "اشترك الآن"}
            </Link>
            <form action={signOut}>
              <button type="submit" className={buttonClass("secondary")}>
                خروج
              </button>
            </form>
          </div>
        </div>

        {!paid ? (
          <div className="mt-8 rounded-[1.8rem] border border-gold/40 bg-white px-6 py-6">
            <h2 className="font-display text-2xl">الموقع باشتراك مرة واحدة</h2>
            <p className="mt-2 text-sm leading-7 text-muted">
              {SUBSCRIPTION_PRICE_LABEL} على فودافون كاش تفتح كل التصميمات والنشر والتعديل، بدون تجديد.
            </p>
            <Link href="/subscribe" className={`${buttonClass("primary")} mt-5`}>
              ادفع وفعّل الحساب
            </Link>
          </div>
        ) : null}

        {(invitations ?? []).length === 0 ? (
          <div className="mt-14 rounded-[1.8rem] border border-dashed border-line bg-white px-6 py-16 text-center">
            <h2 className="font-display text-2xl">ما فيش دعوات لسه</h2>
            <p className="mt-2 text-muted">ابدأ بقالب جاهز، وعدّل البيانات، ثم انشر الرابط.</p>
            <Link href={paid ? "/templates" : "/subscribe"} className={`${buttonClass("primary")} mt-6`}>
              {paid ? "تصفح التصميمات" : "اشترك وابدأ دعوتك"}
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {(invitations ?? []).map((invitation) => {
              const template = getTemplateById(invitation.template_id);
              const attending = (rsvps ?? []).filter(
                (item) => item.invitation_id === invitation.id && item.attending,
              ).length;
              const messageCount = (messages ?? []).filter((item) => item.invitation_id === invitation.id).length;
              const mapped = mapInvitationRow(invitation);
              const shareUrl = `${getSiteUrl()}/invite/${invitation.slug}`;
              return (
                <article key={invitation.id} className="rounded-[1.6rem] border border-line bg-white p-5 shadow-soft">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl">
                        {coupleTitle(invitation.groom_name, invitation.bride_name)}
                      </h2>
                      <p className="mt-1 text-sm text-muted">{template?.name ?? "قالب"}</p>
                      <p className="mt-3 text-sm text-muted">
                        {invitation.visits_count} زيارة · {attending} حضروا · {messageCount} تهنئة
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/invite/${invitation.slug}`} className={buttonClass("secondary", "sm")} target="_blank">
                        عرض الدعوة
                      </Link>
                      <Link href={paid ? `/dashboard/${invitation.id}/edit` : "/subscribe"} className={buttonClass("secondary", "sm")}>
                        {paid ? "تعديل" : "اشترك للتعديل"}
                      </Link>
                      <Link href={paid ? `/dashboard/${invitation.id}` : "/subscribe"} className={buttonClass("secondary", "sm")}>
                        {paid ? "الردود" : "اشترك للردود"}
                      </Link>
                      <a
                        href={whatsappShareUrl(invitationShareText(mapped, shareUrl))}
                        className={buttonClass("gold", "sm")}
                        target="_blank"
                        rel="noreferrer"
                      >
                        مشاركة
                      </a>
                      <form
                        action={async () => {
                          "use server";
                          await deleteInvitation(invitation.id);
                        }}
                      >
                        <button type="submit" className={buttonClass("danger", "sm")}>
                          حذف
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
