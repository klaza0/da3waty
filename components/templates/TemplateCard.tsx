import { buttonClass } from "@/components/ui/button";
import { SUBSCRIPTION_PRICE_LABEL } from "@/lib/billing";
import { EVENT_TYPE_LABEL } from "@/lib/constants";
import type { InvitationTemplate } from "@/types/template";
import type { TemplateComponentKey } from "@/types/invitation";
import Link from "next/link";

const PREVIEW_SRC: Partial<Record<TemplateComponentKey, string>> = {
  classic: "/templates/classic/hero-clear-v2.webp",
  swans: "/templates/swans/hero-poster.jpg",
  cygnes: "/templates/swans/hero-poster.jpg",
  couple: "/templates/couple/illustration.jpg",
  rings: "/templates/rings/hero.jpg",
  sage: "/templates/sage/couple.jpg",
};

function TemplateThumb({ template }: { template: InvitationTemplate }) {
  const src = PREVIEW_SRC[template.componentKey];
  const accent = template.previewAccent;

  return (
    <div className="relative h-72 overflow-hidden" style={{ background: accent }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover object-top" />
      ) : (
        <div
          className="flex h-full flex-col items-center justify-center px-6 text-center"
          style={{
            background:
              template.componentKey === "luxury"
                ? "radial-gradient(circle at 50% 20%, #2a2418, #0c0b0a)"
                : template.componentKey === "moonlight"
                  ? "radial-gradient(circle at 50% 10%, #3d4d72, #1b2740)"
                  : template.componentKey === "nightrose"
                    ? "radial-gradient(circle at 50% 20%, #6b3040, #4a1d2b)"
                    : `linear-gradient(165deg, ${accent}55, ${accent})`,
          }}
        >
          <span className="mb-4 h-1 w-16 rounded-full" style={{ background: template.componentKey === "luxury" || template.componentKey === "moonlight" ? "#d4af37" : "#fff8" }} />
          <p className="font-display text-3xl leading-tight text-white drop-shadow">{template.name}</p>
          <p className="mt-2 text-xs tracking-[0.2em] text-white/80">{EVENT_TYPE_LABEL[template.category]}</p>
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
}

export function TemplateCard({ template, canUse = false }: { template: InvitationTemplate; canUse?: boolean }) {
  return (
    <article className="overflow-hidden rounded-[1.7rem] border border-line bg-card shadow-soft">
      <TemplateThumb template={template} />
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-2xl">{template.name}</h3>
          <span className="rounded-full bg-ivory px-3 py-1 text-xs text-muted">
            {EVENT_TYPE_LABEL[template.category]}
          </span>
        </div>
        <p className="text-xs font-medium text-gold-deep">ضمن الاشتراك · {SUBSCRIPTION_PRICE_LABEL} مرة واحدة</p>
        <p className="text-sm leading-7 text-muted">{template.description}</p>
        <Link href={canUse ? `/create/${template.slug}` : "/subscribe"} className={buttonClass("primary", "md", "w-full")}>
          {canUse ? "استخدام التصميم" : "اشترك للاستخدام"}
        </Link>
      </div>
    </article>
  );
}
