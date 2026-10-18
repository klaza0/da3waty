import { getSiteUrl } from "@/lib/utils";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard", "/create"] }],
    sitemap: `${site}/sitemap.xml`,
  };
}
