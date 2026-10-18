"use client";

import { AmbientMotion } from "@/components/invitation/AmbientMotion";
import { InvitationBody } from "@/components/invitation/sections/InvitationBody";
import { coupleLine, occasionHeadline } from "@/lib/invite-copy";
import type { InvitationData, PublicMessage } from "@/types/invitation";
import { motion } from "framer-motion";

export function FloralInvitation({
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
    <div className="relative min-h-full overflow-hidden bg-[#f3efe6] px-5 py-10 text-[#3f4a3c]">
      <AmbientMotion variant="leaves" />
      <motion.div
        animate={{ rotate: [0, 6, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-[#d7e3c8]"
      />
      <motion.div
        animate={{ rotate: [0, -8, 0] }}
        transition={{ duration: 9, repeat: Infinity }}
        className="pointer-events-none absolute -right-8 bottom-20 h-48 w-48 rounded-full bg-[#ead7d1]"
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto max-w-md rounded-[2.2rem] border border-[#c9d6bc] bg-white/80 px-6 py-12 backdrop-blur"
      >
        <p className="invite-title text-center text-sm">{occasionHeadline(data.eventType)}</p>
        <h1 className="invite-name mt-4 text-center font-display text-4xl leading-relaxed">{joined}</h1>
        <p className="mt-3 text-center text-sm leading-8">{data.welcomeText || "وردٌ وفرح، ومكانٌ يجمع الأحباب."}</p>
        {data.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.coverImage} alt="" className="mt-8 h-52 w-full rounded-3xl object-cover" />
        ) : null}
        <div className="mt-8">
          <InvitationBody data={data} messages={messages} interactive={interactive} siteUrl={siteUrl} />
        </div>
      </motion.div>
    </div>
  );
}
