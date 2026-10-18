"use client";

import { Countdown } from "@/components/invitation/sections/Countdown";
import { GalleryGrid } from "@/components/invitation/sections/GalleryGrid";
import { Guestbook } from "@/components/invitation/sections/Guestbook";
import { QrCard } from "@/components/invitation/sections/QrCard";
import { RsvpForm } from "@/components/invitation/sections/RsvpForm";
import { ShareBar } from "@/components/invitation/sections/ShareBar";
import { StudioExtras } from "@/components/invitation/sections/StudioExtras";
import { pickQuran } from "@/lib/design-studio";
import { mapsEmbedUrl, programItems } from "@/lib/templates/cinematic";
import { getSiteUrl } from "@/lib/utils";
import type { InvitationData, PublicMessage } from "@/types/invitation";
import { motion } from "framer-motion";
import "./sage.css";

function slashDate(date: string) {
  if (!date) return null;
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return `${parsed.getDate()} | ${parsed.getMonth() + 1} | ${parsed.getFullYear()}`;
}

function clock(time: string, en: boolean) {
  const parsed = new Date(`1970-01-01T${time.length === 5 ? `${time}:00` : time}`);
  if (Number.isNaN(parsed.getTime())) return time;
  return new Intl.DateTimeFormat(en ? "en-US" : "ar-EG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

export function SageInvitation({
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
  const bride = data.brideName.trim() || (en ? "Bride" : "العروسة");
  const groom = data.groomName.trim() || (en ? "Groom" : "العريس");
  const program = programItems(data);
  const embed = mapsEmbedUrl([data.address, data.address2].filter(Boolean).join(" "), data.mapUrl);
  const url = `${siteUrl ?? getSiteUrl()}/invite/${data.slug}`;
  const dateLine = slashDate(data.eventDate);
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
    data.phone ||
    data.mapUrl;

  return (
    <div className="sage">
      <section className="sage-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="sage-seal" src="/templates/sage/seal.jpg" alt="" />
        <motion.p className="sage-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {en ? (
            <>
              YOU ARE INVITED TO
              <br />
              THE ENGAGEMENT OF
            </>
          ) : (
            "مدعوون لحفل خطوبة"
          )}
        </motion.p>
        <div className="sage-names">
          <motion.h1
            className="invite-name"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            {groom}
          </motion.h1>
          <span className="sage-heart" aria-hidden />
          <motion.h1
            className="invite-name"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            {bride}
          </motion.h1>
        </div>
        {dateLine ? <p className="sage-date">{dateLine}</p> : null}
        {data.eventTime ? (
          <p className="sage-time">
            {en ? "at " : "الساعة "}
            {clock(data.eventTime, en)}
          </p>
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="sage-art" src={data.coverImage || "/templates/sage/couple.jpg"} alt="" />
      </section>

      {extras ? (
        <div className="sage-body">
          {verse ? (
            <section className="sage-extra">
              <p>{verse.text}</p>
              <p className="mt-2 text-sm opacity-70">{verse.ref}</p>
            </section>
          ) : null}
          {data.showCountdown && data.eventDate ? (
            <section className="sage-extra">
              <Countdown eventDate={data.eventDate} eventTime={data.eventTime} />
            </section>
          ) : null}
          {program.length ? (
            <section className="sage-extra">
              <h2 className="invite-title mb-3 text-2xl">{en ? "Details" : "تفاصيل الاحتفال"}</h2>
              {program.map((item) => (
                <p key={`${item.time}-${item.label}`}>
                  {item.time} — {item.label}
                </p>
              ))}
            </section>
          ) : null}
          {data.showGallery && data.gallery?.length ? (
            <section className="sage-extra">
              <GalleryGrid images={data.gallery} />
            </section>
          ) : null}
          {data.mapUrl ? (
            <section className="sage-extra">
              <p>{data.venueName}</p>
              <p className="text-sm">{data.address}</p>
              {embed ? <iframe title="map" src={embed} className="mt-3 h-44 w-full border-0" /> : null}
            </section>
          ) : null}
          {data.showRSVP ? (
            <section className="sage-extra">
              <RsvpForm invitationId={data.id} interactive={interactive} />
            </section>
          ) : null}
          {data.showMessages ? (
            <section className="sage-extra">
              <Guestbook invitationId={data.id} messages={messages} interactive={interactive} />
            </section>
          ) : null}
          {data.customNotesEnabled || data.giftsEnabled || data.whatsapp || data.phone ? (
            <section className="sage-extra">
              <StudioExtras data={data} hideQuran />
            </section>
          ) : null}
        </div>
      ) : null}

      {interactive ? (
        <div className="sage-body">
          <section className="sage-extra">
            <ShareBar data={data} url={url} />
            <QrCard url={url} />
          </section>
        </div>
      ) : null}
    </div>
  );
}
