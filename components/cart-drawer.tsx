"use client";

import { MenuItem, CartItem } from "@/app/page";
import { X, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onIncrement: (item: MenuItem) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onClear: () => void;
}

// Remplacez ce numéro par le numéro WhatsApp de votre restaurant (avec le code pays, ex: 213 pour l'Algérie)
const RESTAURANT_WHATSAPP_NUMBER = "213660570102";

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onIncrement,
  onDecrement,
  onRemove,
  onClear,
}: CartDrawerProps) {
  const [step, setStep] = useState<"cart" | "checkout">("cart");

  // Checkout Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<
    "livraison" | "emporter" | "place"
  >("livraison");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    address?: string;
  }>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset steps and form when closing drawer
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStep("cart");
        setErrors({});
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const total = items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  const totalQuantity = items.reduce((sum, ci) => sum + ci.quantity, 0);

  const formatOrderMessage = () => {
    const methodLabel = {
      livraison: "🚚 Livraison à domicile",
      emporter: "🛍️ À emporter (Retrait)",
      place: "🍽️ Sur place (Consommation)",
    }[deliveryMethod];

    let text = `*NOUVELLE COMMANDE - WONDER FOOD'S* 🍔🍰\n\n`;
    text += `👤 *Client:* ${name}\n`;
    text += `📞 *Téléphone:* ${phone}\n`;
    text += `📌 *Mode:* ${methodLabel}\n`;

    if (deliveryMethod === "livraison" && address) {
      text += `📍 *Adresse de livraison:* ${address}\n`;
    }

    if (notes) {
      text += `📝 *Notes client:* ${notes}\n`;
    }

    text += `\n-------------------------------\n`;
    text += `🛍️ *Articles commandés :*\n`;

    items.forEach(({ item, quantity }) => {
      const itemTotal = item.price * quantity;
      text += `- ${quantity}x *${item.name}* (${item.price} DA) = *${itemTotal} DA*\n`;
    });

    text += `-------------------------------\n`;
    text += `💰 *TOTAL DE LA COMMANDE:* *${total} DA*`;

    return encodeURIComponent(text);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; phone?: string; address?: string } = {};
    if (!name.trim()) newErrors.name = "Le nom complet est requis";
    if (!phone.trim()) newErrors.phone = "Le numéro de téléphone est requis";
    if (deliveryMethod === "livraison" && !address.trim()) {
      newErrors.address = "L'adresse de livraison est requise";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const message = formatOrderMessage();
    const whatsappUrl = `https://wa.me/${RESTAURANT_WHATSAPP_NUMBER}?text=${message}`;

    window.open(whatsappUrl, "_blank");

    // Clear cart and close drawer
    onClear();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed right-0 top-0 h-screen w-full sm:w-[420px] bg-card border-l border-border shadow-lg z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-primary/10">
              <div className="flex items-center gap-2">
                {step === "checkout" ? (
                  <button
                    onClick={() => setStep("cart")}
                    className="mr-1 p-2 hover:bg-muted rounded-lg transition-colors text-foreground flex items-center justify-center cursor-pointer"
                    aria-label="Retour au panier"
                  >
                    <ArrowLeft className="w-5 h-5 text-accent" />
                  </button>
                ) : (
                  <ShoppingCart className="w-6 h-6 text-accent" />
                )}
                <h2 className="text-xl font-bold text-foreground">
                  {step === "checkout"
                    ? "Coordonnées de livraison"
                    : "Votre panier"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                aria-label="Fermer le panier"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {step === "cart" ? (
                /* CART STEP */
                items.length === 0 ? (
                  <div className="text-center py-16 flex flex-col items-center justify-center">
                    <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4 opacity-40" />
                    <p className="text-muted-foreground text-lg">
                      Votre panier est vide
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-6 px-6 py-2 border-2 border-accent text-accent hover:bg-accent/10 rounded-full text-sm font-semibold transition-all cursor-pointer"
                    >
                      Découvrir le menu
                    </button>
                  </div>
                ) : (
                  <motion.div layout className="space-y-3">
                    <AnimatePresence mode="sync">
                      {items.map(({ item, quantity }) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9, x: 50 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                          }}
                          key={item.id}
                          className="flex items-center justify-between bg-muted/40 p-4 rounded-xl border border-border/50 hover:border-accent/40 hover:bg-muted/60 transition-all"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate">
                              {item.name}
                            </p>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-0.5">
                              {item.category}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 ml-4">
                            {/* Quantity selector inside Cart Drawer */}
                            <div className="flex items-center rounded-lg bg-primary/15 border border-border/40 p-0.5">
                              <button
                                type="button"
                                onClick={() => onDecrement(item.id)}
                                className="px-1.5 py-0.5 text-accent hover:text-accent/80 font-bold text-xs cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-1 text-xs font-semibold text-foreground min-w-[14px] text-center">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onIncrement(item)}
                                className="px-1.5 py-0.5 text-accent hover:text-accent/80 font-bold text-xs cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <span className="text-base font-bold text-accent whitespace-nowrap min-w-[60px] text-right">
                              {item.price * quantity} DA
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onRemove(item.id)}
                              className="p-2 hover:bg-destructive/15 text-white rounded-lg transition-colors border border-transparent hover:border-destructive/25 cursor-pointer flex items-center justify-center"
                              aria-label={`Retirer ${item.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )
              ) : (
                /* CHECKOUT STEP */
                <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        Nom complet <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name)
                            setErrors({ ...errors, name: undefined });
                        }}
                        className={`w-full px-4 py-2.5 bg-muted/30 border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
                          errors.name
                            ? "border-destructive focus:ring-destructive"
                            : "border-border"
                        }`}
                        placeholder="Ex: Mohamed Benali"
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        Numéro de téléphone{" "}
                        <span className="text-accent">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone)
                            setErrors({ ...errors, phone: undefined });
                        }}
                        className={`w-full px-4 py-2.5 bg-muted/30 border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
                          errors.phone
                            ? "border-destructive focus:ring-destructive"
                            : "border-border"
                        }`}
                        placeholder="Ex: 0550 12 34 56"
                      />
                      {errors.phone && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Delivery Method Options */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Type de commande
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["livraison", "emporter", "place"] as const).map(
                          (method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => {
                                setDeliveryMethod(method);
                                if (method !== "livraison")
                                  setErrors({ ...errors, address: undefined });
                              }}
                              className={`py-2 px-1 rounded-lg text-xs font-semibold border transition-all text-center cursor-pointer ${
                                deliveryMethod === method
                                  ? "bg-accent text-accent-foreground border-accent shadow-md"
                                  : "bg-muted/20 border-border text-muted-foreground hover:bg-muted/40"
                              }`}
                            >
                              {method === "livraison" && "🚚 Livraison"}
                              {method === "emporter" && "🛍️ Emporter"}
                              {method === "place" && "🍽️ Sur place"}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Delivery Address (Conditional) */}
                    {deliveryMethod === "livraison" && (
                      <div className="transition-all duration-300">
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-foreground mb-1"
                        >
                          Adresse de livraison{" "}
                          <span className="text-accent">*</span>
                        </label>
                        <textarea
                          id="address"
                          rows={3}
                          value={address}
                          onChange={(e) => {
                            setAddress(e.target.value);
                            if (errors.address)
                              setErrors({ ...errors, address: undefined });
                          }}
                          className={`w-full px-4 py-2 bg-muted/30 border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none ${
                            errors.address
                              ? "border-destructive focus:ring-destructive"
                              : "border-border"
                          }`}
                          placeholder="Rue, N° de porte, Quartier (Maraval, etc.), Repères..."
                        />
                        {errors.address && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.address}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Special Instructions (Notes) */}
                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        Remarques spéciales (facultatif)
                      </label>
                      <textarea
                        id="notes"
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-4 py-2 bg-muted/30 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                        placeholder="Ingrédients en moins, couverts, etc."
                      />
                    </div>
                  </div>

                  {/* Order Summary Box */}
                  <div className="bg-primary-foreground/5 border border-border p-4 rounded-xl space-y-2">
                    <h4 className="text-xs uppercase tracking-wider text-accent font-bold">
                      Récapitulatif
                    </h4>
                    <div className="flex justify-between text-sm text-foreground/80">
                      <span>Articles ({totalQuantity})</span>
                      <span>{total} DA</span>
                    </div>
                    <div className="flex justify-between text-sm text-foreground/80">
                      <span>Livraison</span>
                      <span className="text-xs text-accent">
                        Calculée à la livraison
                      </span>
                    </div>
                  </div>

                  {/* Hidden submit trigger */}
                  <button
                    type="submit"
                    className="hidden"
                    id="checkout-form-submit"
                  />
                </form>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 bg-primary/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-foreground">
                    Total de la commande :
                  </span>
                  <span className="text-2xl font-bold text-accent">
                    {total} DA
                  </span>
                </div>

                <div className="space-y-3">
                  {step === "cart" ? (
                    <button
                      onClick={() => setStep("checkout")}
                      className="w-full py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:bg-accent/90 transition-all duration-200 active:scale-95 shadow-md cursor-pointer"
                    >
                      Passer la commande
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const submitBtn = document.getElementById(
                          "checkout-form-submit",
                        );
                        if (submitBtn) submitBtn.click();
                      }}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.714-1.464L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.757 1.451 5.483 0 9.945-4.464 9.949-9.951.002-2.657-1.03-5.155-2.906-7.03C16.515 1.741 14.02 0.71 11.365.71a9.92 9.92 0 00-9.943 9.953c-.001 1.636.43 3.227 1.246 4.636l-.97 3.542 3.633-.953zM16.9 13.5c-.328-.164-1.94-.957-2.24-1.066-.3-.11-.52-.164-.74.164-.22.328-.85 1.066-1.04 1.285-.19.22-.38.246-.708.082-.328-.164-1.383-.51-2.637-1.63-1.01-.9-1.69-2.01-1.89-2.34-.19-.328-.02-.507.143-.67.149-.148.328-.383.493-.574.164-.19.22-.328.328-.547.11-.22.055-.41-.027-.574-.082-.164-.74-1.785-1.01-2.44-.266-.64-.537-.55-.74-.56l-.56-.01c-.19 0-.5.07-.76.357-.26.286-1 .984-1 2.4 0 1.413 1.03 2.777 1.17 2.968.14.19 2.025 3.093 4.906 4.337.685.296 1.22.473 1.638.605.688.22 1.314.19 1.81.116.55-.082 1.94-.793 2.215-1.56.275-.765.275-1.422.193-1.558-.083-.137-.3-.22-.628-.383z" />
                      </svg>
                      Confirmer sur WhatsApp
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onClear}
                    className="w-full py-3 bg-destructive/10 text-white font-semibold rounded-lg hover:bg-destructive/20 transition-all duration-200 text-sm cursor-pointer"
                  >
                    Vider le panier
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
