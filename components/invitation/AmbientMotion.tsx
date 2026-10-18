"use client";

export function AmbientMotion({
  variant,
}: {
  variant: "petals" | "sparks" | "leaves" | "hearts" | "dust";
}) {
  const items = Array.from({ length: 8 }, (_, index) => index);
  return (
    <div className={`ambient ambient-${variant}`} aria-hidden>
      {items.map((item) => (
        <span key={item} style={{ animationDelay: `${-item * 1.4}s`, left: `${8 + item * 12}%` }} />
      ))}
    </div>
  );
}
