"use client";

import { submitRsvp } from "@/app/actions/public";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";

export function RsvpForm({ invitationId, interactive }: { invitationId: string; interactive: boolean }) {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function onSubmit() {
    if (!interactive) {
      setStatus("جرّب النشر لتجربة الردود.");
      return;
    }
    start(async () => {
      const result = await submitRsvp({
        invitationId,
        guestName: name,
        attending: Boolean(attending),
      });
      setStatus(result.error ?? "تم حفظ ردك، شكرًا لك.");
    });
  }

  return (
    <div className="space-y-4 text-center">
      <h3 className="font-display text-2xl">هل ستشاركوننا فرحتنا؟</h3>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant={attending === true ? "primary" : "secondary"}
          className="flex-1"
          onClick={() => setAttending(true)}
        >
          بكل تأكيد
        </Button>
        <Button
          variant={attending === false ? "danger" : "secondary"}
          className="flex-1"
          onClick={() => setAttending(false)}
        >
          للأسف لن أستطيع
        </Button>
      </div>
      {attending !== null ? (
        <div className="space-y-3">
          <Input
            placeholder="اسمك"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
          />
          <Button type="button" onClick={onSubmit} disabled={pending || name.trim().length < 2}>
            {pending ? "جارٍ الحفظ..." : "تأكيد الرد"}
          </Button>
        </div>
      ) : null}
      {status ? <p className="text-sm opacity-80">{status}</p> : null}
    </div>
  );
}
