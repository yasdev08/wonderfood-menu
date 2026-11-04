export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://wonderfood-menu.vercel.app"
).replace(/\/$/, "");

export const SITE = {
  name: "Wonder Food's Maraval",
  shortName: "Wonder Food's",
  title: "Wonder Food's Maraval – Crêpes, gaufres & desserts à Oran",
  description:
    "Wonder Food's Maraval à Oran : crêpes, gaufres, tiramisu, sundaes, milkshakes et jus frais. Consultez le menu, les prix et commandez en ligne via WhatsApp.",
  keywords: [
    "Wonder Food's",
    "Wonder Foods Maraval",
    "crêperie Oran",
    "crêpes Oran",
    "gaufres Oran",
    "tiramisu Oran",
    "desserts Oran",
    "milkshake Oran",
    "jus frais Oran",
    "salon de thé Maraval",
    "café Maraval",
    "menu Wonder Food's",
  ],
  locale: "fr_DZ",
  themeColor: "#C9060F",
  phone: "+213660570102",
  address: {
    streetAddress: "Rue des Martyrs, Maraval",
    addressLocality: "Oran",
    addressRegion: "Oran",
    addressCountry: "DZ",
  },
  mapsUrl: "https://maps.app.goo.gl/KQwZqUJuBf1CzszKA",
  sameAs: [
    "https://www.instagram.com/wonder.foods.maraval",
    "https://www.facebook.com/wonderfoods3131/",
  ],
  openingHours: { opens: "12:00", closes: "23:59" },
} as const;
