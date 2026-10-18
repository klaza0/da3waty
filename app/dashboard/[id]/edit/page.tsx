import { InvitationBuilder } from "@/components/builder/InvitationBuilder";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { hasFullAccess } from "@/lib/billing";
import { getCurrentUser } from "@/lib/invitations/queries";
import { mapInvitationRow } from "@/lib/invitations/map";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { getTemplateById } from "@/lib/templates/catalog";
import { notFound, redirect } from "next/navigation";

export default async function EditInvitationPage({ params }: { params: Promise<{ id: string }> }) {
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
  const { data: gallery } = await supabase
    .from("invitation_gallery")
    .select("image_url")
    .eq("invitation_id", id)
    .order("sort_order");
  const template = getTemplateById(invitation.template_id);
  if (!template) notFound();

  return (
    <div className="min-h-dvh">
      <SiteHeader userEmail={user.email} isAdmin={user.role === "admin"} />
      <InvitationBuilder
        template={template}
        isLoggedIn
        plan={user.plan}
        role={user.role}
        initial={mapInvitationRow(
          invitation,
          (gallery ?? []).map((item) => item.image_url),
        )}
      />
    </div>
  );
}
