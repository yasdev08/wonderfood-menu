"use client";

import { createPortal } from "react-dom";
import { MenuItem } from "@/app/page";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getImageSrc } from "./food-card";

interface ImageModalProps {
  item: MenuItem;
  onClose: () => void;
}

export function ImageModal({ item, onClose }: ImageModalProps) {
  const [mounted, setMounted] = useState(false);
  const imageSrc = getImageSrc(item);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="absolute top-4 right-4 p-3 bg-white/10 text-white rounded-full cursor-pointer flex items-center justify-center z-[110]"
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
        className="relative max-h-[85vh] max-w-[95vw] w-full sm:max-w-2xl overflow-hidden rounded-xl bg-card border border-border shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden relative bg-black/20 flex-1 w-full h-[40vh] sm:h-[50vh]">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 95vw, 672px"
              priority
              decoding="async"
              className="object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center">
              <div>
                <div className="mb-2 text-6xl">🍰</div>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 bg-card text-foreground border-t border-border">
          <h3 className="text-lg font-bold text-accent">{item.name}</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
            {item.category} • {item.price} DA
          </p>
          {item.description && (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
