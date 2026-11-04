// ─── Types ────────────────────────────────────────────────────────────────────

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  /** Unique ID: `${menuItem.id}` or `${menuItem.id}:${sortedToppingIds}` */
  id: string;
  item: MenuItem;
  quantity: number;
  toppings: Topping[];
}

// ─── Helpers (exported so cart-drawer can import them) ────────────────────────

export const getCartItemId = (itemId: string, toppings: Topping[]): string => {
  const key = toppings
    .map((t) => t.id)
    .sort()
    .join(",");
  return key ? `${itemId}:${key}` : itemId;
};

export const getCartItemUnitPrice = (cartItem: CartItem): number =>
  cartItem.item.price + cartItem.toppings.reduce((sum, t) => sum + t.price, 0);

// ─── Category Configuration ───────────────────────────────────────────────────

/**
 * The 8 public-facing categories in exact display order.
 * Hidden categories (Tartes, Boxes, Desserts, Savory, Bottled Drinks,
 * Supplements) are kept in MENU_ITEMS for future use but not rendered.
 */
export const VISIBLE_CATEGORIES = [
  "Specials",
  "Crepes",
  "Waffles",
  "Sundaes",
  "Milkshakes",
  "Fresh Juices",
  "Tiramisu",
  "Hot Beverages",
  "Tartes",
  "Desserts",
] as const;

export type VisibleCategory = (typeof VISIBLE_CATEGORIES)[number];

export const VISIBLE_CATEGORY_SET = new Set<string>(VISIBLE_CATEGORIES);

/** French customer-facing labels keyed by internal category value */
export const CATEGORY_LABELS: Record<string, string> = {
  Specials: "Special",
  Crepes: "Crêpes",
  Waffles: "Gaufres",
  Sundaes: "Sundae",
  Milkshakes: "Milkshake",
  "Fresh Juices": "Jus",
  Tiramisu: "Tiramisu",
  "Hot Beverages": "Boissons Chaudes",
  Desserts: "Desserts",
};

/** Only these 4 categories open the toppings customisation modal */
export const CUSTOMIZABLE_CATEGORIES = new Set<string>([
  "Crepes",
  "Waffles",
  "Milkshakes",
  "Tiramisu",
  "Specials",
  "Sundaes",
  "Milkshakes",
  "Tiramisu",
  "Desserts",
]);

// ─── Toppings (converted from existing Supplement products) ───────────────────

export const TOPPINGS: Topping[] = [
  { id: "topping-standard", name: "Topping Standard", price: 200 },
  { id: "topping-nutella", name: "Nutella", price: 200 },
  { id: "topping-kiwi", name: "Kiwi", price: 200 },
  { id: "topping-banane", name: "Banane", price: 200 },
];

// ─── Menu Items ───────────────────────────────────────────────────────────────

export const MENU_ITEMS: MenuItem[] = [
  // ── Specials ──────────────────────────────────────────────────────────────
  {
    id: "1",
    name: "Crepe Dubai",
    price: 500,
    category: "Specials",
    image: "/images/menu/crepe-dubai.webp",
    description:
      "Une crêpe croustillante premium inspirée des saveurs de Dubaï, nappée de chocolat fin.",
  },
  {
    id: "2",
    name: "La Snickers",
    price: 250,
    category: "Specials",
    image: "/images/menu/la-snickers.webp",
    description:
      "Une barre spéciale gourmande aux éclats de cacahuètes, caramel et chocolat façon Snickers.",
  },
  {
    id: "3",
    name: "Cake Dubai",
    price: 1000,
    category: "Specials",
    image: "/images/menu/cake-dubai.webp",
    description:
      "Notre dessert signature : un gâteau riche et ultra-gourmand aux saveurs orientales modernes.",
  },
  // ── Tartes (hidden – kept for future use) ─────────────────────────────────
  {
    id: "11",
    name: "Tarte Fruits",
    price: 6000,
    category: "Tartes",
    image: "/images/menu/tarte-fruits.webp",
    description:
      "Grande tarte à partager, garnie d'une crème légère et d'une sélection de fruits frais de saison.",
  },
  {
    id: "12",
    name: "Tarte Mixte",
    price: 6000,
    category: "Tartes",
    image: "/images/menu/tarte-mixte.webp",
    description:
      "Tarte grand format combinant le croquant des fruits et la richesse des nappages chocolats.",
  },
  {
    id: "13",
    name: "Tarte Surprise Petite",
    price: 6500,
    category: "Tartes",
    image: "/images/menu/tarte-surprise-petite.webp",
    description:
      "Une création surprise unique de notre chef pâtissier, format moyen.",
  },
  {
    id: "14",
    name: "Tarte Chocolat",
    price: 7000,
    category: "Tartes",
    image: "/images/menu/tarte-chocolat.webp",
    description:
      "L'extase totale pour les chocoholiques : pâte sablée et ganache intense au chocolat.",
  },
  {
    id: "15",
    name: "Tarte Surprise Grande",
    price: 8000,
    category: "Tartes",
    image: "/images/menu/tarte-surprise-grande.webp",
    description:
      "Notre plus grande tarte événementielle, une explosion de garnitures et de douceurs surprises.",
  },
  {
    id: "101",
    name: "Tarte Cheesecake",
    price: 4700,
    category: "Specials",
    image: "/images/menu/Tarte-cheesecake.webp",
    description:
      "Notre plus grande tarte événementielle, une explosion de garnitures et de douceurs surprises.",
  },
  {
    id: "102",
    name: "Crepe Moulise",
    price: 450,
    category: "Specials",
    image: "/images/menu/Moulise.webp",
    description: "Crepe Moulise",
  },
  {
    id: "103",
    name: "Brownies",
    price: 600,
    category: "Specials",
    image: "/images/menu/Brownies.webp",
    description: "Brownies",
  },
  {
    id: "104",
    name: "Browkies",
    price: 600,
    category: "Specials",
    image: "/images/menu/Browkies.webp",
    description: "Browkies",
  },
  {
    id: "105",
    name: "Scoop Cookies ",
    price: 600,
    category: "Specials",
    image: "/images/menu/Scoop-Cookies.webp",
    description: "Scoop Cookies",
  },
  {
    id: "106",
    name: "Mini Pancakes",
    price: 500,
    category: "Specials",
    image: "/images/menu/mini-pancakes.webp",
    description: "Mini Pancakes",
  },
  {
    id: "107",
    name: "Pancakes",
    price: 650,
    category: "Specials",
    image: "/images/menu/Pancakes.webp",
    description: "Pancakes",
  },
  {
    id: "108",
    name: "Qtayef",
    price: 200,
    category: "Specials",
    image: "/images/menu/qtayef.webp",
    description: "Qtayef",
  },

  // ── Crepes ────────────────────────────────────────────────────────────────
  {
    id: "16",
    name: "Crepe Simple",
    price: 450,
    category: "Crepes",
    image: "/images/menu/crepe-simple.webp",
    description:
      "Crêpe fine traditionnelle, légère et saupoudrée d'une touche sucrée.",
  },
  {
    id: "17",
    name: "Crepe La Banana",
    price: 700,
    category: "Crepes",
    image: "/images/menu/crepe-la-banana.webp",
    description:
      "Crêpe roulée garnie de morceaux de bananes fondantes et de chocolat.",
  },
  {
    id: "18",
    name: "Crepe La Fraisy",
    price: 700,
    category: "Crepes",
    image: "/images/menu/crepe-la-fraisy.webp",
    description: "Crêpe fraîcheur fourrée aux morceaux de fraises juteuses.",
  },
  {
    id: "19",
    name: "Crepe La Nuits",
    price: 700,
    category: "Crepes",
    image: "/images/menu/crepe-la-nuits.webp",
    description:
      "Une recette mystérieuse et sombrement chocolatée pour les sessions tardives.",
  },
  {
    id: "20",
    name: "Crepe La Lotus",
    price: 700,
    category: "Crepes",
    image: "/images/menu/crepe-la-lotus.webp",
    description:
      "Crêpe gourmande au goût inimitable de biscuit caramélisé Speculoos.",
  },
  {
    id: "21",
    name: "Crepe 4 Choco",
    price: 800,
    category: "Crepes",
    image: "/images/menu/crepe-4-choco.webp",
    description:
      "Le summum de la gourmandise : un mélange équilibré de 4 types de chocolats fusionnés.",
  },
  {
    id: "22",
    name: "Crepe Fraisychio",
    price: 700,
    category: "Crepes",
    image: "/images/menu/crepe-fraisychio.webp",
    description:
      "Un duo somptueux unissant la fraise fraîche et la crème de pistache.",
  },
  {
    id: "23",
    name: "Crepe Kiwi",
    price: 800,
    category: "Crepes",
    image: "/images/menu/crepe-kiwi.webp",
    description:
      "Une touche acidulée originale avec des tranches fines de kiwi frais.",
  },
  {
    id: "24",
    name: "Crepe La Spéciale",
    price: 800,
    category: "Crepes",
    image: "/images/menu/crepe-la-speciale.webp",
    description:
      "La crêpe composée selon les secrets de la maison Wonder Food's.",
  },
  {
    id: "25",
    name: "Crepe La Fruita",
    price: 700,
    category: "Crepes",
    image: "/images/menu/crepe-la-fruita.webp",
    description:
      "Un cocktail de fruits coupés glissé dans une pâte de crêpe fine et légère.",
  },
  {
    id: "26",
    name: "Crepe Banachio",
    price: 700,
    category: "Crepes",
    image: "/images/menu/crepe-banachio.webp",
    description:
      "Mariage onctueux entre la douceur de la banane et l'arôme de la pistache.",
  },
  {
    id: "27",
    name: "Crepe 4 Fruits",
    price: 800,
    category: "Crepes",
    image: "/images/menu/crepe-4-fruits.webp",
    description:
      "Quatre fruits de saison minutieusement coupés pour un maximum de vitamines.",
  },
  {
    id: "29",
    name: "Crepe Pistachio",
    price: 600,
    category: "Crepes",
    image: "/images/menu/crepe-pistachio.webp",
    description:
      "Nappée d'une crème de pistache onctueuse 100% pure et savoureuse.",
  },
  {
    id: "31",
    name: "Crepe Ananas",
    price: 700,
    category: "Crepes",
    image: "/images/menu/crepe-ananas.webp",
    description:
      "Une touche exotique rafraîchissante à base de dés d'ananas juteux.",
  },
  {
    id: "33",
    name: "Crepe Nutella Maxi",
    price: 700,
    category: "Crepes",
    image: "/images/menu/crepe-nutella-maxi.webp",
    description:
      "Format géant chargé au Nutella pour combler les très grosses faims.",
  },
  {
    id: "34",
    name: "Crepe Bueno",
    price: 700,
    category: "Crepes",
    image: "/images/menu/crepe-bueno.webp",
    description:
      "Fourrée au chocolat fondu et brisures de barres Kinder Bueno.",
  },
  {
    id: "35",
    name: "Crepe 100% Pistaches",
    price: 700,
    category: "Crepes",
    image: "/images/menu/crepe-100-pistaches.webp",
    description:
      "Une expérience premium saturée en éclats et crème de pistaches sélectionnées.",
  },
  {
    id: "36",
    name: "Crepe Mixte",
    price: 700,
    category: "Crepes",
    image: "/images/menu/crepe-mixte.webp",
    description:
      "Le compromis parfait combinant plusieurs garnitures au choix sur la même pâte.",
  },
  {
    id: "37",
    name: "Crepe Wonder",
    price: 1500,
    category: "Crepes",
    image: "/images/menu/crepe-wonder.webp",
    description:
      "Le chef-d'œuvre suprême de l'établissement : énorme, ultra-garnie et spectaculaire.",
  },
  // ── Boxes (hidden – kept for future use) ──────────────────────────────────
  {
    id: "38",
    name: "Box Fruita",
    price: 1500,
    category: "Boxes",
    image: "/images/menu/box-fruita.webp",
    description:
      "Un assortiment convivial de bouchées sucrées et morceaux de fruits à emporter.",
  },
  {
    id: "39",
    name: "Box Choco",
    price: 2000,
    category: "Boxes",
    image: "/images/menu/box-choco.webp",
    description:
      "Le coffret de partage ultime rempli de douceurs et de textures chocolatées.",
  },
  {
    id: "40",
    name: "Box Wonder Food's",
    price: 2400,
    category: "Boxes",
    image: "/images/menu/box-wonder.webp",
    description:
      "Notre box signature premium regroupant un mix des meilleurs desserts de la maison.",
  },
  // ── Desserts (hidden – kept for future use) ────────────────────────────────
  {
    id: "41",
    name: "Cheesecake Choco",
    price: 650,
    category: "Desserts",
    image: "/images/menu/cheesecake-choco.webp",
    description: "CheeseCake Choco",
  },
  {
    id: "109",
    name: "Cheesecake Citron",
    price: 650,
    category: "Desserts",
    image: "/images/menu/cheesecake-citron.webp",
    description: "Chesse Cake Citron",
  },
  {
    id: "122",
    name: "Cheesecake Kunafa",
    price: 650,
    category: "Desserts",
    image: "/images/menu/chscake-kunafa.webp",
    description: "ChesseCake Kunafa",
  },
  {
    id: "123",
    name: "Cheesecake Oreo",
    price: 650,
    category: "Desserts",
    image: "/images/menu/cheesecake-oreo.webp",
    description: "ChesseCake Oreo",
  },
  {
    id: "124",
    name: "Cheesecake Bueno",
    price: 650,
    category: "Desserts",
    image: "/images/menu/cheesecake-bueno.webp",
    description: "ChesseCake Oreo",
  },
  {
    id: "125",
    name: "Cheesecake Lotus",
    price: 650,
    category: "Desserts",
    image: "/images/menu/cheesecake-lotus.webp",
    description: "ChesseCake Lotus",
  },
  {
    id: "128",
    name: "Cheesecake Pistache",
    price: 650,
    category: "Desserts",
    image: "/images/menu/cheesecake-pistache.webp",
    description: "ChesseCake Pistache",
  },
  {
    id: "152",
    name: "Cheesecake Framboise",
    price: 650,
    category: "Desserts",
    image: "/images/menu/cheesecake-framboise.webp",
    description: "ChesseCake Framboise",
  },
  {
    id: "42",
    name: "Saint-Sébastien",
    price: 650,
    category: "Desserts",
    image: "/images/menu/saint-sebastien.webp",
    description:
      "Le célèbre gâteau au fromage brûlé espagnol, au cœur incroyablement coulant.",
  },
  {
    id: "43",
    name: "Fondant-Glaces",
    price: 650,
    category: "Desserts",
    image: "/images/menu/fondant-glaces.webp",
    description:
      "Gâteau moelleux au cœur de chocolat chaud coulant, servi avec sa boule de glace vanille.",
  },
  {
    id: "108",
    name: "Fondant",
    price: 400,
    category: "Desserts",
    image: "/images/menu/fondant-glaces.webp",
    description: "Gâteau moelleux au cœur de chocolat chaud coulant.",
  },
  // ── Savory (hidden – kept for future use) ─────────────────────────────────
  // ── Sundaes ───────────────────────────────────────────────────────────────
  {
    id: "45",
    name: "Sundae Ferrero",
    price: 450,
    category: "Sundaes",
    image: "/images/menu/sundae-ferrero.webp",
    description:
      "Glace onctueuse tourbillonnée de morceaux de Ferrero Rocher et sauce noisette.",
  },
  {
    id: "46",
    name: "Sundae Chocolat",
    price: 450,
    category: "Sundaes",
    image: "/images/menu/sundae-chocolat.webp",
    description:
      "Crème glacée soft servie avec un nappage traditionnel au chocolat riche.",
  },
  {
    id: "47",
    name: "Sundae Kinder",
    price: 400,
    category: "Sundaes",
    image: "/images/menu/sundae-kinder.webp",
    description:
      "Glace vanille nappée et parsemée de morceaux de chocolat Kinder.",
  },
  {
    id: "48",
    name: "Sundae Caramel Beurre Salé",
    price: 400,
    category: "Sundaes",
    image: "/images/menu/sundae-caramel.webp",
    description:
      "Le juste équilibre entre le sucre de la glace et l'intensité du caramel au beurre salé.",
  },
  {
    id: "49",
    name: "Sundae Pistache",
    price: 450,
    category: "Sundaes",
    image: "/images/menu/sundae-pistache.webp",
    description:
      "Rafraîchissement glacé surmonté d'une sauce crémeuse à la pistache.",
  },
  {
    id: "50",
    name: "Sundae Snickers",
    price: 400,
    category: "Sundaes",
    image: "/images/menu/sundae-snickers.webp",
    description:
      "Une coupe glacée gourmande mariant caramel, cacahuètes et chocolat croquant.",
  },
  {
    id: "51",
    name: "Sundae Raffaello",
    price: 400,
    category: "Sundaes",
    image: "/images/menu/sundae-raffaello.webp",
    description:
      "Glace douce parsemée de noix de coco râpée et brisures de Raffaello blanches.",
  },
  // ── Tiramisu ──────────────────────────────────────────────────────────────
  {
    id: "52",
    name: "Tiramisu Nutella",
    price: 500,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-nutella.webp",
    description:
      "Dessert italien revisité avec des couches de crème mascarpone et de Nutella.",
  },
  {
    id: "53",
    name: "Tiramisu KitKat",
    price: 500,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-kitkat.webp",
    description:
      "Tiramisu onctueux intégrant des morceaux croustillants de gaufrettes KitKat.",
  },
  {
    id: "54",
    name: "Tiramisu Pistache",
    price: 500,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-pistache.webp",
    description:
      "Une douceur aérienne subtilement parfumée à la crème de pistache verte.",
  },
  {
    id: "55",
    name: "Tiramisu Bueno",
    price: 500,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-bueno.webp",
    description:
      "Crème de mascarpone fondante mariée aux éclats de Kinder Bueno.",
  },
  {
    id: "56",
    name: "Tiramisu Mars/Caramel",
    price: 500,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-mars.webp",
    description:
      "Un profil sucré lourd combinant caramel fondant et crème onctueuse.",
  },
  {
    id: "57",
    name: "Tiramisu Oreo",
    price: 500,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-oreo.webp",
    description:
      "Des biscuits Oreo moulus alternés avec notre mousse mascarpone signature.",
  },
  {
    id: "58",
    name: "Tiramisu Raffaello",
    price: 500,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-raffaello.webp",
    description:
      "Fraîcheur exotique combinant crème légère, amande et éclats de noix de coco.",
  },
  {
    id: "59",
    name: "Tiramisu Fruits Rouges",
    price: 500,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-fruits-rouges.webp",
    description:
      "Une version acidulée et fruitée balancée par la douceur de la crème.",
  },
  {
    id: "60",
    name: "Tiramisu Snickers",
    price: 500,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-snickers.webp",
    description:
      "Le croquant de la cacahuète s'invite dans la légèreté du tiramisu.",
  },
  {
    id: "61",
    name: "Tiramisu Crunch",
    price: 500,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-crunch.webp",
    description:
      "Une texture surprenante grâce au chocolat au riz soufflé Crunch brisé.",
  },
  {
    id: "62",
    name: "Tiramisu Lotus",
    price: 500,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-lotus.webp",
    description:
      "Un grand classique moderne parfumé à la cannelle et au biscuit Speculoos.",
  },
  // ── Fresh Juices ──────────────────────────────────────────────────────────
  {
    id: "63",
    name: "Jus Orange",
    price: 500,
    category: "Fresh Juices",
    image: "/images/menu/jus-orange.webp",
    description:
      "Oranges fraîches pressées à la minute, sans sucre ajouté, pur jus.",
  },
  {
    id: "64",
    name: "Jus Citron",
    price: 300,
    category: "Fresh Juices",
    image: "/images/menu/jus-citron.webp",
    description:
      "Une citronnade maison rafraîchissante, pressée à vif et ultra-désaltérante.",
  },
  {
    id: "65",
    name: "Jus Banane",
    price: 500,
    category: "Fresh Juices",
    image: "/images/menu/jus-banane.webp",
    description:
      "Jus de banane épais, mixé pour obtenir une consistance douce et rassasiante.",
  },
  {
    id: "66",
    name: "Jus Fraise",
    price: 550,
    category: "Fresh Juices",
    image: "/images/menu/jus-fraise.webp",
    description: "Un délice printanier à base de fraises fraîches mixées.",
  },
  {
    id: "67",
    name: "Jus Pastèque",
    price: 400,
    category: "Fresh Juices",
    image: "/images/menu/jus-pasteque.webp",
    description:
      "L'incontournable de l'été : jus de pastèque frais, hydratant et sucré.",
  },
  {
    id: "68",
    name: "Mojito",
    price: 550,
    category: "Fresh Juices",
    image: "/images/menu/mojito.webp",
    description:
      "Cocktail rafraîchissant sans alcool combinant menthe fraîche, citron vert et eau gazeuse.",
  },
  {
    id: "69",
    name: "Grenadine",
    price: 500,
    category: "Fresh Juices",
    image: "/images/menu/grenadine.webp",
    description:
      "Boisson douce aux sirops fruités rouges, parfaite pour une touche sucrée.",
  },
  {
    id: "70",
    name: "Jus Kiwi Orange",
    price: 600,
    category: "Fresh Juices",
    image: "/images/menu/jus-kiwi-orange.webp",
    description:
      "Un cocktail survitaminé combinant l'acidité du kiwi et la douceur de l'orange.",
  },
  {
    id: "71",
    name: "Jus Ananas",
    price: 600,
    category: "Fresh Juices",
    image: "/images/menu/jus-ananas.webp",
    description: "Pur jus d'ananas exotique, parfumé et pressé minute.",
  },
  {
    id: "72",
    name: "Cocktail",
    price: 600,
    category: "Fresh Juices",
    image: "/images/menu/cocktail-fruits.webp",
    description:
      "Un savant mélange de plusieurs fruits frais mixés ensemble pour une explosion gustative.",
  },
  // ── Milkshakes ────────────────────────────────────────────────────────────
  {
    id: "73",
    name: "Milkshake Banane",
    price: 600,
    category: "Milkshakes",
    image: "/images/menu/milkshake-banane.webp",
    description:
      "Lait, glace vanille et bananes fraîches mixées pour une texture mousseuse.",
  },
  {
    id: "74",
    name: "Milkshake Fraise",
    price: 600,
    category: "Milkshakes",
    image: "/images/menu/milkshake-fraise.webp",
    description:
      "Milkshake onctueux teinté de rouge, combinant fraises et crème glacée.",
  },
  {
    id: "75",
    name: "Milkshake Nutella-Banane",
    price: 600,
    category: "Milkshakes",
    image: "/images/menu/milkshake-nutella-banane.webp",
    description:
      "La rencontre magique de la banane et du Nutella sous forme de boisson frappée.",
  },
  {
    id: "76",
    name: "Milkshake Oreo",
    price: 650,
    category: "Milkshakes",
    image: "/images/menu/milkshake-oreo.webp",
    description:
      "Un milkshake gourmand broyé avec de vrais biscuits Oreo pour un effet texturé.",
  },
  {
    id: "77",
    name: "Milkshake Bueno",
    price: 550,
    category: "Milkshakes",
    image: "/images/menu/milkshake-bueno.webp",
    description:
      "Boisson lactée frappée aromatisée à la crème de noisette Kinder Bueno.",
  },

  {
    id: "80",
    name: "Milkshake Speculos",
    price: 600,
    category: "Milkshakes",
    image: "/images/menu/milkshake-speculos.webp",
    description:
      "Milkshake frappé mixé aux épices fines et miettes de Lotus Speculoos.",
  },
  // ── Hot Beverages ─────────────────────────────────────────────────────────
  {
    id: "81",
    name: "Café",
    price: 200,
    category: "Hot Beverages",
    image: "/images/menu/cafe.webp",
    description:
      "Café noir serré traditionnel aromatique, idéal pour accompagner le sucre.",
  },
  {
    id: "82",
    name: "Thé Infusion",
    price: 200,
    category: "Hot Beverages",
    image: "/images/menu/the-infusion.webp",
    description:
      "Sélection d'herbes et de sachets d'infusions chaudes et relaxantes.",
  },
  {
    id: "83",
    name: "Café au lait  Maison",
    price: 250,
    category: "Hot Beverages",
    image: "/images/menu/cafe.webp",
    description:
      "Notre thé traditionnel infusé aux feuilles de menthe fraîches de manière artisanale.",
  },
  {
    id: "84",
    name: "Cappuccino",
    price: 300,
    category: "Hot Beverages",
    image: "/images/menu/cappuccino.webp",
    description:
      "Expresso surmonté d'une couche généreuse de mousse de lait crémeuse et de cacao.",
  },
  {
    id: "85",
    name: "Lait Au Chocolat",
    price: 350,
    category: "Hot Beverages",
    image: "/images/menu/lait-chocolat.webp",
    description:
      "Lait chaud entier réconfortant mélangé à un cacao premium de qualité.",
  },
  // ── Bottled Drinks (hidden – kept for future use) ──────────────────────────

  // ── Supplements (hidden – converted to toppings) ───────────────────────────
  {
    id: "90",
    name: "Toppings Standard",
    price: 200,
    category: "Supplements",
    image: "/images/menu/toppings-standard.webp",
    description:
      "Personnalisez votre dessert avec notre assortiment de toppings gourmands de marque au choix (Chocolat crunch, biscuits, coulis).",
  },
  {
    id: "91",
    name: "Supplement Nutella",
    price: 200,
    category: "Supplements",
    image: "/images/menu/supplement-nutella.webp",
    description:
      "Une dose supplémentaire extra-généreuse de véritable pâte à tartiner Nutella pour les plus gourmands.",
  },
  {
    id: "92",
    name: "Supplement Fruits (Kiwi)",
    price: 200,
    category: "Supplements",
    image: "/images/menu/supplement-kiwi.webp",
    description:
      "Ajoutez une touche de fraîcheur acidulée à votre crêpe ou gaufre avec des tranches de kiwi frais supplémentaires.",
  },
  {
    id: "93",
    name: "Supplement Fruits (Banane)",
    price: 200,
    category: "Supplements",
    image: "/images/menu/supplement-banane.webp",
    description:
      "Des rondelles de bananes fraîches découpées minute à rajouter sur la base de votre dessert préféré.",
  },
  // ── Waffles ───────────────────────────────────────────────────────────────
  {
    id: "4",
    name: "Waffle Nutella",
    price: 550,
    category: "Waffles",
    image: "/images/menu/waffle-nutella.webp",
    description:
      "Gaufre classique, croustillante à l'extérieur et moelleuse à l'intérieur, généreusement nappée de Nutella.",
  },
  {
    id: "5",
    name: "Waffle Nutella Banane",
    price: 700,
    category: "Waffles",
    image: "/images/menu/waffle-nutella-banane.webp",
    description:
      "Gaufre dorée surmontée de rondelles de bananes fraîches et d'un coulis de Nutella.",
  },
  {
    id: "6",
    name: "Waffle Nutella Fraise",
    price: 650,
    category: "Waffles",
    image: "/images/menu/waffle-nutella-fraise.webp",
    description:
      "L'alliance parfaite des fraises fraîches acidulées et de la douceur du Nutella sur une gaufre chaude.",
  },
  {
    id: "7",
    name: "Waffle Nutella Kinder Bueno",
    price: 700,
    category: "Waffles",
    image: "/images/menu/waffle-nutella-kinder-bueno.webp",
    description:
      "Gaufre gourmande accompagnée de morceaux de Kinder Bueno croustillants et de Nutella.",
  },
  {
    id: "8",
    name: "Waffle Nutella Snickers",
    price: 700,
    category: "Waffles",
    image: "/images/menu/waffle-nutella-snickers.webp",
    description:
      "Gaufre intense avec morceaux de Snickers, éclats de cacahuètes croquantes et nappage chocolat.",
  },
  {
    id: "9",
    name: "Waffle Nutella Oreo",
    price: 700,
    category: "Waffles",
    image: "/images/menu/waffle-nutella-oreo.webp",
    description:
      "Pour les amoureux de biscuits : gaufre saupoudrée d'Oreo brisés et de sauce Nutella.",
  },
  {
    id: "10",
    name: "Waffle Nutella Lotus",
    price: 650,
    category: "Waffles",
    image: "/images/menu/waffle-nutella-lotus.webp",
    description:
      "Gaufre délicieuse parfumée au biscuit Speculoos Lotus croquant et Nutella.",
  },
];
