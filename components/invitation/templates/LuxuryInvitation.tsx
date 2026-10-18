"use client";

import { AmbientMotion } from "@/components/invitation/AmbientMotion";
import { InvitationBody } from "@/components/invitation/sections/InvitationBody";
import { coupleLine, occasionHeadline } from "@/lib/invite-copy";
import type { InvitationData, PublicMessage } from "@/types/invitation";
import { motion } from "framer-motion";

export function LuxuryInvitation({
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
    <div className="relative min-h-full overflow-hidden bg-[#0c0b0a] px-5 py-10 text-[#ead9b0]">
      <AmbientMotion variant="sparks" />
      <div className="relative mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-[2rem] border border-[#d4af37]/35 bg-[#141210] px-6 py-12"
        >
          <motion.div
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 3.2, repeat: Infinity }}
            className="mx-auto mb-6 h-2 w-24 rounded-full bg-[#d4af37]"
          />
          <p className="invite-title text-center text-xs tracking-[0.5em]">{occasionHeadline(data.eventType)}</p>
          <h1 className="invite-name mt-6 text-center font-display text-4xl leading-relaxed">{joined}</h1>
          <p className="mt-4 text-center font-display text-lg text-[#d4af37]">بسم الله الرحمن الرحيم</p>
          <p className="mt-4 text-center text-sm leading-8 text-[#cbbd96]">
            {data.welcomeText || "ليلة تُكتب بالذهب، وفرحة تُحفظ في القلب."}
          </p>
          {data.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.coverImage} alt="" className="mt-8 h-52 w-full rounded-3xl object-cover" />
          ) : null}
          <InvitationBody data={data} messages={messages} interactive={interactive} siteUrl={siteUrl} />
        </motion.div>
      </div>
    </div>
  );
}
