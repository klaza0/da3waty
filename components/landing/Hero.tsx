"use client";

import { buttonClass } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
      <div>
        <p className="text-sm tracking-[0.25em] text-gold-deep">دعوتي</p>
        <h1 className="mt-4 max-w-xl font-display text-4xl leading-snug text-ink sm:text-5xl">
          اصنع دعوتك الإلكترونية في دقائق
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-9 text-muted">
          اختر تصميمك، أضف بياناتك، وانشر دعوتك وشاركها مع أحبائك. اشتراك الموقع ١٠٠٠ جنيه مرة واحدة، ويفتح كل التصميمات.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/templates" className={buttonClass("primary", "lg")}>
            ابدأ الآن
          </Link>
          <Link href="/templates" className={buttonClass("secondary", "lg")}>
            تصفح التصميمات
          </Link>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0.4, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex justify-center lg:justify-start"
      >
        <div className="phone-frame relative w-[280px] overflow-hidden">
          <div className="h-[560px] overflow-hidden rounded-[1.9rem] bg-[#7d8b68]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/templates/sage/couple.jpg"
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
