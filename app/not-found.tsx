import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-4xl">هذه الصفحة غير موجودة</h1>
      <p className="mt-3 text-muted">ربما تم نقل الرابط أو حذفه.</p>
      <Link href="/" className="mt-6 rounded-full bg-rose px-6 py-3 text-white">
        العودة للرئيسية
      </Link>
    </div>
  );
}
