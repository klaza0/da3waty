"use client";

import { submitMessage } from "@/app/actions/public";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PublicMessage } from "@/types/invitation";
import { useState, useTransition } from "react";

export function Guestbook({
  invitationId,
  messages,
  interactive,
}: {
  invitationId: string;
  messages: PublicMessage[];
  interactive: boolean;
}) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function onSubmit() {
    if (!interactive) {
      setStatus("بعد النشر ستظهر التهاني للضيوف.");
      return;
    }
    start(async () => {
      const result = await submitMessage({ invitationId, guestName: name, message });
      if (result.error) {
        setStatus(result.error);
        return;
      }
      setName("");
      setMessage("");
      setStatus("وصلت تهنئتك، شكرًا لقلبك.");
    });
  }

  return (
    <div className="space-y-6">
      <h3 className="text-center font-display text-2xl">اترك تهنئتك</h3>
      <div className="space-y-3">
        <Input placeholder="اسمك" value={name} onChange={(event) => setName(event.target.value)} maxLength={80} />
        <Textarea
          placeholder="كلمتك للعروسين"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={500}
        />
        <Button className="w-full" onClick={onSubmit} disabled={pending}>
          {pending ? "جارٍ الإرسال..." : "إرسال التهنئة"}
        </Button>
        {status ? <p className="text-center text-sm opacity-80">{status}</p> : null}
      </div>
      <div className="space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-sm opacity-60">كن أول من يكتب تهنئة.</p>
        ) : (
          messages.map((item) => (
            <article key={item.id} className="rounded-2xl border border-current/10 p-4">
              <p className="text-sm font-medium">{item.guestName}</p>
              <p className="mt-1 text-sm leading-7 opacity-80">{item.message}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
