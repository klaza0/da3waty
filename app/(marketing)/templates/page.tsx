import { TemplateCard } from "@/components/templates/TemplateCard";
import { hasFullAccess, SUBSCRIPTION_PRICE_LABEL } from "@/lib/billing";
import { getCurrentUser } from "@/lib/invitations/queries";
import { getActiveTemplates } from "@/lib/templates/catalog";

export default async function TemplatesPage() {
  const user = await getCurrentUser();
  const canUse = hasFullAccess(user?.plan, user?.role);
  const templates = getActiveTemplates();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl">التصميمات</h1>
      <p className="mt-2 text-muted">
        كل التصميمات ضمن اشتراك واحد قيمته {SUBSCRIPTION_PRICE_LABEL}، يُدفع مرة واحدة.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} canUse={canUse} />
        ))}
      </div>
    </div>
  );
}
