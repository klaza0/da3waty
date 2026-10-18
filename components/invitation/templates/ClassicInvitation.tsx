"use client";

import { GalleryGrid } from "@/components/invitation/sections/GalleryGrid";
import { Guestbook } from "@/components/invitation/sections/Guestbook";
import { QrCard } from "@/components/invitation/sections/QrCard";
import { RsvpForm } from "@/components/invitation/sections/RsvpForm";
import { ShareBar } from "@/components/invitation/sections/ShareBar";
import { StudioExtras } from "@/components/invitation/sections/StudioExtras";
import { Countdown } from "@/components/invitation/sections/Countdown";
import { formatEventDate, formatEventTime } from "@/lib/date";
import { coupleLine, occasionHeadline } from "@/lib/invite-copy";
import { mapsEmbedUrl, programItems } from "@/lib/templates/cinematic";
import { getSiteUrl } from "@/lib/utils";
import type { InvitationData, PublicMessage } from "@/types/invitation";
import "./classic.css";

export function ClassicInvitation({
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
  const { bride, groom, joined } = coupleLine(data);
  const eventLabel = occasionHeadline(data.eventType);
  const program = programItems(data);
  const embed = mapsEmbedUrl([data.address, data.address2].filter(Boolean).join(" "), data.mapUrl);
  const url = `${siteUrl ?? getSiteUrl()}/invite/${data.slug}`;
  const hero = data.coverImage || "/templates/classic/hero-clear-v2.webp";

  return (
    <div className="classic-invite">
      <section className="classic-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="classic-hero-art" src={hero} alt="" />
        {[0, 1, 2, 3, 4].map((item) => (
          <span key={item} className="classic-petal" style={{ left: `${18 + item * 16}%`, animationDelay: `${-item * 2.4}s` }} />
        ))}
        <div className="classic-hero-copy">
          <p className="invite-title">{eventLabel}</p>
          <h2 className="classic-hero-names invite-name">
            <span>{bride}</span>
            <small>و</small>
            <span>{groom}</span>
          </h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="classic-sprig" src="/templates/classic/sprig.webp" alt="" />
        </div>
        <a className="classic-scroll" href="#classic-details">
          تفاصيل الدعوة
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </section>

      <div className="classic-details" id="classic-details">
        <section className="classic-card">
          <p className="invite-title classic-section-title">موعد {eventLabel.replace("دعوة ", "")}</p>
          {data.eventDate ? <p className="classic-date">{formatEventDate(data.eventDate)}</p> : null}
          {data.eventTime ? <p className="classic-time">الساعة {formatEventTime(data.eventTime)}</p> : null}
        </section>

        <section className="classic-card">
          <p className="invite-title classic-section-title">بطاقة دعوة</p>
          <p className="classic-text">{data.welcomeText || "يسعدنا ويشرفنا أن ندعو حضرتكم لمشاركتنا فرحتنا"}</p>
          <p className="classic-subtle">بوجودكم تكتمل فرحتنا</p>
        </section>

        {data.showCountdown && data.eventDate ? (
          <section className="classic-card">
            <p className="invite-title classic-section-title">باقي على يوم مناسبتنا</p>
            <div className="classic-countdown">
              <Countdown eventDate={data.eventDate} eventTime={data.eventTime} />
            </div>
          </section>
        ) : null}

        <section className="classic-card">
          <p className="invite-title classic-section-title">نلتقي على خير في</p>
          <h3 className="classic-date">{data.venueName || "قاعة الاحتفال"}</h3>
          <p className="classic-subtle">{data.address}</p>
          {data.address2 ? <p className="classic-subtle">{data.address2}</p> : null}
          {embed ? (
            <div className="classic-map">
              <iframe title="خريطة المكان" src={embed} loading="lazy" />
            </div>
          ) : null}
          {data.mapUrl ? (
            <a className="classic-button" href={data.mapUrl} target="_blank" rel="noreferrer">
              الاتجاهات على خرائط جوجل
            </a>
          ) : null}
        </section>

        {program.length ? (
          <section className="classic-card">
            <p className="invite-title classic-section-title">برنامج الحفل</p>
            <ol className="classic-program">
              {program.map((item) => (
                <li key={`${item.time}-${item.label}`}>
                  <time>{item.time}</time>
                  <strong>{item.label}</strong>
                  {item.description ? <span className="classic-subtle">{item.description}</span> : null}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {data.showGallery && data.gallery?.length ? (
          <section className="classic-card">
            <p className="invite-title classic-section-title">الصور</p>
            <GalleryGrid images={data.gallery} />
          </section>
        ) : null}

        {data.showRSVP ? (
          <section className="classic-card">
            <p className="invite-title classic-section-title">تأكيد الحضور</p>
            <p className="classic-subtle">فرحتنا تكمل بوجودكم. يسعدنا نعرف إنكم هتكونوا معنا.</p>
            <RsvpForm invitationId={data.id} interactive={interactive} />
          </section>
        ) : null}

        {data.showMessages ? (
          <section className="classic-card">
            <p className="invite-title classic-section-title">كلماتكم تسعدنا</p>
            <Guestbook invitationId={data.id} messages={messages} interactive={interactive} />
          </section>
        ) : null}

        {data.quranEnabled || data.customNotesEnabled || data.giftsEnabled || data.whatsapp || data.phone || data.showAttendeeCount ? (
          <section className="classic-card">
            <StudioExtras data={data} />
          </section>
        ) : null}
      </div>

      <footer className="classic-footer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="classic-seal" src="/templates/classic/seal.webp" alt="" />
        <p>ننتظركم بكل الحب</p>
        <p className="invite-name mt-2 text-3xl">{joined}</p>
        {interactive ? (
          <>
            <ShareBar data={data} url={url} />
            <QrCard url={url} />
          </>
        ) : null}
      </footer>
    </div>
  );
}
