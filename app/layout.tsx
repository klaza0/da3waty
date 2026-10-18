import type { Metadata } from "next";
import {
  Amiri,
  Aref_Ruqaa,
  Cairo,
  Great_Vibes,
  Noto_Naskh_Arabic,
  Outfit,
  Pinyon_Script,
  Playfair_Display,
  Reem_Kufi,
  Tajawal,
} from "next/font/google";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Toaster } from "sonner";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

const ruqaa = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: "400",
  variable: "--font-ruqaa",
});

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-great-vibes" });
const pinyon = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--font-pinyon" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-playfair" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const notoNaskh = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-noto-naskh" });
const reemKufi = Reem_Kufi({ subsets: ["arabic"], variable: "--font-reem-kufi" });
const tajawal = Tajawal({ subsets: ["arabic", "latin"], weight: ["400", "500", "700"], variable: "--font-tajawal" });

export const metadata: Metadata = {
  title: {
    default: "دعوتي | Da3waty",
    template: "%s | دعوتي",
  },
  description: "اصنع دعوتك الإلكترونية في دقائق وشاركها مع أحبائك.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${cairo.variable} ${amiri.variable} ${ruqaa.variable} ${greatVibes.variable} ${pinyon.variable} ${playfair.variable} ${outfit.variable} ${notoNaskh.variable} ${reemKufi.variable} ${tajawal.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream font-sans text-ink">
        {children}
        <CookieBanner />
        <Toaster richColors position="top-center" dir="rtl" />
      </body>
    </html>
  );
}
