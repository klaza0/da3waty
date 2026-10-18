import { formatEventDate, formatEventTime } from "@/lib/date";
import { Calendar, Clock, MapPin } from "lucide-react";

export function EventDetails({
  eventDate,
  eventTime,
  venueName,
  address,
  address2,
  className = "",
}: {
  eventDate: string;
  eventTime: string;
  venueName: string;
  address: string;
  address2?: string;
  className?: string;
}) {
  const place = [venueName, address, address2].filter(Boolean).join("\n");
  const rows = [
    { icon: Calendar, label: "التاريخ", value: formatEventDate(eventDate) },
    { icon: Clock, label: "الوقت", value: formatEventTime(eventTime) },
    { icon: MapPin, label: "المكان", value: place },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-start gap-3">
          <row.icon className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
          <div>
            <p className="text-xs tracking-[0.2em] opacity-60">{row.label}</p>
            <p className="mt-1 whitespace-pre-line text-sm leading-7">{row.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
