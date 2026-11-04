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
import {
  CATEGORY_LABELS,
  CUSTOMIZABLE_CATEGORIES,
  getCartItemId,
  MENU_ITEMS,
  TOPPINGS,
  VISIBLE_CATEGORIES,
  VISIBLE_CATEGORY_SET,
  type CartItem,
  type MenuItem,
  type Topping,
} from "@/lib/menu";

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
