"use client";

import { saveInvitation } from "@/app/actions/invitations";
import { InvitationView } from "@/components/invitation/InvitationView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hasFullAccess, SUBSCRIPTION_PRICE_LABEL } from "@/lib/billing";
import { IMAGE_MAX_BYTES, IMAGE_TYPES, MUSIC_MAX_BYTES, MUSIC_TYPES } from "@/lib/constants";
import {
  GALLERY_MAX,
  INVITE_LANGUAGES,
  NAME_FONTS,
  QURAN_OPTIONS,
  TITLE_COLORS,
  studioDefaults,
} from "@/lib/design-studio";
import { MUSIC_TRACKS } from "@/lib/invite-copy";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/client";
import { buildCoupleSlug } from "@/lib/slug";
import type { InvitationData, NameFont, TitleColor } from "@/types/invitation";
import type { InvitationTemplate } from "@/types/template";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

const emptyId = "00000000-0000-4000-8000-000000000099";

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-ivory/60 px-4 py-3 text-sm">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

export function InvitationBuilder({
  template,
  initial,
  isLoggedIn,
  plan = "free",
  role = "user",
}: {
  template: InvitationTemplate;
  initial?: InvitationData;
  isLoggedIn: boolean;
  plan?: string;
  role?: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<InvitationData>(() => ({
    id: initial?.id ?? emptyId,
    slug: initial?.slug ?? "preview",
    ...studioDefaults({
      ...initial,
      eventType: initial?.eventType ?? template.category,
      ...(template.componentKey === "cygnes" && !initial
        ? {
            quranEnabled: true,
            titleColor: "blue",
            nameFont: "great-vibes",
            nameColor: "#103943",
          }
        : {}),
      ...(template.componentKey === "couple" && !initial
        ? {
            quranEnabled: true,
            titleColor: "gold",
            nameFont: "great-vibes",
            nameColor: "#5a3d2b",
            welcomeText: "نتشرف بدعوتكم لمشاركتنا فرحة زفافنا والاحتفال معنا بهذه المناسبة المباركة.",
          }
        : {}),
      ...(template.componentKey === "rings" && !initial
        ? {
            language: "en",
            quranEnabled: false,
            titleColor: "red",
            nameFont: "pinyon",
            nameColor: "#6b2c3e",
            welcomeText: "we invite you to come to our engagement party",
            eventDate: "2026-02-07",
            eventTime: "20:00",
            venueName: "Rose Hall",
            address: "Teachers Club",
            program: [],
            showCountdown: false,
            showRSVP: false,
            showMessages: false,
            showGallery: false,
            calligraphyEnabled: false,
          }
        : {}),
      ...(template.componentKey === "sage" && !initial
        ? {
            language: "en",
            quranEnabled: false,
            titleColor: "green",
            nameFont: "pinyon",
            nameColor: "#1c1a18",
            eventDate: "2026-08-15",
            eventTime: "19:30",
            program: [],
            showCountdown: false,
            showRSVP: false,
            showMessages: false,
            showGallery: false,
            calligraphyEnabled: false,
          }
        : {}),
    }),
    ...(initial ?? {}),
    templateId: template.id,
    componentKey: template.componentKey,
  }));

  const preview = useMemo(
    () => ({
      ...data,
      slug: data.slug || buildCoupleSlug(data.groomName, data.brideName) || "preview",
      templateId: template.id,
      componentKey: template.componentKey,
    }),
    [data, template.componentKey, template.id],
  );

  function patch(partial: Partial<InvitationData>) {
    setData((current) => ({ ...current, ...partial }));
  }

  async function uploadFile(file: File, bucket: "invitation-images" | "invitation-music") {
    if (!isSupabaseConfigured()) throw new Error("اربط Supabase أولًا لرفع الملفات.");
    const isImage = bucket === "invitation-images";
    if (!(isImage ? IMAGE_TYPES : MUSIC_TYPES).includes(file.type)) throw new Error("نوع الملف غير مسموح.");
    if (file.size > (isImage ? IMAGE_MAX_BYTES : MUSIC_MAX_BYTES)) throw new Error("حجم الملف أكبر من المسموح.");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("سجّل الدخول لرفع الملفات.");
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: false,
      contentType: file.type,
    });
    if (uploadError) throw new Error(uploadError.message);
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  function publish() {
    setError(null);
    if (!isLoggedIn) {
      router.push("/register?next=/subscribe");
      return;
    }
    if (!hasFullAccess(plan, role)) {
      router.push("/subscribe");
      return;
    }
    start(async () => {
      const result = await saveInvitation({
        ...preview,
        id: initial?.id,
        published: true,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push(`/dashboard?created=${result.slug}`);
    });
  }

  const [previewCover, setPreviewCover] = useState(false);
  const needsPayment = isLoggedIn && !hasFullAccess(plan, role);
  const couplePreview = `${data.groomName.trim() || "العريس"} & ${data.brideName.trim() || "العروسة"}`;

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[minmax(340px,460px)_1fr]">
      <form
        className="space-y-4 rounded-[1.6rem] border border-line bg-white p-5"
        onSubmit={(event) => {
          event.preventDefault();
          publish();
        }}
      >
        <div>
          <p className="text-sm text-gold-deep">💍 تفاصيل الدعوة</p>
          <h1 className="font-display text-3xl">{template.name}</h1>
          {needsPayment ? (
            <p className="mt-2 rounded-2xl bg-ivory px-3 py-2 text-sm text-gold-deep">
              المعاينة متاحة. النشر والتعديل بعد اشتراك {SUBSCRIPTION_PRICE_LABEL} مرة واحدة.
            </p>
          ) : null}
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">لغة القالب</legend>
          <div className="flex flex-wrap gap-2">
            {INVITE_LANGUAGES.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => patch({ language: item.value })}
                className={`rounded-full px-3 py-1 text-xs ${data.language === item.value ? "bg-ink text-cream" : "border border-line"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">تخصيص</legend>
          <div>
            <Label>اسم العريس</Label>
            <Input value={data.groomName} onChange={(event) => patch({ groomName: event.target.value })} />
          </div>
          <div>
            <Label>اسم العروس</Label>
            <Input value={data.brideName} onChange={(event) => patch({ brideName: event.target.value })} />
          </div>
          <p className="text-xs text-muted">خط الأسماء</p>
          <div className="grid gap-2">
            {NAME_FONTS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => patch({ nameFont: item.value as NameFont })}
                className={`rounded-2xl border px-3 py-2 text-right ${data.nameFont === item.value ? "border-gold bg-ivory" : "border-line"}`}
              >
                <span className="block text-[11px] text-muted">{item.label}</span>
                <span data-name-font={item.value}>
                  <span className="invite-name block text-lg">{couplePreview}</span>
                </span>
              </button>
            ))}
          </div>
          <div>
            <Label>لون الأسماء</Label>
            <Input type="color" value={data.nameColor || "#a48642"} onChange={(event) => patch({ nameColor: event.target.value })} />
          </div>
          <p className="text-xs text-muted">لون عنوان الدعوة</p>
          <div className="flex flex-wrap gap-2">
            {TITLE_COLORS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => patch({ titleColor: item.value as TitleColor })}
                className={`rounded-full px-3 py-1 text-xs ${data.titleColor === item.value ? "ring-2 ring-ink" : "border border-line"}`}
                style={{ background: item.hex, color: item.value === "white" ? "#2c2416" : "#fff" }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="grid grid-cols-2 gap-3">
          <div>
            <Label>تاريخ الاحتفال</Label>
            <Input type="date" value={data.eventDate} onChange={(event) => patch({ eventDate: event.target.value })} />
          </div>
          <div>
            <Label>وقت البداية</Label>
            <Input type="time" value={data.eventTime} onChange={(event) => patch({ eventTime: event.target.value })} />
            <p className="mt-1 text-[11px] text-muted">Format 12h (AM / PM) عند العرض</p>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <Label>عنوان المكان</Label>
          <Input value={data.venueName} onChange={(event) => patch({ venueName: event.target.value })} placeholder="قاعة الاحتفالات" />
          <Input value={data.address} onChange={(event) => patch({ address: event.target.value })} placeholder="العنوان" />
          <Input value={data.mapUrl ?? ""} onChange={(event) => patch({ mapUrl: event.target.value })} placeholder="رابط خرائط جوجل" />
          <button type="button" className="text-sm text-rose" onClick={() => patch({ address2: data.address2 ?? "" })}>
            + إضافة عنوان ثاني
          </button>
          {data.address2 !== undefined ? (
            <Input value={data.address2} onChange={(event) => patch({ address2: event.target.value })} placeholder="عنوان ثاني" />
          ) : null}
        </fieldset>

        <fieldset>
          <Label>وصف الترحيب</Label>
          <textarea
            className="mt-1 min-h-24 w-full rounded-2xl border border-line px-4 py-3 text-sm"
            value={data.welcomeText ?? ""}
            onChange={(event) => patch({ welcomeText: event.target.value })}
          />
        </fieldset>

        <Toggle
          label="📌 تعليمات وملاحظات خاصة"
          checked={Boolean(data.customNotesEnabled)}
          onChange={(checked) => patch({ customNotesEnabled: checked })}
        />
        {data.customNotesEnabled ? (
          <textarea
            className="min-h-20 w-full rounded-2xl border border-line px-4 py-3 text-sm"
            value={data.customNotes ?? ""}
            onChange={(event) => patch({ customNotes: event.target.value })}
          />
        ) : null}

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">الصورة الرئيسية</legend>
          <Input
            type="file"
            accept={IMAGE_TYPES.join(",")}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              try {
                patch({ coverImage: await uploadFile(file, "invitation-images") });
              } catch (err) {
                setError(err instanceof Error ? err.message : "تعذر رفع الصورة");
              }
            }}
          />
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">🎵 الموسيقى الخلفية</legend>
          <div className="flex flex-wrap gap-2">
            {MUSIC_TRACKS.map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={() => patch({ musicUrl: track.src, showMusic: Boolean(track.src) })}
                className={`rounded-full px-3 py-1 text-xs ${
                  (track.src ? data.musicUrl === track.src : !data.musicUrl) ? "bg-ink text-cream" : "border border-line"
                }`}
              >
                {track.label}
              </button>
            ))}
          </div>
          <Input
            placeholder="رابط ملف MP3 مباشر (خاص)"
            value={data.musicUrl ?? ""}
            onChange={(event) => patch({ musicUrl: event.target.value, showMusic: Boolean(event.target.value) })}
          />
          <Input
            type="file"
            accept={MUSIC_TYPES.join(",")}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              try {
                patch({ musicUrl: await uploadFile(file, "invitation-music"), showMusic: true });
              } catch (err) {
                setError(err instanceof Error ? err.message : "تعذر رفع الملف الصوتي");
              }
            }}
          />
        </fieldset>

        <Toggle label="🕌 سورة من القرآن" checked={Boolean(data.quranEnabled)} onChange={(checked) => patch({ quranEnabled: checked })} />
        {data.quranEnabled ? (
          <select
            className="h-11 w-full rounded-2xl border border-line px-4"
            value={data.quranSurah}
            onChange={(event) => patch({ quranSurah: event.target.value })}
          >
            {QURAN_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        ) : null}

        <Toggle
          label={`معرض الصور ${data.gallery?.length ?? 0} / ${GALLERY_MAX}`}
          checked={data.showGallery}
          onChange={(checked) => patch({ showGallery: checked })}
        />
        {data.showGallery ? (
          <Input
            type="file"
            multiple
            accept={IMAGE_TYPES.join(",")}
            onChange={async (event) => {
              const files = Array.from(event.target.files ?? []).slice(0, GALLERY_MAX - (data.gallery?.length ?? 0));
              try {
                const urls = await Promise.all(files.map((file) => uploadFile(file, "invitation-images")));
                patch({ gallery: [...(data.gallery ?? []), ...urls].slice(0, GALLERY_MAX), showGallery: true });
              } catch (err) {
                setError(err instanceof Error ? err.message : "تعذر رفع الصور");
              }
            }}
          />
        ) : null}

        <Toggle label="📬 تأكيد الحضور (RSVP)" checked={data.showRSVP} onChange={(checked) => patch({ showRSVP: checked })} />
        <Toggle
          label="👥 إظهار عدد الأشخاص المؤكدين"
          checked={Boolean(data.showAttendeeCount)}
          onChange={(checked) => patch({ showAttendeeCount: checked })}
        />
        <Toggle label="📖 دفتر التهاني" checked={data.showMessages} onChange={(checked) => patch({ showMessages: checked })} />
        <Toggle
          label="✨ عنوان المناسبة والتخطيط العربي"
          checked={data.calligraphyEnabled !== false}
          onChange={(checked) => patch({ calligraphyEnabled: checked })}
        />
        <Toggle label="⏳ العد التنازلي" checked={data.showCountdown} onChange={(checked) => patch({ showCountdown: checked })} />

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">⏳ برنامج الحفل</legend>
          {(data.program ?? []).map((item, index) => (
            <div key={`${item.title}-${index}`} className="space-y-2 rounded-2xl border border-line p-3">
              <Input
                type="time"
                value={item.time}
                onChange={(event) => {
                  const program = [...(data.program ?? [])];
                  program[index] = { ...item, time: event.target.value };
                  patch({ program });
                }}
              />
              <Input
                value={item.title}
                onChange={(event) => {
                  const program = [...(data.program ?? [])];
                  program[index] = { ...item, title: event.target.value };
                  patch({ program });
                }}
                placeholder="عنوان الفقرة"
              />
              <Input
                value={item.description ?? ""}
                onChange={(event) => {
                  const program = [...(data.program ?? [])];
                  program[index] = { ...item, description: event.target.value };
                  patch({ program });
                }}
                placeholder="وصف قصير"
              />
              <button
                type="button"
                className="text-xs text-muted"
                onClick={() => patch({ program: (data.program ?? []).filter((_, i) => i !== index) })}
              >
                حذف الفقرة
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-sm text-rose"
            onClick={() => patch({ program: [...(data.program ?? []), { time: "18:00", title: "", description: "" }] })}
          >
            إضافة فقرة
          </button>
        </fieldset>

        <Toggle label="🎁 الهدايا والحصالة" checked={Boolean(data.giftsEnabled)} onChange={(checked) => patch({ giftsEnabled: checked })} />
        {data.giftsEnabled ? (
          <textarea
            className="min-h-20 w-full rounded-2xl border border-line px-4 py-3 text-sm"
            placeholder="رقم الحساب أو رابط الهدية"
            value={data.giftsText ?? ""}
            onChange={(event) => patch({ giftsText: event.target.value })}
          />
        ) : null}

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">📞 اختصارات التواصل</legend>
          <Input placeholder="رقم واتساب" value={data.whatsapp ?? ""} onChange={(event) => patch({ whatsapp: event.target.value })} />
          <Input placeholder="رقم الهاتف" value={data.phone ?? ""} onChange={(event) => patch({ phone: event.target.value })} />
        </fieldset>

        <Toggle label="🔒 تقييد الدخول" checked={Boolean(data.privateAccess)} onChange={(checked) => patch({ privateAccess: checked })} />
        {data.privateAccess ? (
          <Input placeholder="رمز الدخول" value={data.accessCode ?? ""} onChange={(event) => patch({ accessCode: event.target.value })} />
        ) : null}

        {error ? <p className="text-sm text-rose">{error}</p> : null}
        {!isLoggedIn ? (
          <p className="text-sm text-muted">
            للمعاينة لا تحتاج حسابًا. للنشر{" "}
            <Link className="text-rose" href="/register">
              أنشئ حسابًا
            </Link>
            .
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "جارٍ التفعيل..." : needsPayment ? `اشترك بـ ${SUBSCRIPTION_PRICE_LABEL}` : "تفعيل ونشر دعوتي"}
        </Button>
      </form>
      <div className="overflow-hidden rounded-[1.6rem] border border-line bg-ivory">
        <div className="flex items-center justify-between border-b border-line px-4 py-3 text-sm">
          <p className="text-muted">معاينة مباشرة — أي تعديل يظهر هنا</p>
          <button type="button" className="text-rose" onClick={() => setPreviewCover((value) => !value)}>
            {previewCover ? "عرض الدعوة مفتوحة" : "معاينة الغلاف"}
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto">
          <InvitationView key={previewCover ? "cover" : "open"} data={preview} interactive={previewCover} />
        </div>
      </div>
    </div>
  );
}
