"use client";

import { AmbientMotion } from "@/components/invitation/AmbientMotion";
import { InvitationBody } from "@/components/invitation/sections/InvitationBody";
import { coupleLine, occasionHeadline } from "@/lib/invite-copy";
import type { InvitationData, PublicMessage } from "@/types/invitation";
import { motion } from "framer-motion";

export function MinimalInvitation({
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
  return (
    <div className="relative min-h-full overflow-hidden bg-white px-6 py-16 text-[#2c2416]">
      <AmbientMotion variant="dust" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto max-w-md">
        <p className="invite-title text-center text-xs tracking-[0.45em]">{occasionHeadline(data.eventType)}</p>
        <h1 className="invite-name mt-10 text-center font-display text-5xl leading-snug">
          {bride}
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mt-2 block text-lg tracking-[0.4em] text-gold"
          >
            &
          </motion.span>
          {groom}
        </h1>
        <div className="mx-auto mt-10 h-px w-16 bg-line" />
        <p className="mt-8 text-center text-sm leading-8 text-muted">{data.welcomeText || "دعوة بسيطة... ليوم لا يُنسى."}</p>
        {data.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.coverImage} alt="" className="mt-8 h-52 w-full rounded-3xl object-cover" />
        ) : null}
        <div className="mt-12">
          <InvitationBody data={data} messages={messages} interactive={interactive} siteUrl={siteUrl} />
        </div>
      </motion.div>
    </div>
  );
}
