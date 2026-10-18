"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";

export function QrCard({ url }: { url: string }) {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    import("qrcode").then((QRCode) =>
      QRCode.toDataURL(url, { width: 280, margin: 1, color: { dark: "#2c2416", light: "#fffdf8" } }).then(
        (value) => {
          if (!cancelled) setSrc(value);
        },
      ),
    );
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (!src) return null;

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <p className="text-sm tracking-[0.2em] opacity-70">رمز الدعوة</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="رمز QR للدعوة" className="h-40 w-40 rounded-2xl bg-white p-2" />
      <a
        href={src}
        download="da3waty-qr.png"
        className="inline-flex items-center gap-1 text-sm opacity-80 hover:opacity-100"
      >
        <Download className="h-4 w-4" />
        تنزيل الرمز
      </a>
    </div>
  );
}
