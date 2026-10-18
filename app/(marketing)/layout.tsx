import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { hasFullAccess } from "@/lib/billing";
import { getCurrentUser } from "@/lib/invitations/queries";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader
        userEmail={user?.email}
        isAdmin={user?.role === "admin"}
        showSubscribe={Boolean(user) && !hasFullAccess(user?.plan, user?.role)}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
