import type { MetadataRoute } from "next";
import { MENU_ITEMS, VISIBLE_CATEGORY_SET } from "@/lib/menu";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const images = MENU_ITEMS.filter(
    (i) => i.image && VISIBLE_CATEGORY_SET.has(i.category),
  ).map((i) => `${SITE_URL}${i.image}`);

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images,
    },
  ];
}
