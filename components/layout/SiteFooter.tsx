import { APP_NAME, APP_NAME_EN, TAGLINE_ALT } from "@/lib/constants";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ivory">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xl text-ink">
            {APP_NAME} <span className="text-sm text-muted">| {APP_NAME_EN}</span>
          </p>
          <p className="mt-1">{TAGLINE_ALT}</p>
        </div>
        <div className="flex gap-5">
          <Link href="/templates">التصميمات</Link>
          <Link href="/privacy">سياسة الخصوصية</Link>
          <Link href="/login">تسجيل الدخول</Link>
          <Link href="/invite/seif-sama">دعوة تجريبية</Link>
        </div>
      </div>
    </footer>
  );
}
