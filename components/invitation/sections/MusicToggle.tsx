"use client";

import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";

export function MusicToggle({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    await audio.play();
    setPlaying(true);
  }

  return (
    <div className="flex justify-center">
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        className="inline-flex items-center gap-2 rounded-full border border-current/25 px-4 py-2 text-sm"
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
      </button>
    </div>
  );
}
