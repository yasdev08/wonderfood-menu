"use client";

import { MenuItem } from "@/lib/menu";
import { FoodCard } from "./food-card";

interface MenuSectionProps {
  category: string;
  /** Customer-facing French label used as the section heading */
  label?: string;
  items: MenuItem[];
  onAddToCart: (item: MenuItem, quantity: number) => void;
  onZoom: (item: MenuItem) => void;
  /** When true, cards in this section open the toppings modal */
  customizable?: boolean;
  onCustomize?: (item: MenuItem, quantity: number) => void;
}

export function MenuSection({
  category,
  label,
  items,
  onAddToCart,
  onZoom,
  customizable = false,
  onCustomize,
}: MenuSectionProps) {
  const heading = (label ?? category).toUpperCase();

  return (
    <section className="mb-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 pb-4 border-b-2 border-accent/50">
        {heading}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {items.map((item) => (
          <FoodCard
            key={item.id}
            item={item}
            onAddToCart={onAddToCart}
            onZoom={onZoom}
            customizable={customizable}
            onCustomize={onCustomize}
          />
        ))}
      </div>
    </section>
  );
}
