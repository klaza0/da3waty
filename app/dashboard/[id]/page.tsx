import { SiteHeader } from "@/components/layout/SiteHeader";
import { hasFullAccess } from "@/lib/billing";
import { getCurrentUser } from "@/lib/invitations/queries";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { coupleTitle } from "@/lib/date";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function InvitationManagePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!hasFullAccess(user.plan, user.role)) redirect("/subscribe");
  if (!isSupabaseConfigured()) notFound();

  const { id } = await params;
  const supabase = await createClient();
  const { data: invitation } = await supabase
    .from("invitations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!invitation) notFound();

  const { data: rsvps } = await supabase
    .from("rsvps")
    .select("*")
    .eq("invitation_id", id)
    .order("created_at", { ascending: false });
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("invitation_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-dvh">
      <SiteHeader userEmail={user.email} isAdmin={user.role === "admin"} />
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
        <div>
          <Link href="/dashboard" className="text-sm text-muted">
            كل الدعوات
          </Link>
          <h1 className="mt-3 font-display text-3xl">
            {coupleTitle(invitation.groom_name, invitation.bride_name)}
          </h1>
        </div>
        <section className="rounded-[1.5rem] border border-line bg-white p-5">
          <h2 className="font-medium">تأكيد الحضور</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {(rsvps ?? []).length === 0 ? <li className="text-muted">لا ردود بعد.</li> : null}
            {(rsvps ?? []).map((item) => (
              <li key={item.id} className="flex justify-between border-b border-line py-2">
                <span>{item.guest_name}</span>
                <span>{item.attending ? "سيحضر" : "لن يستطيع"}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-[1.5rem] border border-line bg-white p-5">
          <h2 className="font-medium">التهاني</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {(messages ?? []).length === 0 ? <li className="text-muted">لا تهاني بعد.</li> : null}
            {(messages ?? []).map((item) => (
              <li key={item.id} className="rounded-2xl bg-ivory p-3">
                <p className="font-medium">{item.guest_name}</p>
                <p className="mt-1 leading-7 text-muted">{item.message}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
