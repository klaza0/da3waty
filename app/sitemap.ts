import { getSiteUrl } from "@/lib/utils";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  return [
    { url: site, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/templates`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site}/privacy`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${site}/invite/seif-sama`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
