import type { MetadataRoute } from "next";
import { SITE, VENTURES, ventureHref } from "@/lib/portfolio";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/what-we-do/",
    "/companies/",
    ...VENTURES.map((venture) => ventureHref(venture.slug)),
    "/approach/",
    "/partnership/",
  ].map((path) => ({ url: `${SITE.origin}${path}` }));
}
