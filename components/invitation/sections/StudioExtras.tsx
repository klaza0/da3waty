import { pickQuran } from "@/lib/design-studio";
import type { InvitationData } from "@/types/invitation";

export function StudioExtras({ data, hideQuran }: { data: InvitationData; hideQuran?: boolean }) {
  return (
    <div className="space-y-8 text-center">
      {!hideQuran && data.quranEnabled ? (
        <section>
          <p className="invite-title font-display text-2xl">🕌 آية من القرآن</p>
          <p className="mt-4 text-lg leading-10">{pickQuran(data.quranSurah || "rum-21").text}</p>
          <p className="mt-2 text-sm opacity-70">{pickQuran(data.quranSurah || "rum-21").ref}</p>
        </section>
      ) : null}
      {data.customNotesEnabled && data.customNotes ? (
        <section>
          <p className="invite-title font-display text-2xl">📌 ملاحظات خاصة</p>
          <p className="mt-3 whitespace-pre-line text-sm leading-8">{data.customNotes}</p>
        </section>
      ) : null}
      {data.showAttendeeCount ? (
        <p className="text-sm">👥 عدد المؤكدين: {data.attendingCount ?? 0}</p>
      ) : null}
      {data.giftsEnabled && data.giftsText ? (
        <section>
          <p className="invite-title font-display text-2xl">🎁 الهدايا والحصالة</p>
          <p className="mt-3 whitespace-pre-line text-sm leading-8">{data.giftsText}</p>
        </section>
      ) : null}
      {(data.whatsapp || data.phone) ? (
        <section className="flex flex-wrap justify-center gap-3">
          {data.whatsapp ? (
            <a className="rounded-full border border-current/30 px-4 py-2 text-sm" href={`https://wa.me/${data.whatsapp.replace(/[^\d+]/g, "")}`}>
              واتساب
            </a>
          ) : null}
          {data.phone ? (
            <a className="rounded-full border border-current/30 px-4 py-2 text-sm" href={`tel:${data.phone}`}>
              اتصال
            </a>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
