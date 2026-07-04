"use client";

import { ShoppingCart } from "lucide-react";

interface FloatingCartButtonProps {
  itemsCount: number;
  onClick: () => void;
}

export function FloatingCartButton({
  itemsCount,
  onClick,
}: FloatingCartButtonProps) {
  if (itemsCount === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 w-16 h-16 bg-accent text-primary rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 font-bold text-lg animate-pulse-subtle"
      aria-label={`Voir le panier avec ${itemsCount} articles`}
    >
      <ShoppingCart className="w-6 h-6" />
      {itemsCount > 0 && (
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-accent">
          {itemsCount}
        </span>
      )}
    </button>
  );
}
