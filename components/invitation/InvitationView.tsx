"use client";

import { OpeningCover } from "@/components/invitation/OpeningCover";
import { ThemeFrame } from "@/components/invitation/ThemeFrame";
import { MusicToggle } from "@/components/invitation/sections/MusicToggle";
import { CinematicInvitation } from "@/components/invitation/templates/CinematicInvitation";
import { ClassicInvitation } from "@/components/invitation/templates/ClassicInvitation";
import { CoupleInvitation } from "@/components/invitation/templates/CoupleInvitation";
import { CygnesInvitation } from "@/components/invitation/templates/CygnesInvitation";
import { FloralInvitation } from "@/components/invitation/templates/FloralInvitation";
import { LuxuryInvitation } from "@/components/invitation/templates/LuxuryInvitation";
import { MinimalInvitation } from "@/components/invitation/templates/MinimalInvitation";
import { RingsInvitation } from "@/components/invitation/templates/RingsInvitation";
import { SageInvitation } from "@/components/invitation/templates/SageInvitation";
import { RomanticInvitation } from "@/components/invitation/templates/RomanticInvitation";
import { resolveMusicUrl } from "@/lib/invite-copy";
import type { InvitationData, PublicMessage, TemplateComponentKey } from "@/types/invitation";

function SwansInvitation(props: Omit<Parameters<typeof CinematicInvitation>[0], "themeId">) {
  return <CinematicInvitation {...props} themeId="swans" />;
}
function MoonlightInvitation(props: Omit<Parameters<typeof CinematicInvitation>[0], "themeId">) {
  return <CinematicInvitation {...props} themeId="moonlight" />;
}
function GardenBloomInvitation(props: Omit<Parameters<typeof CinematicInvitation>[0], "themeId">) {
  return <CinematicInvitation {...props} themeId="gardenbloom" />;
}
function NightRoseInvitation(props: Omit<Parameters<typeof CinematicInvitation>[0], "themeId">) {
  return <CinematicInvitation {...props} themeId="nightrose" />;
}

const TEMPLATES = {
  classic: ClassicInvitation,
  luxury: LuxuryInvitation,
  romantic: RomanticInvitation,
  floral: FloralInvitation,
  minimal: MinimalInvitation,
  swans: SwansInvitation,
  moonlight: MoonlightInvitation,
  gardenbloom: GardenBloomInvitation,
  nightrose: NightRoseInvitation,
  cygnes: CygnesInvitation,
  couple: CoupleInvitation,
  rings: RingsInvitation,
  sage: SageInvitation,
} satisfies Record<TemplateComponentKey, typeof ClassicInvitation>;

export function InvitationView({
  data,
  messages,
  interactive = true,
  siteUrl,
}: {
  data: InvitationData;
  messages?: PublicMessage[];
  interactive?: boolean;
  siteUrl?: string;
}) {
  const Template = TEMPLATES[data.componentKey] ?? ClassicInvitation;
  const music = resolveMusicUrl(data);
  return (
    <ThemeFrame data={data}>
      <OpeningCover data={data} interactive={interactive}>
        <Template data={data} messages={messages} interactive={interactive} siteUrl={siteUrl} />
      </OpeningCover>
      {data.showMusic && music ? (
        <div className="pointer-events-auto fixed bottom-4 left-1/2 z-30 -translate-x-1/2">
          <MusicToggle src={music} />
        </div>
      ) : null}
    </ThemeFrame>
  );
}

export function MiniInvitationPreview({ data }: { data: InvitationData }) {
  return (
    <div className="pointer-events-none origin-top scale-[0.72]">
      <InvitationView data={data} interactive={false} />
    </div>
  );
}
