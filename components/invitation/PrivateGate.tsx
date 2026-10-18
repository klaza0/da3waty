"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function PrivateGate({ code, children }: { code: string; children: React.ReactNode }) {
  const [value, setValue] = useState("");
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (ok || !code) return <>{children}</>;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl">🔒 دعوة خاصة</h1>
      <p className="mt-2 text-sm text-muted">أدخلوا رمز الدخول لفتح الدعوة.</p>
      <form
        className="mt-6 w-full max-w-sm space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (value.trim() === code.trim()) setOk(true);
          else setError("الرمز غير صحيح.");
        }}
      >
        <Input value={value} onChange={(event) => setValue(event.target.value)} placeholder="رمز الدخول" />
        {error ? <p className="text-sm text-rose">{error}</p> : null}
        <Button className="w-full" type="submit">
          دخول
        </Button>
      </form>
    </div>
  );
}
