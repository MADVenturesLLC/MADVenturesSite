import type { MetadataRoute } from "next";
import { SITE } from "@/lib/portfolio";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/console/",
        "/console/*",
        "/admin/",
        "/admin/*",
        "/internal/",
        "/internal/*",
      ],
    },
    sitemap: `${SITE.origin}/sitemap.xml`,
  };
}
