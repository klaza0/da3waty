"use client";

import { Button } from "@/components/ui/button";
import { type CookieConsent, readCookieConsent, writeCookieConsent } from "@/lib/cookie-consent";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!readCookieConsent());
  }, []);

  function choose(value: CookieConsent) {
    writeCookieConsent(value);
    document.documentElement.dataset.analyticsConsent = value;
    window.dispatchEvent(new CustomEvent("da3waty-cookie-consent", { detail: value }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-body"
      className="fixed inset-x-0 bottom-0 z-[80] p-4"
    >
      <div className="mx-auto max-w-2xl rounded-[1.6rem] border border-line bg-white p-5 shadow-soft">
        <p id="cookie-consent-title" className="font-display text-2xl">
          احترام خصوصيتك
        </p>
        <p id="cookie-consent-body" className="mt-3 text-sm leading-7 text-muted">
          نحن نستخدم ملفات تعريف الارتباط لتحليل حركة المرور وتحسين تجربتك على Da3waty. يمكنك قبول أو رفض ملفات تعريف
          الارتباط الإحصائية هذه. لمزيد من المعلومات، اقرأ{" "}
          <Link href="/privacy" className="text-rose underline decoration-gold/60 underline-offset-4">
            سياسة الخصوصية
          </Link>{" "}
          الخاصة بنا.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button type="button" onClick={() => choose("accepted")}>
            قبول
          </Button>
          <Button type="button" variant="secondary" onClick={() => choose("rejected")}>
            رفض
          </Button>
        </div>
      </div>
    </div>
  );
}
