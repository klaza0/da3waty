export function LocationCard({
  venueName,
  address,
  address2,
  mapUrl,
  className = "",
}: {
  venueName: string;
  address: string;
  address2?: string;
  mapUrl?: string;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl border border-current/15 p-5 text-center ${className}`}>
      <p className="text-sm opacity-70">الموقع</p>
      <p className="mt-2 font-display text-2xl">{venueName}</p>
      <p className="mt-1 text-sm opacity-80">{address}</p>
      {address2 ? <p className="mt-1 text-sm opacity-80">{address2}</p> : null}
      {mapUrl ? (
        <a
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex rounded-full border border-current/30 px-5 py-2 text-sm transition-opacity hover:opacity-80"
        >
          فتح الموقع
        </a>
      ) : null}
    </div>
  );
}
