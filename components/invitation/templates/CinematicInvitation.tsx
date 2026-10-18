"use client";

import { submitMessage, submitRsvp } from "@/app/actions/public";
import { GalleryGrid } from "@/components/invitation/sections/GalleryGrid";
import { StudioExtras } from "@/components/invitation/sections/StudioExtras";
import { QrCard } from "@/components/invitation/sections/QrCard";
import { ShareBar } from "@/components/invitation/sections/ShareBar";
import { combineDateTime, formatEventDate, formatEventTime } from "@/lib/date";
import { occasionHeadline } from "@/lib/invite-copy";
import {
  CINEMATIC_THEMES,
  displayName,
  mapsEmbedUrl,
  programItems,
  type CinematicThemeId,
} from "@/lib/templates/cinematic";
import { getSiteUrl } from "@/lib/utils";
import type { InvitationData, PublicMessage } from "@/types/invitation";
import { useEffect, useMemo, useState } from "react";
import "./cinematic.css";

const arabicNumber = new Intl.NumberFormat("ar-EG", { minimumIntegerDigits: 2, useGrouping: false });

function compactDate(date: string) {
  if (!date) return "";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "numeric", year: "numeric" })
    .format(parsed)
    .replace(/\//g, " · ");
}

function CinematicCountdown({
  eventDate,
  eventTime,
  title,
  framed,
}: {
  eventDate: string;
  eventTime: string;
  title: string;
  framed?: boolean;
}) {
  const target = useMemo(() => combineDateTime(eventDate || "2099-01-01", eventTime || "00:00").getTime(), [eventDate, eventTime]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!eventDate) return null;
  const diff = Math.max(0, target - (now ?? target));
  const ended = diff <= 0;
  const items = [
    { label: "يوم", value: arabicNumber.format(Math.floor(diff / 86400000)) },
    { label: "ساعة", value: arabicNumber.format(Math.floor((diff % 86400000) / 3600000)) },
    { label: "دقيقة", value: arabicNumber.format(Math.floor((diff % 3600000) / 60000)) },
    { label: "ثانية", value: arabicNumber.format(Math.floor((diff % 60000) / 1000)) },
  ];

  return (
    <>
      <h3 className={framed ? "cinematic-countdown-title" : "cinematic-title"}>{ended ? "بدأ يوم المناسبة" : title}</h3>
      <div className={framed ? "cinematic-countdown" : "cinematic-countdown-plain"}>
        {items.map((item) => (
          <div key={item.label}>
            <span className="cinematic-count-number">{item.value}</span>
            <span className="cinematic-count-label">{item.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export function CinematicInvitation({
  themeId,
  data,
  messages = [],
  interactive = true,
  siteUrl,
}: {
  themeId: CinematicThemeId;
  data: InvitationData;
  messages?: PublicMessage[];
  interactive?: boolean;
  siteUrl?: string;
}) {
  const theme = CINEMATIC_THEMES[themeId];
  const opened = true;
  const bride = displayName(data.brideName, "اسم العروسة");
  const groom = displayName(data.groomName, "اسم العريس");
  const venue = displayName(data.venueName, "قاعة الاحتفال");
  const address = displayName(data.address, "العنوان");
  const eventLabel = occasionHeadline(data.eventType);
  const program = programItems(data);
  const embed = mapsEmbedUrl(data.address, data.mapUrl);
  const url = `${siteUrl ?? getSiteUrl()}/invite/${data.slug}`;
  const heroClass =
    themeId === "moonlight" ? "cinematic-hero-moon" : themeId === "gardenbloom" ? "cinematic-hero-garden" : themeId === "nightrose" ? "cinematic-hero-night" : "";

  useEffect(() => {
    if (!opened || !theme.videoSrc || !interactive) return;
    const video = document.getElementById(`hero-video-${theme.id}`) as HTMLVideoElement | null;
    video?.play().catch(() => undefined);
  }, [opened, interactive, theme.id, theme.videoSrc]);

  useEffect(() => {
    if (!theme.timelineSrc || !opened) return;
    const timeline = document.querySelector<HTMLElement>(`.cinematic[data-theme="${theme.id}"] .cinematic-timeline`);
    if (!timeline) return;
    const update = () => {
      const box = timeline.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.72 - box.top) / (window.innerHeight * 0.48 + box.height)));
      timeline.style.setProperty("--flower-progress", String(progress));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [opened, theme.id, theme.timelineSrc]);

  return (
    <div className="cinematic" data-theme={theme.id}>
        <main>
          <section className="cinematic-hero">
            {theme.videoSrc && interactive ? (
              <video
                id={`hero-video-${theme.id}`}
                className="cinematic-hero-video"
                muted
                playsInline
                loop
                preload="metadata"
                poster={theme.posterSrc}
                aria-hidden
              >
                <source src={theme.videoSrc} type="video/mp4" />
              </video>
            ) : theme.posterSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="cinematic-hero-video" src={theme.posterSrc} alt="" />
            ) : (
              <div className={`cinematic-hero-fallback ${heroClass}`} />
            )}
            {theme.overlaySrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="cinematic-hero-swans" src={theme.overlaySrc} alt="" />
            ) : null}
            {theme.leftFlowerSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="cinematic-hero-flower left" src={theme.leftFlowerSrc} alt="" />
            ) : null}
            {theme.rightFlowerSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="cinematic-hero-flower right" src={theme.rightFlowerSrc} alt="" />
            ) : null}
            <div className="cinematic-hero-copy">
              <div className="cinematic-hero-date">
                <h1>{theme.heroEyebrow(eventLabel)}</h1>
                {data.eventDate ? <p>{compactDate(data.eventDate)}</p> : null}
              </div>
              <h2 className="cinematic-hero-names invite-name">
                <span>{bride}</span>
                <span className="connector">و</span>
                <span>{groom}</span>
              </h2>
              <a className="cinematic-hero-scroll" href="#details">
                <span>تفاصيل دعوتنا</span>
                <span aria-hidden>⌄</span>
              </a>
            </div>
          </section>

          <div className="cinematic-details" id="details">
            <section className="cinematic-intro">
              <h2 className="cinematic-title">فرحتنا تكمل بوجودكم</h2>
              {theme.dividerSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="cinematic-divider" src={theme.dividerSrc} alt="" />
              ) : (
                <div className="cinematic-rule" />
              )}
              <p className="cinematic-text">
                {data.welcomeText || theme.greeting}
              </p>
              {data.eventDate ? <p className="cinematic-event-date">{formatEventDate(data.eventDate)}</p> : null}
              {data.eventTime ? <p className="cinematic-event-time">الساعة {formatEventTime(data.eventTime)}</p> : null}
              {data.showCountdown ? (
                theme.countdownPanelSrc ? (
                  <div className="cinematic-countdown-panel" style={{ backgroundImage: `url(${theme.countdownPanelSrc})` }}>
                    <CinematicCountdown
                      eventDate={data.eventDate}
                      eventTime={data.eventTime}
                      title={`باقي على يوم ${eventLabel}`}
                      framed
                    />
                  </div>
                ) : (
                  <CinematicCountdown eventDate={data.eventDate} eventTime={data.eventTime} title={`باقي على يوم ${eventLabel}`} />
                )
              ) : null}
            </section>

            {program.length ? (
            <section className="cinematic-program">
              <h2 className="cinematic-title invite-title">فقرات يوم {eventLabel}</h2>
              {theme.timelineSrc ? (
                <div className="cinematic-timeline" style={{ backgroundImage: `url(${theme.timelineSrc})` }}>
                  <ol className="cinematic-timeline-list">
                    {program.map((item) => (
                      <li key={item.label}>
                        <time>{item.time}</time>
                        <span>{item.label}</span>
                        {item.description ? <small>{item.description}</small> : null}
                      </li>
                    ))}
                  </ol>
                  {theme.flowerDotSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="cinematic-timeline-flower" src={theme.flowerDotSrc} alt="" />
                  ) : null}
                </div>
              ) : (
                <ol className="cinematic-timeline-plain">
                  {program.map((item) => (
                    <li key={item.label}>
                      <time>{item.time}</time>
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ol>
              )}
              <p className="cinematic-note">ننتظركم لنشارك هذه الليلة الجميلة معًا</p>
            </section>
            ) : null}

            <section className="cinematic-venue">
              <h2 className="cinematic-title">مكان {eventLabel}</h2>
              {theme.dividerSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="cinematic-divider" src={theme.dividerSrc} alt="" />
              ) : (
                <div className="cinematic-rule" />
              )}
              <h3 className="cinematic-venue-title">{venue}</h3>
              <p className="cinematic-subtle">{address}</p>
              {data.address2 ? <p className="cinematic-subtle">{data.address2}</p> : null}
              <address className="cinematic-address">{address}</address>
              {embed ? (
                <div className="cinematic-map">
                  <iframe title="خريطة المكان" src={embed} loading="lazy" />
                </div>
              ) : null}
              {data.mapUrl ? (
                <a className="cinematic-button" href={data.mapUrl} target="_blank" rel="noreferrer">
                  الاتجاهات على خرائط جوجل
                </a>
              ) : null}
            </section>

            {data.showGallery && data.gallery?.length ? (
              <section className="cinematic-paper">
                <h2 className="cinematic-title">الصور</h2>
                <GalleryGrid images={data.gallery} />
              </section>
            ) : null}

            {data.showRSVP ? (
              <section className={`cinematic-paper ${theme.rsvpPanelSrc ? "has-art" : ""}`} style={theme.rsvpPanelSrc ? { backgroundImage: `url(${theme.rsvpPanelSrc})` } : undefined}>
                <h2 className="cinematic-title">تأكيد الحضور</h2>
                <p className="cinematic-text">فرحتنا تكمل بوجودكم.</p>
                <CinematicRsvp invitationId={data.id} interactive={interactive} />
              </section>
            ) : null}

            {data.showMessages ? (
              <section className={`cinematic-paper ${theme.rsvpPanelSrc ? "has-art" : ""}`} style={theme.rsvpPanelSrc ? { backgroundImage: `url(${theme.rsvpPanelSrc})` } : undefined}>
                <h2 className="cinematic-title">كلماتكم تسعدنا</h2>
                <p className="cinematic-text">اكتبوا لنا كلمة حلوة نحتفظ بيها للذكرى.</p>
                <CinematicWishes invitationId={data.id} messages={messages} interactive={interactive} couple={`${bride} و${groom}`} />
              </section>
            ) : null}
            <div className="px-6 pb-8">
              <StudioExtras data={data} />
            </div>
          </div>

          <footer
            className={`cinematic-footer ${theme.footerSrc ? "has-art" : ""}`}
            style={theme.footerSrc ? { ["--footer-image" as string]: `url(${theme.footerSrc})` } : undefined}
          >
            <p>ننتظركم بكل الحب</p>
            <p className="cinematic-sign invite-name">
              {bride} و {groom}
            </p>
            {interactive ? <ShareBar data={data} url={url} /> : null}
            {interactive ? <div className="mt-6"><QrCard url={url} /></div> : null}
          </footer>
        </main>
    </div>
  );
}

function CinematicRsvp({ invitationId, interactive }: { invitationId: string; interactive: boolean }) {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | "">("");
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!interactive) {
      setStatus("بعد النشر يقدر الضيوف يؤكدوا الحضور.");
      return;
    }
    setPending(true);
    const result = await submitRsvp({
      invitationId,
      guestName: name,
      attending: attending === "yes",
    });
    setStatus(result.error ?? "تم استلام ردكم، شكرًا لكم. ننتظركم بكل الحب!");
    setPending(false);
  }

  return (
    <form className="cinematic-form" onSubmit={onSubmit}>
      <label className="mb-2 block text-right text-[17px]">الاسم</label>
      <input className="cinematic-field" value={name} onChange={(event) => setName(event.target.value)} required />
      <p className="mb-2 text-right">هتشاركونا الفرحة؟</p>
      <label className="cinematic-choice">
        <input type="radio" name="attending" checked={attending === "yes"} onChange={() => setAttending("yes")} />
        أكيد هنكون معاكم
      </label>
      <label className="cinematic-choice">
        <input type="radio" name="attending" checked={attending === "no"} onChange={() => setAttending("no")} />
        للأسف مش هنقدر
      </label>
      <button className="cinematic-button cinematic-submit" type="submit" disabled={pending}>
        {pending ? "جارٍ إرسال الرد…" : "إرسال الرد"}
      </button>
      {status ? <p className="mt-4">{status}</p> : null}
    </form>
  );
}

function CinematicWishes({
  invitationId,
  messages,
  interactive,
  couple,
}: {
  invitationId: string;
  messages: PublicMessage[];
  interactive: boolean;
  couple: string;
}) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!interactive) {
      setStatus("بعد النشر تظهر التهاني للضيوف.");
      return;
    }
    setPending(true);
    const result = await submitMessage({ invitationId, guestName: name, message });
    if (result.error) setStatus(result.error);
    else {
      setName("");
      setMessage("");
      setStatus("وصلت رسالتكم وظهرت للجميع.");
    }
    setPending(false);
  }

  return (
    <>
      <form className="cinematic-form" onSubmit={onSubmit}>
        <label className="mb-2 block text-right text-[17px]">اسمك</label>
        <input className="cinematic-field" value={name} onChange={(event) => setName(event.target.value)} required />
        <label className="mb-2 block text-right text-[17px]">رسالتك ل{couple}</label>
        <textarea className="cinematic-field" rows={3} value={message} onChange={(event) => setMessage(event.target.value)} required />
        <button className="cinematic-button cinematic-submit" type="submit" disabled={pending}>
          {pending ? "جارٍ إرسال التهنئة…" : "إرسال التهنئة"}
        </button>
        {status ? <p className="mt-4">{status}</p> : null}
      </form>
      <ul className="cinematic-wishes">
        {messages.length === 0 ? (
          <li className="cinematic-note">لسه مستنيين أول كلمة حلوة منكم</li>
        ) : (
          messages.map((item) => (
            <li key={item.id} className="cinematic-wish">
              <strong>{item.guestName}</strong>
              <p>{item.message}</p>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
