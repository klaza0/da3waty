import { AuthForm } from "@/components/auth/AuthForm";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <div className="px-4 py-16">
        <Suspense>
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </div>
  );
}
