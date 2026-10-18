"use client";

import { combineDateTime } from "@/lib/date";
import { useEffect, useMemo, useState } from "react";

function pad(value: number) {
  return String(Math.max(0, value)).padStart(2, "0");
}

export function Countdown({
  eventDate,
  eventTime,
  className = "",
}: {
  eventDate: string;
  eventTime: string;
  className?: string;
}) {
  const target = useMemo(() => combineDateTime(eventDate, eventTime).getTime(), [eventDate, eventTime]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = Math.max(0, target - (now ?? target));
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const ended = diff <= 0;

  const items = [
    { label: "يوم", value: pad(days) },
    { label: "ساعة", value: pad(hours) },
    { label: "دقيقة", value: pad(minutes) },
    { label: "ثانية", value: pad(seconds) },
  ];

  return (
    <div className={className}>
      <p className="mb-4 text-center text-sm tracking-[0.3em] opacity-70">
        {ended ? "بدأت المناسبة" : "العد التنازلي"}
      </p>
      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-current/15 px-2 py-3 text-center">
            <div className="font-display text-2xl leading-none">{item.value}</div>
            <div className="mt-1 text-[11px] opacity-70">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
