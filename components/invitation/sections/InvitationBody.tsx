import { Countdown } from "@/components/invitation/sections/Countdown";
import { EventDetails } from "@/components/invitation/sections/EventDetails";
import { GalleryGrid } from "@/components/invitation/sections/GalleryGrid";
import { Guestbook } from "@/components/invitation/sections/Guestbook";
import { LocationCard } from "@/components/invitation/sections/LocationCard";
import { QrCard } from "@/components/invitation/sections/QrCard";
import { RsvpForm } from "@/components/invitation/sections/RsvpForm";
import { ShareBar } from "@/components/invitation/sections/ShareBar";
import { StudioExtras } from "@/components/invitation/sections/StudioExtras";
import { getSiteUrl } from "@/lib/utils";
import type { InvitationData, PublicMessage } from "@/types/invitation";

export function InvitationBody({
  data,
  messages = [],
  interactive,
  siteUrl,
}: {
  data: InvitationData;
  messages?: PublicMessage[];
  interactive: boolean;
  siteUrl?: string;
}) {
  const url = `${siteUrl ?? getSiteUrl()}/invite/${data.slug}`;

  return (
    <div className="space-y-10">
      {data.showCountdown ? <Countdown eventDate={data.eventDate} eventTime={data.eventTime} /> : null}
      <EventDetails
        eventDate={data.eventDate}
        eventTime={data.eventTime}
        venueName={data.venueName}
        address={data.address}
        address2={data.address2}
      />
      {data.program?.some((item) => item.title.trim()) ? (
        <ol className="space-y-3 text-sm">
          {data.program
            .filter((item) => item.title.trim())
            .map((item) => (
              <li key={`${item.time}-${item.title}`} className="rounded-2xl border border-current/15 px-4 py-3">
                <p className="invite-title font-medium">{item.time} — {item.title}</p>
                {item.description ? <p className="mt-1 opacity-80">{item.description}</p> : null}
              </li>
            ))}
        </ol>
      ) : null}
      <LocationCard venueName={data.venueName} address={data.address} address2={data.address2} mapUrl={data.mapUrl} />
      {data.showGallery && data.gallery?.length ? <GalleryGrid images={data.gallery} /> : null}
      {data.showRSVP ? <RsvpForm invitationId={data.id} interactive={interactive} /> : null}
      {data.showMessages ? (
        <Guestbook invitationId={data.id} messages={messages} interactive={interactive} />
      ) : null}
      <StudioExtras data={data} />
      {interactive ? (
        <>
          <ShareBar data={data} url={url} />
          <QrCard url={url} />
        </>
      ) : null}
    </div>
  );
}
