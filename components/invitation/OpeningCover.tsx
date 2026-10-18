"use client";

import { AmbientMotion } from "@/components/invitation/AmbientMotion";
import { coupleInitials, coupleLine, occasionHeadline } from "@/lib/invite-copy";
import type { InvitationData } from "@/types/invitation";
import { useRef, useState } from "react";
import "@/components/invitation/templates/classic.css";
import "@/components/invitation/templates/couple.css";
import "@/components/invitation/templates/cygnes.css";
import "@/components/invitation/templates/rings.css";

export function OpeningCover({
  data,
  interactive,
  children,
}: {
  data: InvitationData;
  interactive: boolean;
  children: React.ReactNode;
}) {
  const [opened, setOpened] = useState(
    !interactive || data.componentKey === "rings" || data.componentKey === "sage",
  );
  const [opening, setOpening] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { bride, groom, joined } = coupleLine(data);
  const headline = occasionHeadline(data.eventType);
  const initials = coupleInitials(data);
  const classicWax = data.componentKey === "classic";
  const cygnesCover = data.componentKey === "cygnes";
  const coupleCover = data.componentKey === "couple";

  function finish() {
    setOpened(true);
  }

  function open() {
    if (opening || opened) return;
    setOpening(true);
    if (classicWax && videoRef.current) {
      const video = videoRef.current;
      video.play().catch(() => finish());
      video.onended = finish;
      window.setTimeout(finish, 2600);
      return;
    }
    window.setTimeout(finish, 900);
  }

  if (opened) return <>{children}</>;

  if (coupleCover) {
    return (
      <div className={`couple-cover ${opening ? "opening" : ""}`}>
        <AmbientMotion variant="hearts" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="couple-wreath" src="/templates/couple/wreath.jpg" alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="couple-art" src="/templates/couple/illustration.jpg" alt="رسم كرتون للعروسين" />
        <div className="couple-cover-copy">
          <p className="couple-cover-kicker">{headline}</p>
          <h1 className="couple-cover-names invite-name">
            {bride}
            <small>&</small>
            {groom}
          </h1>
          <button className="couple-open" type="button" onClick={open}>
            اضغطوا لفتح الدعوة
          </button>
        </div>
      </div>
    );
  }

  if (cygnesCover) {
    return (
      <div className={`cygnes-cover ${opening ? "opening" : ""}`}>
        <div className="cygnes-pane left" />
        <div className="cygnes-pane right" />
        <div className="cygnes-split" />
        <div className="cygnes-cover-copy">
          <h1 className="cygnes-cover-title invite-title">{headline}</h1>
          <p className="cygnes-hint">اضغطوا على الختم</p>
          <button className="cygnes-seal" type="button" aria-label="افتحوا" onClick={open}>
            <span>
              <strong>{initials}</strong>
              <span>{groom}</span>
              <span>&</span>
              <span>{bride}</span>
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (classicWax) {
    return (
      <div className={`classic-cover ${opening ? "opening" : ""}`}>
        <div className="classic-cover-inner">
          <video
            ref={videoRef}
            className="entrance"
            muted
            playsInline
            preload="auto"
            poster="/templates/classic/poster-clear-v2.webp"
            src="/templates/classic/entrance.mp4"
            aria-hidden
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="classic-cover-still" src="/templates/classic/poster-clear-v2.webp" alt="" />
          <header className="classic-cover-heading">
            <p className="invite-title">{headline}</p>
            <p className="classic-cover-poem">خُتِمَت بالشمعِ… وتُفتَحُ بالفرَح</p>
          </header>
          <button className="classic-seal-target" type="button" aria-label="افتح الدعوة من ختم الشمع" onClick={open} />
          <div className="classic-cover-bottom">
            <h1 className="invite-name">{joined}</h1>
            <button className="classic-open-pill" type="button" onClick={open}>
              اضغط على الختم
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button type="button" className="relative grid min-h-dvh w-full place-items-center overflow-hidden bg-[#efe0df]" onClick={open}>
      {data.componentKey === "swans" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/templates/swans/envelope-pink.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-8 rounded-[2rem] border border-[#d4af37]/50 bg-[linear-gradient(160deg,#fbf2e3,#7b2c3d)]" />
      )}
      <div className="relative z-10 text-center">
        <p className="invite-title mb-[38vh] font-display text-xl">{headline}</p>
        <span className="invite-name mx-auto grid h-28 w-28 place-items-center rounded-full bg-[#7b2c3d] font-display text-lg leading-7 text-[#f3d8c4] shadow-[0_0_0_8px_#a4864255]">
          {bride}
          <small>و</small>
          {groom}
        </span>
        <p className="mt-8 text-sm">اضغطوا على الختم لفتح الدعوة</p>
      </div>
    </button>
  );
}
