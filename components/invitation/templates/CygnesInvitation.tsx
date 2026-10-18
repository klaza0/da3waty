"use client";

import { GalleryGrid } from "@/components/invitation/sections/GalleryGrid";
import { Guestbook } from "@/components/invitation/sections/Guestbook";
import { QrCard } from "@/components/invitation/sections/QrCard";
import { RsvpForm } from "@/components/invitation/sections/RsvpForm";
import { ShareBar } from "@/components/invitation/sections/ShareBar";
import { StudioExtras } from "@/components/invitation/sections/StudioExtras";
import { pickQuran } from "@/lib/design-studio";
import { formatEventTime } from "@/lib/date";
import { coupleLine } from "@/lib/invite-copy";
import { mapsEmbedUrl, programItems } from "@/lib/templates/cinematic";
import { getSiteUrl } from "@/lib/utils";
import type { InvitationData, PublicMessage } from "@/types/invitation";
import { useEffect } from "react";
import "./cygnes.css";

function calendarParts(date: string) {
  if (!date) return null;
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return {
    month: new Intl.DateTimeFormat("ar-EG", { month: "long" }).format(parsed),
    day: new Intl.DateTimeFormat("ar-EG", { day: "numeric" }).format(parsed),
    year: new Intl.DateTimeFormat("ar-EG", { year: "numeric" }).format(parsed),
    weekday: new Intl.DateTimeFormat("ar-EG", { weekday: "long" }).format(parsed),
  };
}

export function CygnesInvitation({
  data,
  messages = [],
  interactive = true,
  siteUrl,
}: {
  data: InvitationData;
  messages?: PublicMessage[];
  interactive?: boolean;
  siteUrl?: string;
}) {
  const { bride, groom } = coupleLine(data);
  const program = programItems(data);
  const embed = mapsEmbedUrl([data.address, data.address2].filter(Boolean).join(" "), data.mapUrl);
  const url = `${siteUrl ?? getSiteUrl()}/invite/${data.slug}`;
  const cal = calendarParts(data.eventDate);
  const verse = data.quranEnabled ? pickQuran(data.quranSurah || "rum-21") : null;
  const hero = data.coverImage || "/templates/swans/hero-poster.jpg";

  useEffect(() => {
    if (!interactive) return;
    const video = document.getElementById("cygnes-hero-video") as HTMLVideoElement | null;
    video?.play().catch(() => undefined);
  }, [interactive]);

  return (
    <div className="cygnes">
      <section className="cygnes-hero">
        {interactive ? (
          <video
            id="cygnes-hero-video"
            muted
            playsInline
            loop
            preload="metadata"
            poster={hero}
            aria-hidden
          >
            <source src="/templates/swans/hero-background.mp4" type="video/mp4" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="cygnes-hero-video" src={hero} alt="" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cygnes-hero-art" src="/templates/swans/swans.webp" alt="" style={{ objectFit: "contain", mixBlendMode: "multiply", opacity: 0.55 }} />
        <div className="cygnes-hero-copy">
          <h1 className="invite-name">
            {bride}
            <small className="cygnes-amp">&</small>
            {groom}
          </h1>
        </div>
      </section>

      <div className="cygnes-body">
        {verse ? (
          <section className="cygnes-card">
            <p className="cygnes-verse">{verse.text}</p>
            <p className="mt-3 text-sm opacity-70">{verse.ref}</p>
          </section>
        ) : null}

        <section className="cygnes-card">
          <p className="cygnes-welcome">{data.welcomeText || "نتشرف بدعوتكم لمشاركتنا فرحتنا والاحتفال معنا بهذه المناسبة المباركة."}</p>
        </section>

        {cal ? (
          <section className="cygnes-card cygnes-cal">
            <p className="month invite-title">{cal.month}</p>
            <p className="day">{cal.day}</p>
            <p>{cal.weekday}</p>
            <p>{cal.year}</p>
            {data.eventTime ? <p className="mt-2">{formatEventTime(data.eventTime)}</p> : null}
          </section>
        ) : null}

        {program.length ? (
          <section className="cygnes-card">
            <h2 className="invite-title mb-4 text-2xl">تفاصيل الاحتفال</h2>
            <ol className="cygnes-program">
              {program.map((item) => (
                <li key={`${item.time}-${item.label}`}>
                  <time>{item.time}</time>
                  <h4 className="m-0 text-lg">{item.label}</h4>
                  {item.description ? <p className="m-0 text-sm opacity-70">{item.description}</p> : null}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {data.showGallery && data.gallery?.length ? (
          <section className="cygnes-card">
            <h2 className="invite-title mb-4 text-2xl">لحظاتنا الجميلة</h2>
            <GalleryGrid images={data.gallery} />
          </section>
        ) : null}

        <section className="cygnes-card">
          <h2 className="invite-title mb-2 text-2xl">كيفية الوصول</h2>
          <p>{data.venueName || "قاعة الاحتفال"}</p>
          <p className="text-sm opacity-80">{data.address}</p>
          {data.address2 ? <p className="text-sm opacity-80">{data.address2}</p> : null}
          {embed ? (
            <div className="cygnes-map">
              <iframe title="خريطة المكان" src={embed} loading="lazy" />
            </div>
          ) : null}
          {data.mapUrl ? (
            <a className="cygnes-link" href={data.mapUrl} target="_blank" rel="noreferrer">
              فتح خرائط Google
            </a>
          ) : null}
        </section>

        {data.showRSVP ? (
          <section className="cygnes-card">
            <h2 className="invite-title mb-2 text-2xl">تأكيد الحضور</h2>
            <RsvpForm invitationId={data.id} interactive={interactive} />
          </section>
        ) : null}

        {data.showMessages ? (
          <section className="cygnes-card">
            <h2 className="invite-title mb-2 text-2xl">دفتر التهاني</h2>
            <p className="mb-4 text-sm opacity-80">اتركوا تهانيكم للعروسين</p>
            <Guestbook invitationId={data.id} messages={messages} interactive={interactive} />
          </section>
        ) : null}

        {data.customNotesEnabled || data.giftsEnabled || data.whatsapp || data.phone || data.showAttendeeCount ? (
          <section className="cygnes-card">
            <StudioExtras data={data} hideQuran />
          </section>
        ) : null}

        {interactive ? (
          <section className="cygnes-card">
            <ShareBar data={data} url={url} />
            <QrCard url={url} />
          </section>
        ) : null}
      </div>
    </div>
  );
}
