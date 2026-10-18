import { InvitationBuilder } from "@/components/builder/InvitationBuilder";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { hasFullAccess } from "@/lib/billing";
import { getCurrentUser } from "@/lib/invitations/queries";
import { getTemplateById } from "@/lib/templates/catalog";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function CreatePage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params;
  const template = getTemplateById(templateId);
  if (!template) notFound();
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/create/${template.slug}`);
  if (!hasFullAccess(user.plan, user.role)) redirect("/subscribe");

  return (
    <div className="min-h-dvh">
      <SiteHeader userEmail={user?.email} isAdmin={user?.role === "admin"} />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 pt-6 text-sm">
        <Link href="/templates" className="text-muted hover:text-ink">
          كل التصميمات
        </Link>
      </div>
      <InvitationBuilder
        template={template}
        isLoggedIn={Boolean(user)}
        plan={user?.plan}
        role={user?.role}
      />
    </div>
  );
}
