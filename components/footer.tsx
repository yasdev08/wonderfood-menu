"use client";

import { MapPin, Phone, Clock, Globe, Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer
      id="footer"
      className="bg-card text-foreground border-t border-border mt-16"
    >
      {/* Top Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-border/55">
        {/* Brand details */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            <span className="text-accent">WONDER</span> FOOD&apos;S
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            Découvrez nos crêpes gourmandes, gaufres croustillantes, tiramisus
            aériens et cocktails de fruits frais pressés minute. Une expérience
            sucrée premium unique à Oran !
          </p>
          <div className="flex gap-4 pt-2">
            <a
              href="https://www.instagram.com/wonder.foods.maraval"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-accent hover:bg-accent hover:text-primary transition-all duration-300 border border-primary/30"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/wonderfoods3131/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-accent hover:bg-accent hover:text-primary transition-all duration-300 border border-primary/30"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-accent">
            Contact & Localisation
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <Link
                href="https://maps.app.goo.gl/KQwZqUJuBf1CzszKA"
                target="_blank"
              >
                <span>Rue des Martyrs, Maraval, Oran, Algérie</span>
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-accent flex-shrink-0" />
              <a
                href="tel:+213660570102"
                className="hover:text-accent transition-colors"
              >
                +213 (0) 660 57 01 02
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-accent flex-shrink-0" />
              <span>Tous les jours : 12:00 - 00:00</span>
            </li>
          </ul>
        </div>

        {/* Order Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-accent">Comment Commander ?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            1. Ajoutez vos desserts et boissons préférés à votre panier.
            <br />
            2. Remplissez vos coordonnées directement dans le panier.
            <br />
            3. Cliquez sur commander pour envoyer automatiquement par WhatsApp !
            <br />
            Simple, rapide et direct.
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-foreground">
            Wonder Food&apos;s Maraval
          </span>
          . Tous droits réservés.
        </div>
        <div className="flex items-center gap-1.5 bg-primary-foreground/5 py-1.5 px-3 rounded-full border border-primary-foreground/10 shadow-sm transition-colors hover:bg-primary-foreground/10">
          <span>Ce site a été créé par</span>
          <a
            href="https://mbpub.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-accent hover:underline flex items-center gap-1"
          >
            MB PUB <Globe className="w-3.5 h-3.5 inline" />
          </a>
        </div>
      </div>
    </footer>
  );
}
