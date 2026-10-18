import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TemplatesPreview } from "@/components/landing/TemplatesPreview";
import { buttonClass } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TemplatesPreview />
      <HowItWorks />
      <Features />
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-4xl rounded-[2rem] bg-ink px-8 py-14 text-center text-cream">
          <h2 className="font-display text-4xl">ابدأ دعوتك الآن</h2>
          <p className="mt-3 text-cream/70">اشتراك مرة واحدة بـ ١٠٠٠ جنيه، ثم من التصميم إلى الرابط.</p>
          <Link href="/templates" className={`${buttonClass("gold", "lg")} mt-8`}>
            ابدأ دعوتك
          </Link>
        </div>
      </section>
    </>
  );
}
