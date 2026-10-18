"use client";

import { AmbientMotion } from "@/components/invitation/AmbientMotion";
import { Countdown } from "@/components/invitation/sections/Countdown";
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
import { motion } from "framer-motion";
import "./couple.css";

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

const fade = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

export function CoupleInvitation({
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

  return (
    <div className="couple">
      <AmbientMotion variant="hearts" />
      <section className="couple-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="couple-wreath" src="/templates/couple/wreath.jpg" alt="" />
        <motion.img
          className="couple-art"
          src="/templates/couple/illustration.jpg"
          alt="رسم كرتون للعروسين"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="couple-hero-copy">
          <motion.p className="invite-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {data.language === "en" ? "Our wedding" : "فرحنا"}
          </motion.p>
          <motion.h1
            className="invite-name"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {bride}
            <small className="couple-amp">&</small>
            {groom}
          </motion.h1>
        </div>
      </section>

      <motion.div className="couple-body" variants={list} initial="hidden" animate="show">
        {data.coverImage ? (
          <motion.section className="couple-photo" variants={fade}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.coverImage} alt="" />
          </motion.section>
        ) : null}

        {verse ? (
          <motion.section className="couple-card" variants={fade}>
            <p className="couple-verse">{verse.text}</p>
            <p className="mt-3 text-sm opacity-70">{verse.ref}</p>
          </motion.section>
        ) : null}

        <motion.section className="couple-card" variants={fade}>
          <p className="couple-welcome">
            {data.welcomeText || "نتشرف بدعوتكم لمشاركتنا فرحة زفافنا والاحتفال معنا بهذه المناسبة المباركة."}
          </p>
        </motion.section>

        {cal ? (
          <motion.section className="couple-card couple-cal" variants={fade}>
            <p className="month invite-title">{cal.month}</p>
            <p className="day">{cal.day}</p>
            <p>{cal.weekday}</p>
            <p>{cal.year}</p>
            {data.eventTime ? <p className="mt-2">{formatEventTime(data.eventTime)}</p> : null}
          </motion.section>
        ) : null}

        {data.showCountdown && data.eventDate ? (
          <motion.section className="couple-card" variants={fade}>
            <Countdown eventDate={data.eventDate} eventTime={data.eventTime} />
          </motion.section>
        ) : null}

        {program.length ? (
          <motion.section className="couple-card" variants={fade}>
            <h2 className="invite-title mb-4 text-2xl">تفاصيل الاحتفال</h2>
            <ol className="couple-program">
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
          </motion.section>
        ) : null}

        {data.showGallery && data.gallery?.length ? (
          <motion.section className="couple-card" variants={fade}>
            <h2 className="invite-title mb-4 text-2xl">لحظاتنا الجميلة</h2>
            <GalleryGrid images={data.gallery} />
          </motion.section>
        ) : null}

        <motion.section className="couple-card" variants={fade}>
          <h2 className="invite-title mb-2 text-2xl">كيفية الوصول</h2>
          <p className="text-sm opacity-70">مكان الاستقبال</p>
          <p>{data.venueName || "قاعة الاحتفال"}</p>
          <p className="text-sm opacity-80">{data.address}</p>
          {data.address2 ? <p className="text-sm opacity-80">{data.address2}</p> : null}
          {embed ? (
            <div className="couple-map">
              <iframe title="خريطة المكان" src={embed} loading="lazy" />
            </div>
          ) : null}
          {data.mapUrl ? (
            <a className="couple-link" href={data.mapUrl} target="_blank" rel="noreferrer">
              فتح خرائط Google
            </a>
          ) : null}
        </motion.section>

        {data.showRSVP ? (
          <motion.section className="couple-card" variants={fade}>
            <h2 className="invite-title mb-2 text-2xl">تأكيد الحضور</h2>
            <RsvpForm invitationId={data.id} interactive={interactive} />
          </motion.section>
        ) : null}

        {data.showMessages ? (
          <motion.section className="couple-card" variants={fade}>
            <h2 className="invite-title mb-2 text-2xl">دفتر التهاني</h2>
            <p className="mb-4 text-sm opacity-80">اتركوا تهانيكم للعروسين</p>
            <Guestbook invitationId={data.id} messages={messages} interactive={interactive} />
          </motion.section>
        ) : null}

        {data.customNotesEnabled || data.giftsEnabled || data.whatsapp || data.phone || data.showAttendeeCount ? (
          <motion.section className="couple-card" variants={fade}>
            <StudioExtras data={data} hideQuran />
          </motion.section>
        ) : null}

        {interactive ? (
          <motion.section className="couple-card" variants={fade}>
            <ShareBar data={data} url={url} />
            <QrCard url={url} />
          </motion.section>
        ) : null}
      </motion.div>
    </div>
  );
}
