"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl">حدث خطأ غير متوقع</h1>
      <button type="button" onClick={reset} className="mt-6 rounded-full bg-ink px-6 py-3 text-cream">
        إعادة المحاولة
      </button>
    </div>
  );
}
