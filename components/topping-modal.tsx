"use client";

import { createPortal } from "react-dom";
import { MenuItem, Topping } from "@/app/page";
import { X, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getImageSrc } from "./food-card";

interface ToppingModalProps {
  item: MenuItem;
  toppings: Topping[];
  initialQuantity?: number;
  onConfirm: (item: MenuItem, quantity: number, toppings: Topping[]) => void;
  onClose: () => void;
}

export function ToppingModal({
  item,
  toppings,
  initialQuantity = 1,
  onConfirm,
  onClose,
}: ToppingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState(initialQuantity);
  const imageSrc = getImageSrc(item);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted) return null;

  const selectedToppings = toppings.filter((t) => selectedIds.has(t.id));
  const toppingsTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const unitPrice = item.price + toppingsTotal;
  const totalPrice = unitPrice * quantity;

  const toggleTopping = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfirm = () => {
    onConfirm(item, quantity, selectedToppings);
    onClose();
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/80 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-card border border-border shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full cursor-pointer z-10 flex items-center justify-center transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Product image */}
        <div className="relative w-full aspect-[4/3] sm:aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-accent/10 flex-shrink-0 rounded-t-2xl sm:rounded-t-2xl">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, 448px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-6xl">🍰</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-5 sm:p-6">
          {/* Name + base price */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-bold text-foreground leading-tight">
              {item.name}
            </h2>
            <span className="flex-shrink-0 rounded-full bg-primary/15 px-3 py-1 text-sm font-bold text-accent">
              {item.price} DA
            </span>
          </div>

          {/* Section header */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-accent font-bold mb-3">
              Personnalisez votre dessert
            </p>
            <div className="border-t border-border" />
          </div>

          {/* Toppings */}
          <div className="space-y-2">
            {toppings.map((topping) => {
              const checked = selectedIds.has(topping.id);
              return (
                <label
                  key={topping.id}
                  className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-150 select-none ${
                    checked
                      ? "border-accent bg-accent/10"
                      : "border-border bg-muted/20 hover:bg-muted/40 hover:border-border/70"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Custom checkbox */}
                    <div
                      className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        checked
                          ? "bg-accent border-accent"
                          : "border-muted-foreground/40 bg-transparent"
                      }`}
                    >
                      {checked && (
                        <svg
                          className="w-3 h-3 text-accent-foreground"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground truncate">
                      {topping.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-accent whitespace-nowrap flex-shrink-0">
                    +{topping.price} DA
                  </span>
                  {/* Hidden native checkbox for accessibility */}
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleTopping(topping.id)}
                    aria-label={`${topping.name} +${topping.price} DA`}
                  />
                </label>
              );
            })}
          </div>

          {/* Quantity selector */}
          <div className="border-t border-border pt-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-3">
              Quantité
            </p>
            <div className="flex items-center rounded-xl bg-primary/15 border border-border/60 p-1 w-fit">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center text-accent hover:text-accent/80 disabled:opacity-30 disabled:pointer-events-none cursor-pointer rounded-lg hover:bg-accent/10 transition-colors"
                aria-label="Diminuer la quantité"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-base font-bold text-foreground">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-accent hover:text-accent/80 cursor-pointer rounded-lg hover:bg-accent/10 transition-colors"
                aria-label="Augmenter la quantité"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Total + CTA */}
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-foreground">
                  Total
                </span>
                {selectedToppings.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.price} DA
                    {selectedToppings.map((t) => (
                      <span key={t.id}> + {t.price} DA</span>
                    ))}
                    {quantity > 1 && <span> × {quantity}</span>}
                  </p>
                )}
              </div>
              <span className="text-2xl font-bold text-accent">
                {totalPrice} DA
              </span>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="w-full py-3.5 bg-accent text-accent-foreground font-bold rounded-xl hover:bg-accent/90 transition-all duration-200 active:scale-95 shadow-md cursor-pointer text-sm tracking-wide"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
