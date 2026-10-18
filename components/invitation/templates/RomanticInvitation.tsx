"use client";

import { AmbientMotion } from "@/components/invitation/AmbientMotion";
import { InvitationBody } from "@/components/invitation/sections/InvitationBody";
import { coupleLine, occasionHeadline } from "@/lib/invite-copy";
import type { InvitationData, PublicMessage } from "@/types/invitation";
import { motion } from "framer-motion";

export function RomanticInvitation({
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
  const { joined } = coupleLine(data);
  return (
    <div className="relative min-h-full overflow-hidden bg-[#f7e9ee] px-5 py-10 text-[#5c3340]">
      <AmbientMotion variant="hearts" />
      <div className="relative mx-auto max-w-md overflow-hidden rounded-[2.2rem] bg-[#fff6f8] px-6 py-12 shadow-soft">
        <motion.div
          animate={{ y: [0, -10, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mb-6 h-16 w-16 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f2b6c1,#c45c6a)]"
        />
        <p className="invite-title text-center text-sm tracking-[0.3em]">{occasionHeadline(data.eventType)}</p>
        <h1 className="invite-name mt-4 text-center font-display text-4xl leading-relaxed">{joined}</h1>
        <p className="mt-3 text-center text-sm leading-8">{data.welcomeText || "قصة حب تبدأ من هنا، وأنتم جزء منها."}</p>
        {data.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.coverImage} alt="" className="mt-8 h-52 w-full rounded-3xl object-cover" />
        ) : null}
        <div className="mt-8">
          <InvitationBody data={data} messages={messages} interactive={interactive} siteUrl={siteUrl} />
        </div>
      </div>
    </div>
  );
}
