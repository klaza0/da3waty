import { InvitationView } from "@/components/invitation/InvitationView";
import { PrivateGate } from "@/components/invitation/PrivateGate";
import { recordVisit } from "@/app/actions/public";
import { coupleTitle } from "@/lib/date";
import { getApprovedMessages, getAttendingCount, getPublishedInvitation } from "@/lib/invitations/queries";
import { getSiteUrl } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getPublishedInvitation(slug);
  if (!invitation) {
    return { title: "الدعوة غير موجودة" };
  }
  const title = `${coupleTitle(invitation.groomName, invitation.brideName)} | دعوتنا`;
  const description = "يشرفنا حضوركم ومشاركتنا فرحتنا.";
  const url = `${getSiteUrl()}/invite/${invitation.slug}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: invitation.coverImage ? [{ url: invitation.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: invitation.coverImage ? [invitation.coverImage] : undefined,
    },
  };
}

export default async function InvitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const invitation = await getPublishedInvitation(slug);
  if (!invitation) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-3xl">الدعوة غير موجودة أو تم حذفها.</h1>
        <Link href="/" className="mt-6 rounded-full bg-rose px-6 py-3 text-white">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  await recordVisit(slug);
  const messages = await getApprovedMessages(invitation.id);
  const attendingCount = invitation.showAttendeeCount ? await getAttendingCount(invitation.id) : 0;
  const view = (
    <InvitationView
      data={{ ...invitation, attendingCount }}
      messages={messages}
      interactive
      siteUrl={getSiteUrl()}
    />
  );

  return (
    <div className="min-h-dvh">
      {invitation.privateAccess && invitation.accessCode ? (
        <PrivateGate code={invitation.accessCode}>{view}</PrivateGate>
      ) : (
        view
      )}
    </div>
  );
}
