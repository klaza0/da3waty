import { TemplateCard } from "@/components/templates/TemplateCard";
import { buttonClass } from "@/components/ui/button";
import { hasFullAccess } from "@/lib/billing";
import { EVENT_TYPES } from "@/lib/constants";
import { getCurrentUser } from "@/lib/invitations/queries";
import { getActiveTemplates } from "@/lib/templates/catalog";
import Link from "next/link";

export async function TemplatesPreview() {
  const user = await getCurrentUser();
  const canUse = hasFullAccess(user?.plan, user?.role);
  const templates = getActiveTemplates().slice(0, 6);

  return (
    <section id="templates" className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-sm tracking-[0.25em] text-gold-deep">التصميمات</p>
      <h2 className="mt-3 font-display text-3xl">اختار التصميم اللي يشبهك</h2>
      <div className="mt-6 flex flex-wrap gap-2 text-sm text-muted">
        {EVENT_TYPES.map((item) => (
          <span key={item.value} className="rounded-full border border-line bg-white px-3 py-1">
            {item.label}
          </span>
        ))}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} canUse={canUse} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/templates" className={buttonClass("secondary", "md")}>
          كل التصميمات
        </Link>
      </div>
    </section>
  );
}
