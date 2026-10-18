"use client";

import { invitationShareText, whatsappShareUrl } from "@/lib/share";
import type { InvitationData } from "@/types/invitation";
import { Check, Copy, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export function ShareBar({ data, url }: { data: InvitationData; url: string }) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const text = invitationShareText(data, url);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title: `${data.groomName} و ${data.brideName}`, text, url });
    }
  }

  return (
    <div className="space-y-3 text-center">
      <p className="text-sm tracking-[0.2em] opacity-70">شارك الدعوة</p>
      <div className="flex flex-wrap justify-center gap-2">
        <a
          href={whatsappShareUrl(text)}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-[#128C7E] px-4 py-2 text-sm text-white"
        >
          واتساب
        </a>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-full border border-current/25 px-4 py-2 text-sm"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "تم النسخ" : "نسخ الرابط"}
        </button>
        {canNativeShare ? (
          <button
            type="button"
            onClick={nativeShare}
            className="inline-flex items-center gap-1 rounded-full border border-current/25 px-4 py-2 text-sm"
          >
            <Share2 className="h-4 w-4" />
            مشاركة
          </button>
        ) : null}
      </div>
    </div>
  );
}
