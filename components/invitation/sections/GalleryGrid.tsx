"use client";

import { useState } from "react";

export function GalleryGrid({ images }: { images: string[] }) {
  const [active, setActive] = useState<string | null>(null);

  if (images.length === 0) return null;

  return (
    <div>
      <h3 className="mb-4 text-center font-display text-2xl">الصور</h3>
      <div className="grid grid-cols-2 gap-2">
        {images.map((src) => (
          <button
            key={src}
            type="button"
            className="overflow-hidden rounded-2xl"
            onClick={() => setActive(src)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-36 w-full object-cover transition-transform duration-500 hover:scale-105" />
          </button>
        ))}
      </div>
      {active ? (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setActive(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active} alt="" className="max-h-full max-w-full rounded-2xl object-contain" />
        </button>
      ) : null}
    </div>
  );
}
