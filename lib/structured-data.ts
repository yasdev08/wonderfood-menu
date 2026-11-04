import { CATEGORY_LABELS, MENU_ITEMS, VISIBLE_CATEGORIES } from "@/lib/menu";
import { SITE, SITE_URL } from "@/lib/site";

const abs = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path}`;

/** schema.org Restaurant + Menu JSON-LD for the home page. */
export function getRestaurantJsonLd() {
  const sections = VISIBLE_CATEGORIES.map((category) => {
    const items = MENU_ITEMS.filter((i) => i.category === category);
    if (items.length === 0) return null;
    return {
      "@type": "MenuSection",
      name: CATEGORY_LABELS[category] ?? category,
      hasMenuItem: items.map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        ...(item.description && { description: item.description }),
        ...(item.image && { image: abs(item.image) }),
        offers: {
          "@type": "Offer",
          price: item.price,
          priceCurrency: "DZD",
          availability: "https://schema.org/InStock",
        },
      })),
    };
  }).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE.name,
        inLanguage: "fr",
      },
      {
        "@type": ["Restaurant", "CafeOrCoffeeShop"],
        "@id": `${SITE_URL}/#restaurant`,
        name: SITE.name,
        description: SITE.description,
        url: SITE_URL,
        logo: abs("/icons/icon-512.png"),
        image: [abs("/og-image.jpg")],
        telephone: SITE.phone,
        priceRange: "$",
        currenciesAccepted: "DZD",
        servesCuisine: ["Desserts", "Crêpes", "Gaufres", "Boissons"],
        address: { "@type": "PostalAddress", ...SITE.address },
        hasMap: SITE.mapsUrl,
        sameAs: SITE.sameAs,
        acceptsReservations: false,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: SITE.openingHours.opens,
            closes: SITE.openingHours.closes,
          },
        ],
        hasMenu: {
          "@type": "Menu",
          name: `Menu ${SITE.name}`,
          url: `${SITE_URL}/#menu`,
          inLanguage: "fr",
          hasMenuSection: sections,
        },
      },
    ],
  };
}
