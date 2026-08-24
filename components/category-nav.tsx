"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryNavProps {
  categories: string[];
  activeCategory: string;
  onCategoryClick: (category: string) => void;
  /** Maps internal category keys to customer-facing French labels */
  categoryLabels?: Record<string, string>;
}

export function CategoryNav({
  categories,
  activeCategory,
  onCategoryClick,
  categoryLabels,
}: CategoryNavProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll();
    }

    return () => container?.removeEventListener("scroll", checkScroll);
  }, []);

  useEffect(() => {
    if (activeCategory && scrollContainerRef.current) {
      const activeButton = scrollContainerRef.current.querySelector(
        `[data-category="${activeCategory}"]`,
      ) as HTMLButtonElement;
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeCategory]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="sticky top-[102px] md:top-20 z-30 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gradient-to-r from-card to-transparent hover:from-card/80 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide py-4 px-8"
        >
          {categories.map((category) => {
            const label = categoryLabels?.[category] ?? category;
            return (
              <button
                key={category}
                data-category={category}
                onClick={() => onCategoryClick(category)}
                className={`relative flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap border cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                  category === activeCategory
                    ? "border-accent text-accent-foreground font-bold shadow-md"
                    : "bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/10 hover:border-accent/40"
                }`}
              >
                {category === activeCategory && (
                  <motion.span
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-accent rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gradient-to-l from-card to-transparent hover:from-card/80 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
