"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!isSupabaseConfigured()) {
      setError("أضف NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY في .env.local");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      if (mode === "register") {
        const { data, error: signError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (signError) throw signError;
        if (data.session) {
          router.push(next);
          router.refresh();
          return;
        }
        setMessage("أرسلنا لك رسالة أنيقة لتأكيد بريدك. افتحها ثم ارجع لتسجيل الدخول.");
      } else {
        const { error: signError } = await supabase.auth.signInWithPassword({ email, password });
        if (signError) throw signError;
        router.push(next);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إتمام العملية");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    if (!isSupabaseConfigured()) {
      setError(" Supabase غير متصل.");
      return;
    }
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (oauthError) setError("تسجيل جوجل غير مفعّل بعد في إعدادات المشروع.");
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-[1.8rem] border border-line bg-white p-7 shadow-soft">
      <h1 className="font-display text-3xl">{mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}</h1>
      <p className="mt-2 text-sm text-muted">احفظ دعواتك وعدّل عليها في أي وقت.</p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        {mode === "register" ? (
          <div>
            <Label htmlFor="name">الاسم</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        ) : null}
        <div>
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error ? <p className="text-sm text-rose">{error}</p> : null}
        {message ? (
          <div className="rounded-2xl bg-ivory px-4 py-3 text-sm leading-7 text-ink">
            <p className="font-medium">راجع بريدك</p>
            <p className="mt-1 text-muted">{message}</p>
          </div>
        ) : null}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "جارٍ التنفيذ..." : mode === "login" ? "دخول" : "إنشاء الحساب"}
        </Button>
      </form>
      <button type="button" onClick={google} className="mt-4 w-full rounded-full border border-line py-3 text-sm">
        المتابعة عبر Google
      </button>
      <p className="mt-5 text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            ليس لديك حساب؟{" "}
            <Link className="text-rose" href={`/register?next=${encodeURIComponent(next)}`}>
              سجّل الآن
            </Link>
          </>
        ) : (
          <>
            لديك حساب؟{" "}
            <Link className="text-rose" href={`/login?next=${encodeURIComponent(next)}`}>
              تسجيل الدخول
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
