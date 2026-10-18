"use client";

import { Countdown } from "@/components/invitation/sections/Countdown";
import { GalleryGrid } from "@/components/invitation/sections/GalleryGrid";
import { Guestbook } from "@/components/invitation/sections/Guestbook";
import { QrCard } from "@/components/invitation/sections/QrCard";
import { RsvpForm } from "@/components/invitation/sections/RsvpForm";
import { ShareBar } from "@/components/invitation/sections/ShareBar";
import { StudioExtras } from "@/components/invitation/sections/StudioExtras";
import { pickQuran } from "@/lib/design-studio";
import { coupleLine } from "@/lib/invite-copy";
import { mapsEmbedUrl, programItems } from "@/lib/templates/cinematic";
import { getSiteUrl } from "@/lib/utils";
import type { InvitationData, PublicMessage } from "@/types/invitation";
import { motion } from "framer-motion";
import "./rings.css";

function dateParts(date: string, en: boolean) {
  if (!date) return null;
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  const locale = en ? "en-US" : "ar-EG";
  return {
    month: new Intl.DateTimeFormat(locale, { month: "long" }).format(parsed),
    day: new Intl.DateTimeFormat(locale, { day: "numeric" }).format(parsed),
    year: new Intl.DateTimeFormat(locale, { year: "numeric" }).format(parsed),
    weekday: new Intl.DateTimeFormat(locale, { weekday: "long" }).format(parsed),
  };
}

function clock(time: string, en: boolean) {
  const parsed = new Date(`1970-01-01T${time.length === 5 ? `${time}:00` : time}`);
  if (Number.isNaN(parsed.getTime())) return time;
  return new Intl.DateTimeFormat(en ? "en-US" : "ar-EG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

export function RingsInvitation({
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
  const en = data.language !== "ar";
  const names = coupleLine(data);
  const bride = data.brideName.trim() || (en ? "Bride" : names.bride);
  const groom = data.groomName.trim() || (en ? "Groom" : names.groom);
  const program = programItems(data);
  const embed = mapsEmbedUrl([data.address, data.address2].filter(Boolean).join(" "), data.mapUrl);
  const url = `${siteUrl ?? getSiteUrl()}/invite/${data.slug}`;
  const cal = dateParts(data.eventDate, en);
  const verse = data.quranEnabled ? pickQuran(data.quranSurah || "rum-21") : null;
  const extras =
    data.quranEnabled ||
    (data.showCountdown && data.eventDate) ||
    program.length > 0 ||
    (data.showGallery && data.gallery?.length) ||
    data.showRSVP ||
    data.showMessages ||
    data.customNotesEnabled ||
    data.giftsEnabled ||
    data.whatsapp ||
    data.phone;

  return (
    <div className="rings">
      <section className="rings-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="rings-hero-photo" src={data.coverImage || "/templates/rings/hero.jpg"} alt="" />
        <div className="rings-copy">
          <motion.p className="rings-kicker" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {en ? "Engagement Invitation" : "دعوة خطوبة"}
          </motion.p>
          <motion.p className="rings-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
            {data.welcomeText ||
              (en ? "we invite you to come to our engagement party" : "يسعدنا دعوتكم لحفل خطوبتنا")}
          </motion.p>
          <motion.h1
            className="invite-name rings-names"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            {groom}
            <small className="rings-amp">&</small>
            {bride}
          </motion.h1>
          {cal ? (
            <motion.div className="rings-cal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}>
              <p className="month">{cal.month}</p>
              <div className="rings-cal-row">
                <span>{cal.weekday}</span>
                <span className="day">{cal.day}</span>
                <span>{data.eventTime ? clock(data.eventTime, en) : ""}</span>
              </div>
              <p className="year">{cal.year}</p>
            </motion.div>
          ) : null}
          {data.venueName || data.address ? (
            <motion.p className="rings-place" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              📍 {[data.venueName, data.address].filter(Boolean).join(" , ")}
            </motion.p>
          ) : null}
        </div>
      </section>

      {extras ? (
        <div className="rings-body">
          {verse ? (
            <section className="rings-card">
              <p className="rings-verse">{verse.text}</p>
              <p className="mt-3 text-sm opacity-70">{verse.ref}</p>
            </section>
          ) : null}
          {data.showCountdown && data.eventDate ? (
            <section className="rings-card">
              <Countdown eventDate={data.eventDate} eventTime={data.eventTime} />
            </section>
          ) : null}
          {program.length ? (
            <section className="rings-card">
              <h2 className="invite-title mb-4 text-2xl">{en ? "Celebration details" : "تفاصيل الاحتفال"}</h2>
              <ol className="rings-program">
                {program.map((item) => (
                  <li key={`${item.time}-${item.label}`}>
                    <time>{item.time}</time>
                    <div>
                      <h4 className="m-0 text-lg">{item.label}</h4>
                      {item.description ? <p className="m-0 text-sm opacity-70">{item.description}</p> : null}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
          {data.showGallery && data.gallery?.length ? (
            <section className="rings-card">
              <h2 className="invite-title mb-4 text-2xl">{en ? "Our moments" : "لحظاتنا الجميلة"}</h2>
              <GalleryGrid images={data.gallery} />
            </section>
          ) : null}
          {data.mapUrl || data.address2 ? (
            <section className="rings-card">
              <h2 className="invite-title mb-2 text-2xl">{en ? "Location" : "كيفية الوصول"}</h2>
              <p>{data.venueName}</p>
              <p className="text-sm opacity-80">{data.address}</p>
              {embed ? (
                <div className="rings-map">
                  <iframe title="map" src={embed} loading="lazy" />
                </div>
              ) : null}
              {data.mapUrl ? (
                <a className="rings-link" href={data.mapUrl} target="_blank" rel="noreferrer">
                  Google Maps
                </a>
              ) : null}
            </section>
          ) : null}
          {data.showRSVP ? (
            <section className="rings-card">
              <h2 className="invite-title mb-2 text-2xl">{en ? "RSVP" : "تأكيد الحضور"}</h2>
              <RsvpForm invitationId={data.id} interactive={interactive} />
            </section>
          ) : null}
          {data.showMessages ? (
            <section className="rings-card">
              <h2 className="invite-title mb-2 text-2xl">{en ? "Guestbook" : "دفتر التهاني"}</h2>
              <Guestbook invitationId={data.id} messages={messages} interactive={interactive} />
            </section>
          ) : null}
          {data.customNotesEnabled || data.giftsEnabled || data.whatsapp || data.phone ? (
            <section className="rings-card">
              <StudioExtras data={data} hideQuran />
            </section>
          ) : null}
        </div>
      ) : null}
      {interactive ? (
        <div className="rings-body">
          <section className="rings-card">
            <ShareBar data={data} url={url} />
            <QrCard url={url} />
          </section>
        </div>
      ) : null}
    </div>
  );
}
