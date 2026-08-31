"use client";

import { motion } from "framer-motion";

export function Hero() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 16,
      },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 14,
      },
    },
  };

  return (
    <div className="bg-gradient-to-b from-primary via-primary/95 to-primary/90 text-primary-foreground py-12 sm:py-20 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 text-center"
      >
        <motion.div
          variants={badgeVariants}
          className="inline-block mb-6 px-4 py-2 bg-accent/20 rounded-full text-accent text-sm font-semibold"
        >
          Desserts premium & boissons
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-balance"
        >
          Goûtez la magie de
          <br />
          <span className="text-accent">Wonder Food&apos;s</span>
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8"
        >
          Crêpes, gaufres, tiramisu et boissons signature préparés avec passion
          à Maraval
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => scrollToSection("menu")}
            className="px-8 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-accent/20"
          >
            Voir le menu
          </button>
          <button
            onClick={() => scrollToSection("footer")}
            className="px-8 py-3 border-2 border-accent text-accent font-semibold rounded-lg hover:bg-accent/10 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            En savoir plus
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
