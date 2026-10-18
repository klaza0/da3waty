"use client";

import { buttonClass } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/templates", label: "التصميمات" },
  { href: "/#how", label: "كيف تعمل؟" },
  { href: "/#features", label: "المميزات" },
];

export function SiteHeader({
  userEmail,
  isAdmin = false,
  showSubscribe = false,
}: {
  userEmail?: string | null;
  isAdmin?: boolean;
  showSubscribe?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-display text-2xl text-ink">
          {APP_NAME}
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink">
              {link.label}
            </Link>
          ))}
          {userEmail ? (
            <>
              <Link href="/dashboard" className="hover:text-ink">
                لوحة التحكم
              </Link>
              {showSubscribe ? (
                <Link href="/subscribe" className="hover:text-ink">
                  الاشتراك
                </Link>
              ) : null}
              {isAdmin ? (
                <Link href="/admin" className="hover:text-ink">
                  الأدمن
                </Link>
              ) : null}
            </>
          ) : (
            <Link href="/login" className="hover:text-ink">
              تسجيل الدخول
            </Link>
          )}
          <Link href="/templates" className={buttonClass("primary", "sm", "px-4")}>
            ابدأ دعوتك
          </Link>
        </nav>
        <button type="button" className="md:hidden" onClick={() => setOpen((value) => !value)} aria-label="القائمة">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-line bg-cream px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href={userEmail ? "/dashboard" : "/login"} onClick={() => setOpen(false)}>
              {userEmail ? "لوحة التحكم" : "تسجيل الدخول"}
            </Link>
            {showSubscribe ? (
              <Link href="/subscribe" onClick={() => setOpen(false)}>
                الاشتراك
              </Link>
            ) : null}
            {isAdmin ? (
              <Link href="/admin" onClick={() => setOpen(false)}>
                الأدمن
              </Link>
            ) : null}
            <Link href="/templates" className="font-medium text-rose" onClick={() => setOpen(false)}>
              ابدأ دعوتك
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
