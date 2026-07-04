"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MenuItem } from "@/app/page";
import { Plus, Maximize2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FoodCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  Specials:
    "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=80",
  Waffles:
    "https://images.unsplash.com/photo-1558584719-6f1f4d7f29c7?auto=format&fit=crop&w=900&q=80",
  Tartes:
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
  Crepes:
    "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=900&q=80",
  Boxes:
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80",
  Desserts:
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80",
  Savory:
    "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=900&q=80",
  Sundaes:
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
  Tiramisu:
    "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80",
  "Fresh Juices":
    "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=900&q=80",
  Milkshakes:
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80",
  "Hot Beverages":
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  "Bottled Drinks":
    "https://images.unsplash.com/photo-1523371210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80",
  Supplements:
    "https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=900&q=80",
};

const STOCK_IMAGES: Record<string, string> = {
  crepe: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=600&q=80",
  waffle: "https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&w=600&q=80",
  tarte: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=600&q=80",
  cake: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
  box: "https://images.unsplash.com/photo-1608220179550-e6ac90433f98?auto=format&fit=crop&w=600&q=80",
  cheesecake: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
  sebastien: "https://images.unsplash.com/photo-1624308165763-8fc7433468d9?auto=format&fit=crop&w=600&q=80",
  fondant: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
  fajitas: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80",
  sundae: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
  tiramisu: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
  mojito: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
  jus: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80",
  milkshake: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
  cafe: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80",
  cappuccino: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80",
  the: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
  soda: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
  toppings: "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=600&q=80",
  snickers: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80",
  nutella: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
};

function getImageSrc(item: MenuItem) {
  const nameLower = item.name.toLowerCase();
  const catLower = item.category.toLowerCase();
  
  if (nameLower.includes("sebastien") || nameLower.includes("sébastien")) return STOCK_IMAGES.sebastien;
  if (nameLower.includes("fondant")) return STOCK_IMAGES.fondant;
  if (nameLower.includes("cheesecake")) return STOCK_IMAGES.cheesecake;
  if (nameLower.includes("fajita")) return STOCK_IMAGES.fajitas;
  if (nameLower.includes("mojito")) return STOCK_IMAGES.mojito;
  if (nameLower.includes("cappuccino")) return STOCK_IMAGES.cappuccino;
  
  if (nameLower.includes("nutella")) return STOCK_IMAGES.nutella;
  if (nameLower.includes("snickers")) return STOCK_IMAGES.snickers;
  if (nameLower.includes("lotus") || nameLower.includes("speculo")) return STOCK_IMAGES.lotus;
  
  if (catLower.includes("crepe") || catLower.includes("crêpe")) return STOCK_IMAGES.crepe;
  if (catLower.includes("waffle")) return STOCK_IMAGES.waffle;
  if (catLower.includes("tarte")) return STOCK_IMAGES.tarte;
  if (catLower.includes("box")) return STOCK_IMAGES.box;
  if (catLower.includes("sundae")) return STOCK_IMAGES.sundae;
  if (catLower.includes("tiramisu")) return STOCK_IMAGES.tiramisu;
  if (catLower.includes("juice") || nameLower.includes("jus")) return STOCK_IMAGES.jus;
  if (catLower.includes("milkshake")) return STOCK_IMAGES.milkshake;
  if (nameLower.includes("cafe") || nameLower.includes("café")) return STOCK_IMAGES.cafe;
  if (nameLower.includes("the") || nameLower.includes("thé")) return STOCK_IMAGES.the;
  if (nameLower.includes("soda") || nameLower.includes("coca") || nameLower.includes("pepsi") || nameLower.includes("energy") || nameLower.includes("red bull") || catLower.includes("bottle")) return STOCK_IMAGES.soda;
  if (catLower.includes("supplement") || catLower.includes("topping") || nameLower.includes("supplément")) return STOCK_IMAGES.toppings;

  // Fallbacks
  return CATEGORY_IMAGE_MAP[item.category] ?? CATEGORY_IMAGE_MAP.Desserts;
}

export function FoodCard({ item, onAddToCart }: FoodCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const imageSrc = getImageSrc(item);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    setQuantity(1);
  };

  useEffect(() => {
    if (isZoomOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isZoomOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      whileHover={{ y: -5, borderColor: "#F4BB16" }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative aspect-[4/3] xs:aspect-square overflow-hidden bg-gradient-to-br from-primary/20 to-accent/10">
        {imageSrc && !imageError ? (
          <>
            <img
              src={imageSrc}
              alt={item.name}
              loading="lazy"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Zoom Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomOpen(true);
              }}
              className="absolute top-2 right-2 z-10 p-2 bg-black/60 hover:bg-black/85 text-accent rounded-full cursor-pointer flex items-center justify-center shadow-md"
              aria-label="Agrandir l'image"
            >
              <Maximize2 className="h-4.5 w-4.5" />
            </motion.button>
          </>
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center">
            <div>
              <div className="mb-2 text-4xl">🍰</div>
              <p className="text-xs text-muted-foreground">{item.category}</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="mb-2 flex flex-col justify-between gap-1 xs:flex-row xs:items-start xs:gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-accent sm:text-lg truncate xs:whitespace-normal">
              {item.name}
            </h3>
            <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground sm:text-xs sm:tracking-[0.2em]">
              {item.category}
            </p>
          </div>
          <span className="self-start rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-accent sm:px-3 sm:py-1 sm:text-sm whitespace-nowrap">
            {item.price} DA
          </span>
        </div>

        {item.description && (
          <p className="mb-3 text-xs text-muted-foreground line-clamp-2 sm:mb-4 sm:text-sm sm:line-clamp-3">
            {item.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-1 sm:gap-2 pt-2">
          {/* Quantity Selector */}
          <div className="flex items-center rounded-lg bg-primary/15 border border-border/40 p-0.5 sm:p-1">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="px-1.5 sm:px-2 py-0.5 text-accent hover:text-accent/80 disabled:opacity-30 disabled:pointer-events-none font-bold text-xs sm:text-sm cursor-pointer"
            >
              -
            </button>
            <span className="px-1 sm:px-1.5 text-[10px] sm:text-xs font-semibold text-foreground min-w-[14px] sm:min-w-[18px] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(prev => prev + 1)}
              className="px-1.5 sm:px-2 py-0.5 text-accent hover:text-accent/80 font-bold text-xs sm:text-sm cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Add to Cart button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold cursor-pointer shadow-sm ${
              isAdded
                ? "bg-accent text-primary"
                : "bg-primary/20 text-accent hover:bg-primary/30"
            }`}
            aria-label={`Ajouter ${item.name} au panier`}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Ajouter</span>
          </motion.button>
        </div>

        {isAdded && (
          <p className="mt-2 text-center text-[10px] font-semibold text-accent sm:text-xs">
            Ajouté au panier !
          </p>
        )}
      </div>

      {/* Lightbox Zoom Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {isZoomOpen && imageSrc && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
              onClick={() => setIsZoomOpen(false)}
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsZoomOpen(false)}
                className="absolute top-4 right-4 p-3 bg-white/10 text-white rounded-full cursor-pointer flex items-center justify-center"
                aria-label="Fermer la vue agrandie"
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Modal box */}
              <motion.div 
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative max-h-[85vh] max-w-[95vw] overflow-hidden rounded-xl bg-card border border-border shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="overflow-hidden flex items-center justify-center bg-black/20 flex-1">
                  <img
                    src={imageSrc}
                    alt={item.name}
                    className="max-h-[70vh] max-w-full object-contain"
                  />
                </div>
                <div className="p-4 bg-card text-foreground border-t border-border">
                  <h3 className="text-lg font-bold text-accent">{item.name}</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{item.category} • {item.price} DA</p>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}
