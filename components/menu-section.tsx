"use client";

import { MenuItem } from "@/app/page";
import { FoodCard } from "./food-card";

interface MenuSectionProps {
  category: string;
  items: MenuItem[];
  onAddToCart: (item: MenuItem, quantity: number) => void;
  onZoom: (item: MenuItem) => void;
}

export function MenuSection({
  category,
  items,
  onAddToCart,
  onZoom,
}: MenuSectionProps) {
  return (
    <section className="mb-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 pb-4 border-b-2 border-accent/50">
        {category}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {items.map((item) => (
          <FoodCard
            key={item.id}
            item={item}
            onAddToCart={onAddToCart}
            onZoom={onZoom}
          />
        ))}
      </div>
    </section>
  );
}
