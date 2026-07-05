"use client";

import { useState } from "react";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import Image from "next/image";
interface HeaderProps {
  onSearch: (term: string) => void;
  cartItemsCount: number;
  onCartClick: () => void;
}

export function Header({ onSearch, cartItemsCount, onCartClick }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchValue("");
    onSearch("");
  };

  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground border-b border-accent/20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image
            alt="Wonder food's logo"
            src="/logo1.svg"
            width={100}
            height={50}
            priority
          />
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Rechercher dans le menu..."
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 rounded-lg bg-primary-foreground/10 text-primary-foreground placeholder-primary-foreground/50 border border-primary-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/50 pointer-events-none" />
          </div>
        </div>

        {/* Cart Button */}
        <button
          onClick={onCartClick}
          className="relative p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
          aria-label="Panier"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
              {cartItemsCount}
            </span>
          )}
        </button>

        {/* Search Button - Mobile */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="md:hidden p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
          aria-label="Rechercher"
        >
          {isSearchOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Search className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Search */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher dans le menu..."
              value={searchValue}
              onChange={handleSearchChange}
              autoFocus
              className="w-full px-4 py-2 rounded-lg bg-primary-foreground/10 text-primary-foreground placeholder-primary-foreground/50 border border-primary-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/50 pointer-events-none" />
          </div>
        </div>
      )}
    </header>
  );
}
