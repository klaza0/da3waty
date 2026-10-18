"use client";

import { submitSubscriptionPayment } from "@/app/actions/payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SUBSCRIPTION_PRICE_LABEL, VODAFONE_CASH_LABEL, VODAFONE_CASH_NUMBER } from "@/lib/billing";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function SubscribeForm() {
  const router = useRouter();
  const [senderPhone, setSenderPhone] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();

  async function copyWallet() {
    try {
      await navigator.clipboard.writeText(VODAFONE_CASH_NUMBER);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    start(async () => {
      const result = await submitSubscriptionPayment({ senderPhone, transactionRef });
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="rounded-[1.4rem] border border-gold/40 bg-ivory px-4 py-4">
        <Label htmlFor="wallet">رقم التحويل</Label>
        <div className="flex items-center justify-between gap-3">
          <input
            id="wallet"
            readOnly
            value={`${VODAFONE_CASH_NUMBER} · ${VODAFONE_CASH_LABEL}`}
            className="h-11 w-full rounded-2xl border border-line bg-white px-4 font-medium tracking-wide text-ink outline-none"
            dir="ltr"
          />
          <button type="button" onClick={copyWallet} className="shrink-0 text-sm text-rose">
            {copied ? "تم النسخ" : "نسخ"}
          </button>
        </div>
        <p className="mt-2 text-xs leading-6 text-muted">
          حوّل {SUBSCRIPTION_PRICE_LABEL} مرة واحدة على هذا الرقم، ثم اكتب بيانات رسالة التحويل بالأسفل.
        </p>
      </div>

      <div>
        <Label htmlFor="sender">الرقم الذي تم التحويل منه</Label>
        <Input
          id="sender"
          name="senderPhone"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          placeholder="01xxxxxxxxx"
          value={senderPhone}
          onChange={(event) => setSenderPhone(event.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="transaction">رقم المعاملة</Label>
        <Input
          id="transaction"
          name="transactionRef"
          inputMode="text"
          dir="ltr"
          placeholder="رقم العملية من رسالة فودافون كاش"
          value={transactionRef}
          onChange={(event) => setTransactionRef(event.target.value)}
          required
        />
      </div>

      {error ? <p className="text-sm text-rose">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "جارٍ الإرسال..." : "إرسال بيانات الدفع"}
      </Button>
    </form>
  );
}
