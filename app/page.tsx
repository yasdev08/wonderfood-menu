"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { CategoryNav } from "@/components/category-nav";
import { MenuSection } from "@/components/menu-section";
import { CartDrawer } from "@/components/cart-drawer";
import { FloatingCartButton } from "@/components/floating-cart-button";
import { Footer } from "@/components/footer";
import { AnimatePresence } from "framer-motion";
import { ImageModal } from "@/components/image-modal";
import { ToppingModal } from "@/components/topping-modal";

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
] as const;

export type VisibleCategory = (typeof VISIBLE_CATEGORIES)[number];

const VISIBLE_CATEGORY_SET = new Set<string>(VISIBLE_CATEGORIES);

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
};

/** Only these 4 categories open the toppings customisation modal */
const CUSTOMIZABLE_CATEGORIES = new Set<string>([
  "Crepes",
  "Waffles",
  "Milkshakes",
  "Tiramisu",
]);

// ─── Toppings (converted from existing Supplement products) ───────────────────

export const TOPPINGS: Topping[] = [
  { id: "topping-standard", name: "Topping Standard", price: 150 },
  { id: "topping-nutella", name: "Nutella", price: 100 },
  { id: "topping-kiwi", name: "Kiwi", price: 200 },
  { id: "topping-banane", name: "Banane", price: 150 },
];

// ─── Menu Items ───────────────────────────────────────────────────────────────

const MENU_ITEMS: MenuItem[] = [
  // ── Specials ──────────────────────────────────────────────────────────────
  {
    id: "1",
    name: "Crepe Dubai",
    price: 500,
    category: "Specials",
    image: "/images/menu/crepe-dubai.png",
    description:
      "Une crêpe croustillante premium inspirée des saveurs de Dubaï, nappée de chocolat fin.",
  },
  {
    id: "2",
    name: "La Snickers",
    price: 250,
    category: "Specials",
    image: "/images/menu/la-snickers.png",
    description:
      "Une barre spéciale gourmande aux éclats de cacahuètes, caramel et chocolat façon Snickers.",
  },
  {
    id: "3",
    name: "Cake Dubai",
    price: 1000,
    category: "Specials",
    image: "/images/menu/cake-dubai.png",
    description:
      "Notre dessert signature : un gâteau riche et ultra-gourmand aux saveurs orientales modernes.",
  },
  // ── Tartes (hidden – kept for future use) ─────────────────────────────────
  {
    id: "11",
    name: "Tarte Fruits",
    price: 4500,
    category: "Tartes",
    image: "/images/menu/tarte-fruits.png",
    description:
      "Grande tarte à partager, garnie d'une crème légère et d'une sélection de fruits frais de saison.",
  },
  {
    id: "12",
    name: "Tarte Mixte",
    price: 5500,
    category: "Tartes",
    image: "/images/menu/tarte-mixte.png",
    description:
      "Tarte grand format combinant le croquant des fruits et la richesse des nappages chocolats.",
  },
  {
    id: "13",
    name: "Tarte Surprise Petite",
    price: 6500,
    category: "Tartes",
    image: "/images/menu/tarte-surprise-petite.png",
    description:
      "Une création surprise unique de notre chef pâtissier, format moyen.",
  },
  {
    id: "14",
    name: "Tarte Chocolat",
    price: 7000,
    category: "Tartes",
    image: "/images/menu/tarte-chocolat.png",
    description:
      "L'extase totale pour les chocoholiques : pâte sablée et ganache intense au chocolat.",
  },
  {
    id: "15",
    name: "Tarte Surprise Grande",
    price: 8000,
    category: "Tartes",
    image: "/images/menu/tarte-surprise-grande.png",
    description:
      "Notre plus grande tarte événementielle, une explosion de garnitures et de douceurs surprises.",
  },
  // ── Crepes ────────────────────────────────────────────────────────────────
  {
    id: "16",
    name: "Crepe Simple",
    price: 400,
    category: "Crepes",
    image: "/images/menu/crepe-simple.png",
    description:
      "Crêpe fine traditionnelle, légère et saupoudrée d'une touche sucrée.",
  },
  {
    id: "17",
    name: "Crepe La Banana",
    price: 500,
    category: "Crepes",
    image: "/images/menu/crepe-la-banana.png",
    description:
      "Crêpe roulée garnie de morceaux de bananes fondantes et de chocolat.",
  },
  {
    id: "18",
    name: "Crepe La Fraisy",
    price: 500,
    category: "Crepes",
    image: "/images/menu/crepe-la-fraisy.png",
    description: "Crêpe fraîcheur fourrée aux morceaux de fraises juteuses.",
  },
  {
    id: "19",
    name: "Crepe La Nuits",
    price: 600,
    category: "Crepes",
    image: "/images/menu/crepe-la-nuits.png",
    description:
      "Une recette mystérieuse et sombrement chocolatée pour les sessions tardives.",
  },
  {
    id: "20",
    name: "Crepe La Lotus",
    price: 600,
    category: "Crepes",
    image: "/images/menu/crepe-la-lotus.png",
    description:
      "Crêpe gourmande au goût inimitable de biscuit caramélisé Speculoos.",
  },
  {
    id: "21",
    name: "Crepe 4 Choco",
    price: 700,
    category: "Crepes",
    image: "/images/menu/crepe-4-choco.png",
    description:
      "Le summum de la gourmandise : un mélange équilibré de 4 types de chocolats fusionnés.",
  },
  {
    id: "22",
    name: "Crepe Fraisychio",
    price: 600,
    category: "Crepes",
    image: "/images/menu/crepe-fraisychio.png",
    description:
      "Un duo somptueux unissant la fraise fraîche et la crème de pistache.",
  },
  {
    id: "23",
    name: "Crepe Kiwi",
    price: 700,
    category: "Crepes",
    image: "/images/menu/crepe-kiwi.png",
    description:
      "Une touche acidulée originale avec des tranches fines de kiwi frais.",
  },
  {
    id: "24",
    name: "Crepe La Spéciale",
    price: 700,
    category: "Crepes",
    image: "/images/menu/crepe-la-speciale.png",
    description:
      "La crêpe composée selon les secrets de la maison Wonder Food's.",
  },
  {
    id: "25",
    name: "Crepe La Fruita",
    price: 600,
    category: "Crepes",
    image: "/images/menu/crepe-la-fruita.png",
    description:
      "Un cocktail de fruits coupés glissé dans une pâte de crêpe fine et légère.",
  },
  {
    id: "26",
    name: "Crepe Banachio",
    price: 600,
    category: "Crepes",
    image: "/images/menu/crepe-banachio.png",
    description:
      "Mariage onctueux entre la douceur de la banane et l'arôme de la pistache.",
  },
  {
    id: "27",
    name: "Crepe 4 Fruits",
    price: 700,
    category: "Crepes",
    image: "/images/menu/crepe-4-fruits.png",
    description:
      "Quatre fruits de saison minutieusement coupés pour un maximum de vitamines.",
  },
  {
    id: "29",
    name: "Crepe Pistachio",
    price: 500,
    category: "Crepes",
    image: "/images/menu/crepe-pistachio.png",
    description:
      "Nappée d'une crème de pistache onctueuse 100% pure et savoureuse.",
  },
  {
    id: "31",
    name: "Crepe Ananas",
    price: 650,
    category: "Crepes",
    image: "/images/menu/crepe-ananas.png",
    description:
      "Une touche exotique rafraîchissante à base de dés d'ananas juteux.",
  },
  {
    id: "33",
    name: "Crepe Nutella Maxi",
    price: 550,
    category: "Crepes",
    image: "/images/menu/crepe-nutella-maxi.png",
    description:
      "Format géant chargé au Nutella pour combler les très grosses faims.",
  },
  {
    id: "34",
    name: "Crepe Bueno",
    price: 600,
    category: "Crepes",
    image: "/images/menu/crepe-bueno.png",
    description:
      "Fourrée au chocolat fondu et brisures de barres Kinder Bueno.",
  },
  {
    id: "35",
    name: "Crepe 100% Pistaches",
    price: 600,
    category: "Crepes",
    image: "/images/menu/crepe-100-pistaches.png",
    description:
      "Une expérience premium saturée en éclats et crème de pistaches sélectionnées.",
  },
  {
    id: "36",
    name: "Crepe Mixte",
    price: 600,
    category: "Crepes",
    image: "/images/menu/crepe-mixte.png",
    description:
      "Le compromis parfait combinant plusieurs garnitures au choix sur la même pâte.",
  },
  {
    id: "37",
    name: "Crepe Wonder",
    price: 1200,
    category: "Crepes",
    image: "/images/menu/crepe-wonder.png",
    description:
      "Le chef-d'œuvre suprême de l'établissement : énorme, ultra-garnie et spectaculaire.",
  },
  // ── Boxes (hidden – kept for future use) ──────────────────────────────────
  {
    id: "38",
    name: "Box Fruita",
    price: 1100,
    category: "Boxes",
    image: "/images/menu/box-fruita.png",
    description:
      "Un assortiment convivial de bouchées sucrées et morceaux de fruits à emporter.",
  },
  {
    id: "39",
    name: "Box Choco",
    price: 1300,
    category: "Boxes",
    image: "/images/menu/box-choco.png",
    description:
      "Le coffret de partage ultime rempli de douceurs et de textures chocolatées.",
  },
  {
    id: "40",
    name: "Box Wonder Food's",
    price: 1600,
    category: "Boxes",
    image: "/images/menu/box-wonder.png",
    description:
      "Notre box signature premium regroupant un mix des meilleurs desserts de la maison.",
  },
  // ── Desserts (hidden – kept for future use) ────────────────────────────────
  {
    id: "41",
    name: "Cheesecake",
    price: 500,
    category: "Desserts",
    image: "/images/menu/cheesecake.png",
    description:
      "Gâteau au fromage blanc onctueux sur sa base croustillante de biscuits émiettés.",
  },
  {
    id: "42",
    name: "Saint-Sébastien",
    price: 600,
    category: "Desserts",
    image: "/images/menu/saint-sebastien.png",
    description:
      "Le célèbre gâteau au fromage brûlé espagnol, au cœur incroyablement coulant.",
  },
  {
    id: "43",
    name: "Fondant-Glaces",
    price: 600,
    category: "Desserts",
    image: "/images/menu/fondant-glaces.png",
    description:
      "Gâteau moelleux au cœur de chocolat chaud coulant, servi avec sa boule de glace vanille.",
  },
  // ── Savory (hidden – kept for future use) ─────────────────────────────────
  {
    id: "44",
    name: "Fajitas",
    price: 350,
    category: "Savory",
    image: "/images/menu/fajitas.png",
    description:
      "La seule pause salée : une tortilla garnie de poulet grillé assaisonné, poivrons et fromage fondant.",
  },
  // ── Sundaes ───────────────────────────────────────────────────────────────
  {
    id: "45",
    name: "Sundae Ferrero",
    price: 400,
    category: "Sundaes",
    image: "/images/menu/sundae-ferrero.png",
    description:
      "Glace onctueuse tourbillonnée de morceaux de Ferrero Rocher et sauce noisette.",
  },
  {
    id: "46",
    name: "Sundae Chocolat",
    price: 400,
    category: "Sundaes",
    image: "/images/menu/sundae-chocolat.png",
    description:
      "Crème glacée soft servie avec un nappage traditionnel au chocolat riche.",
  },
  {
    id: "47",
    name: "Sundae Kinder",
    price: 400,
    category: "Sundaes",
    image: "/images/menu/sundae-kinder.png",
    description:
      "Glace vanille nappée et parsemée de morceaux de chocolat Kinder.",
  },
  {
    id: "48",
    name: "Sundae Caramel Beurre Salé",
    price: 400,
    category: "Sundaes",
    image: "/images/menu/sundae-caramel.png",
    description:
      "Le juste équilibre entre le sucre de la glace et l'intensité du caramel au beurre salé.",
  },
  {
    id: "49",
    name: "Sundae Pistache",
    price: 400,
    category: "Sundaes",
    image: "/images/menu/sundae-pistache.png",
    description:
      "Rafraîchissement glacé surmonté d'une sauce crémeuse à la pistache.",
  },
  {
    id: "50",
    name: "Sundae Snickers",
    price: 400,
    category: "Sundaes",
    image: "/images/menu/sundae-snickers.png",
    description:
      "Une coupe glacée gourmande mariant caramel, cacahuètes et chocolat croquant.",
  },
  {
    id: "51",
    name: "Sundae Raffaello",
    price: 400,
    category: "Sundaes",
    image: "/images/menu/sundae-raffaello.png",
    description:
      "Glace douce parsemée de noix de coco râpée et brisures de Raffaello blanches.",
  },
  // ── Tiramisu ──────────────────────────────────────────────────────────────
  {
    id: "52",
    name: "Tiramisu Nutella",
    price: 400,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-nutella.png",
    description:
      "Dessert italien revisité avec des couches de crème mascarpone et de Nutella.",
  },
  {
    id: "53",
    name: "Tiramisu KitKat",
    price: 400,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-kitkat.png",
    description:
      "Tiramisu onctueux intégrant des morceaux croustillants de gaufrettes KitKat.",
  },
  {
    id: "54",
    name: "Tiramisu Pistache",
    price: 400,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-pistache.png",
    description:
      "Une douceur aérienne subtilement parfumée à la crème de pistache verte.",
  },
  {
    id: "55",
    name: "Tiramisu Bueno",
    price: 400,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-bueno.png",
    description:
      "Crème de mascarpone fondante mariée aux éclats de Kinder Bueno.",
  },
  {
    id: "56",
    name: "Tiramisu Mars/Caramel",
    price: 400,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-mars.png",
    description:
      "Un profil sucré lourd combinant caramel fondant et crème onctueuse.",
  },
  {
    id: "57",
    name: "Tiramisu Oreo",
    price: 400,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-oreo.png",
    description:
      "Des biscuits Oreo moulus alternés avec notre mousse mascarpone signature.",
  },
  {
    id: "58",
    name: "Tiramisu Raffaello",
    price: 400,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-raffaello.png",
    description:
      "Fraîcheur exotique combinant crème légère, amande et éclats de noix de coco.",
  },
  {
    id: "59",
    name: "Tiramisu Fruits Rouges",
    price: 400,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-fruits-rouges.png",
    description:
      "Une version acidulée et fruitée balancée par la douceur de la crème.",
  },
  {
    id: "60",
    name: "Tiramisu Snickers",
    price: 400,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-snickers.png",
    description:
      "Le croquant de la cacahuète s'invite dans la légèreté du tiramisu.",
  },
  {
    id: "61",
    name: "Tiramisu Crunch",
    price: 400,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-crunch.png",
    description:
      "Une texture surprenante grâce au chocolat au riz soufflé Crunch brisé.",
  },
  {
    id: "62",
    name: "Tiramisu Lotus",
    price: 400,
    category: "Tiramisu",
    image: "/images/menu/tiramisu-lotus.png",
    description:
      "Un grand classique moderne parfumé à la cannelle et au biscuit Speculoos.",
  },
  // ── Fresh Juices ──────────────────────────────────────────────────────────
  {
    id: "63",
    name: "Jus Orange",
    price: 400,
    category: "Fresh Juices",
    image: "/images/menu/jus-orange.png",
    description:
      "Oranges fraîches pressées à la minute, sans sucre ajouté, pur jus.",
  },
  {
    id: "64",
    name: "Jus Citron",
    price: 400,
    category: "Fresh Juices",
    image: "/images/menu/jus-citron.png",
    description:
      "Une citronnade maison rafraîchissante, pressée à vif et ultra-désaltérante.",
  },
  {
    id: "65",
    name: "Jus Banane",
    price: 500,
    category: "Fresh Juices",
    image: "/images/menu/jus-banane.png",
    description:
      "Jus de banane épais, mixé pour obtenir une consistance douce et rassasiante.",
  },
  {
    id: "66",
    name: "Jus Fraise",
    price: 450,
    category: "Fresh Juices",
    image: "/images/menu/jus-fraise.png",
    description: "Un délice printanier à base de fraises fraîches mixées.",
  },
  {
    id: "67",
    name: "Jus Pastèque",
    price: 450,
    category: "Fresh Juices",
    image: "/images/menu/jus-pasteque.png",
    description:
      "L'incontournable de l'été : jus de pastèque frais, hydratant et sucré.",
  },
  {
    id: "68",
    name: "Mojito",
    price: 300,
    category: "Fresh Juices",
    image: "/images/menu/mojito.png",
    description:
      "Cocktail rafraîchissant sans alcool combinant menthe fraîche, citron vert et eau gazeuse.",
  },
  {
    id: "69",
    name: "Grenadine",
    price: 400,
    category: "Fresh Juices",
    image: "/images/menu/grenadine.png",
    description:
      "Boisson douce aux sirops fruités rouges, parfaite pour une touche sucrée.",
  },
  {
    id: "70",
    name: "Jus Kiwi Orange",
    price: 600,
    category: "Fresh Juices",
    image: "/images/menu/jus-kiwi-orange.png",
    description:
      "Un cocktail survitaminé combinant l'acidité du kiwi et la douceur de l'orange.",
  },
  {
    id: "71",
    name: "Jus Ananas",
    price: 500,
    category: "Fresh Juices",
    image: "/images/menu/jus-ananas.png",
    description: "Pur jus d'ananas exotique, parfumé et pressé minute.",
  },
  {
    id: "72",
    name: "Cocktail",
    price: 400,
    category: "Fresh Juices",
    image: "/images/menu/cocktail-fruits.png",
    description:
      "Un savant mélange de plusieurs fruits frais mixés ensemble pour une explosion gustative.",
  },
  // ── Milkshakes ────────────────────────────────────────────────────────────
  {
    id: "73",
    name: "Milkshake Banane",
    price: 500,
    category: "Milkshakes",
    image: "/images/menu/milkshake-banane.png",
    description:
      "Lait, glace vanille et bananes fraîches mixées pour une texture mousseuse.",
  },
  {
    id: "74",
    name: "Milkshake Fraise",
    price: 500,
    category: "Milkshakes",
    image: "/images/menu/milkshake-fraise.png",
    description:
      "Milkshake onctueux teinté de rouge, combinant fraises et crème glacée.",
  },
  {
    id: "75",
    name: "Milkshake Nutella-Banane",
    price: 600,
    category: "Milkshakes",
    image: "/images/menu/milkshake-nutella-banane.png",
    description:
      "La rencontre magique de la banane et du Nutella sous forme de boisson frappée.",
  },
  {
    id: "76",
    name: "Milkshake Oreo",
    price: 600,
    category: "Milkshakes",
    image: "/images/menu/milkshake-oreo.png",
    description:
      "Un milkshake gourmand broyé avec de vrais biscuits Oreo pour un effet texturé.",
  },
  {
    id: "77",
    name: "Milkshake Bueno",
    price: 600,
    category: "Milkshakes",
    image: "/images/menu/milkshake-bueno.png",
    description:
      "Boisson lactée frappée aromatisée à la crème de noisette Kinder Bueno.",
  },
  {
    id: "78",
    name: "Milkshake Raffaello",
    price: 600,
    category: "Milkshakes",
    image: "/images/menu/milkshake-raffaello.png",
    description:
      "Douceur blanche au lait de coco, glace vanille et éclats de Raffaello.",
  },
  {
    id: "79",
    name: "Milkshake Ferrero",
    price: 600,
    category: "Milkshakes",
    image: "/images/menu/milkshake-ferrero.png",
    description:
      "Un shake premium ultra-chocolaté au bon goût de praliné Ferrero Rocher.",
  },
  {
    id: "80",
    name: "Milkshake Speculos",
    price: 600,
    category: "Milkshakes",
    image: "/images/menu/milkshake-speculos.png",
    description:
      "Milkshake frappé mixé aux épices fines et miettes de Lotus Speculoos.",
  },
  // ── Hot Beverages ─────────────────────────────────────────────────────────
  {
    id: "81",
    name: "Café",
    price: 200,
    category: "Hot Beverages",
    image: "/images/menu/cafe.png",
    description:
      "Café noir serré traditionnel aromatique, idéal pour accompagner le sucre.",
  },
  {
    id: "82",
    name: "Thé Infusion",
    price: 200,
    category: "Hot Beverages",
    image: "/images/menu/the-infusion.png",
    description:
      "Sélection d'herbes et de sachets d'infusions chaudes et relaxantes.",
  },
  {
    id: "83",
    name: "Thé Maison",
    price: 150,
    category: "Hot Beverages",
    image: "/images/menu/the-maison.png",
    description:
      "Notre thé traditionnel infusé aux feuilles de menthe fraîches de manière artisanale.",
  },
  {
    id: "84",
    name: "Cappuccino",
    price: 300,
    category: "Hot Beverages",
    image: "/images/menu/cappuccino.png",
    description:
      "Expresso surmonté d'une couche généreuse de mousse de lait crémeuse et de cacao.",
  },
  {
    id: "85",
    name: "Lait Au Chocolat",
    price: 400,
    category: "Hot Beverages",
    image: "/images/menu/lait-chocolat.png",
    description:
      "Lait chaud entier réconfortant mélangé à un cacao premium de qualité.",
  },
  // ── Bottled Drinks (hidden – kept for future use) ──────────────────────────
  {
    id: "86",
    name: "Eau Minérale (Ifri)",
    price: 50,
    category: "Bottled Drinks",
    image: "/images/menu/eau-ifri.png",
    description: "Bouteille d'eau minérale naturelle locale Ifri de 50cl.",
  },
  {
    id: "87",
    name: "Azro Energy",
    price: 600,
    category: "Bottled Drinks",
    image: "/images/menu/azro.png",
    description:
      "Boisson énergisante locale Azro pour un coup de boost immédiat.",
  },
  {
    id: "88",
    name: "Oasis / Red Bull",
    price: 500,
    category: "Bottled Drinks",
    image: "/images/menu/oasis-redbull.png",
    description:
      "Sélection au choix entre boisson fruitée Oasis ou canette Red Bull classique.",
  },
  {
    id: "89",
    name: "Soda Can (Coca/Pepsi/Selecto)",
    price: 150,
    category: "Bottled Drinks",
    image: "/images/menu/soda-can.png",
    description:
      "Canette de boisson gazeuse fraîche au choix (Coca-Cola, Pepsi ou Selecto).",
  },
  // ── Supplements (hidden – converted to toppings) ───────────────────────────
  {
    id: "90",
    name: "Toppings Standard",
    price: 150,
    category: "Supplements",
    image: "/images/menu/toppings-standard.png",
    description:
      "Personnalisez votre dessert avec notre assortiment de toppings gourmands de marque au choix (Chocolat crunch, biscuits, coulis).",
  },
  {
    id: "91",
    name: "Supplement Nutella",
    price: 100,
    category: "Supplements",
    image: "/images/menu/supplement-nutella.png",
    description:
      "Une dose supplémentaire extra-généreuse de véritable pâte à tartiner Nutella pour les plus gourmands.",
  },
  {
    id: "92",
    name: "Supplement Fruits (Kiwi)",
    price: 200,
    category: "Supplements",
    image: "/images/menu/supplement-kiwi.png",
    description:
      "Ajoutez une touche de fraîcheur acidulée à votre crêpe ou gaufre avec des tranches de kiwi frais supplémentaires.",
  },
  {
    id: "93",
    name: "Supplement Fruits (Banane)",
    price: 150,
    category: "Supplements",
    image: "/images/menu/supplement-banane.png",
    description:
      "Des rondelles de bananes fraîches découpées minute à rajouter sur la base de votre dessert préféré.",
  },
  // ── Waffles ───────────────────────────────────────────────────────────────
  {
    id: "4",
    name: "Waffle Nutella",
    price: 400,
    category: "Waffles",
    image: "/images/menu/waffle-nutella.png",
    description:
      "Gaufre classique, croustillante à l'extérieur et moelleuse à l'intérieur, généreusement nappée de Nutella.",
  },
  {
    id: "5",
    name: "Waffle Nutella Banane",
    price: 500,
    category: "Waffles",
    image: "/images/menu/waffle-nutella-banane.png",
    description:
      "Gaufre dorée surmontée de rondelles de bananes fraîches et d'un coulis de Nutella.",
  },
  {
    id: "6",
    name: "Waffle Nutella Fraise",
    price: 500,
    category: "Waffles",
    image: "/images/menu/waffle-nutella-fraise.png",
    description:
      "L'alliance parfaite des fraises fraîches acidulées et de la douceur du Nutella sur une gaufre chaude.",
  },
  {
    id: "7",
    name: "Waffle Nutella Kinder Bueno",
    price: 600,
    category: "Waffles",
    image: "/images/menu/waffle-nutella-kinder-bueno.png",
    description:
      "Gaufre gourmande accompagnée de morceaux de Kinder Bueno croustillants et de Nutella.",
  },
  {
    id: "8",
    name: "Waffle Nutella Snickers",
    price: 500,
    category: "Waffles",
    image: "/images/menu/waffle-nutella-snickers.png",
    description:
      "Gaufre intense avec morceaux de Snickers, éclats de cacahuètes croquantes et nappage chocolat.",
  },
  {
    id: "9",
    name: "Waffle Nutella Oreo",
    price: 500,
    category: "Waffles",
    image: "/images/menu/waffle-nutella-oreo.png",
    description:
      "Pour les amoureux de biscuits : gaufre saupoudrée d'Oreo brisés et de sauce Nutella.",
  },
  {
    id: "10",
    name: "Waffle Nutella Lotus",
    price: 500,
    category: "Waffles",
    image: "/images/menu/waffle-nutella-lotus.png",
    description:
      "Gaufre délicieuse parfumée au biscuit Speculoos Lotus croquant et Nutella.",
  },
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [customizingItem, setCustomizingItem] = useState<{
    item: MenuItem;
    quantity: number;
  } | null>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Only items from the 8 visible categories; respects search term
  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return MENU_ITEMS.filter((item) => {
      if (!VISIBLE_CATEGORY_SET.has(item.category)) return false;
      if (!term) return true;
      return (
        item.name.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        CATEGORY_LABELS[item.category]?.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );
    });
  }, [searchTerm]);

  // Grouped in VISIBLE_CATEGORIES order (not insertion order of MENU_ITEMS)
  const groupedByCategory = useMemo(() => {
    return VISIBLE_CATEGORIES.reduce(
      (acc, category) => {
        const items = filteredItems.filter(
          (item) => item.category === category,
        );
        if (items.length > 0) {
          acc[category] = items;
        }
        return acc;
      },
      {} as Record<string, MenuItem[]>,
    );
  }, [filteredItems]);

  // Ordered list of categories that currently have visible items
  const categories = useMemo(
    () => VISIBLE_CATEGORIES.filter((cat) => cat in groupedByCategory),
    [groupedByCategory],
  );

  // ── Cart handlers ──────────────────────────────────────────────────────────

  const handleAddToCart = useCallback(
    (item: MenuItem, quantity: number = 1, toppings: Topping[] = []) => {
      setCart((prev) => {
        const cartItemId = getCartItemId(item.id, toppings);
        const existing = prev.find((ci) => ci.id === cartItemId);
        if (existing) {
          return prev.map((ci) =>
            ci.id === cartItemId
              ? { ...ci, quantity: ci.quantity + quantity }
              : ci,
          );
        }
        return [...prev, { id: cartItemId, item, quantity, toppings }];
      });
    },
    [],
  );

  const handleIncrement = useCallback((cartItemId: string) => {
    setCart((prev) =>
      prev.map((ci) =>
        ci.id === cartItemId ? { ...ci, quantity: ci.quantity + 1 } : ci,
      ),
    );
  }, []);

  const handleDecrement = useCallback((cartItemId: string) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.id === cartItemId);
      if (existing && existing.quantity > 1) {
        return prev.map((ci) =>
          ci.id === cartItemId ? { ...ci, quantity: ci.quantity - 1 } : ci,
        );
      }
      return prev.filter((ci) => ci.id !== cartItemId);
    });
  }, []);

  const handleRemove = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.id !== cartItemId));
  }, []);

  const handleClearCart = useCallback(() => {
    setCart([]);
    setIsCartOpen(false);
  }, []);

  // ── UI handlers ────────────────────────────────────────────────────────────

  const handleCartClick = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const handleCloseCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const scrollToCategory = useCallback((category: string) => {
    const element = categoryRefs.current[category];
    if (element) {
      const yOffset = -140;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  const handleZoom = useCallback((item: MenuItem) => {
    setSelectedItem(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedItem(null);
  }, []);

  // ── Topping modal handlers ─────────────────────────────────────────────────

  const handleOpenCustomize = useCallback(
    (item: MenuItem, quantity: number) => {
      setCustomizingItem({ item, quantity });
    },
    [],
  );

  const handleConfirmCustomize = useCallback(
    (item: MenuItem, quantity: number, toppings: Topping[]) => {
      handleAddToCart(item, quantity, toppings);
    },
    [handleAddToCart],
  );

  const handleCloseCustomize = useCallback(() => {
    setCustomizingItem(null);
  }, []);

  // ── Intersection observer for active category highlight ────────────────────

  const cartItemsCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );
    const observedElements: HTMLDivElement[] = [];

    Object.entries(categoryRefs.current).forEach(([, el]) => {
      if (el) {
        observer.observe(el);
        observedElements.push(el);
      }
    });

    return () => {
      observedElements.forEach((el) => observer.unobserve(el));
    };
  }, [groupedByCategory]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-background">
      <Header
        onSearch={setSearchTerm}
        cartItemsCount={cartItemsCount}
        onCartClick={handleCartClick}
      />

      {!searchTerm && <Hero />}

      {!searchTerm && (
        <CategoryNav
          categories={categories}
          categoryLabels={CATEGORY_LABELS}
          activeCategory={activeCategory}
          onCategoryClick={scrollToCategory}
        />
      )}

      <div id="menu" className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        {categories.map((category) => {
          const items = groupedByCategory[category];
          if (!items) return null;
          return (
            <div
              key={category}
              id={category}
              ref={(el) => {
                if (el) categoryRefs.current[category] = el;
              }}
              className="mb-16 scroll-mt-36"
            >
              <MenuSection
                category={category}
                label={CATEGORY_LABELS[category]}
                items={items}
                customizable={CUSTOMIZABLE_CATEGORIES.has(category)}
                onAddToCart={handleAddToCart}
                onCustomize={handleOpenCustomize}
                onZoom={handleZoom}
              />
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Aucun élément ne correspond à votre recherche.
            </p>
          </div>
        )}
      </div>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        items={cart}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onRemove={handleRemove}
        onClear={handleClearCart}
      />

      <FloatingCartButton
        itemsCount={cartItemsCount}
        onClick={handleCartClick}
      />

      <AnimatePresence>
        {selectedItem && (
          <ImageModal item={selectedItem} onClose={handleCloseModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {customizingItem && (
          <ToppingModal
            item={customizingItem.item}
            toppings={TOPPINGS}
            initialQuantity={customizingItem.quantity}
            onConfirm={handleConfirmCustomize}
            onClose={handleCloseCustomize}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
