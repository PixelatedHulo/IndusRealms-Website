"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import config from "@/config/homepage.json";

export default function Hero() {
  return (
    <section className="text-center py-20 bg-brand-hero relative overflow-hidden">
      <motion.h1
        className="text-5xl md:text-7xl font-extrabold leading-tight"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="block">{config.hero.title.line1}</span>
        <span className="text-gradient">{config.hero.title.line2}</span>
      </motion.h1>

      <motion.p
        className="mt-6 max-w-2xl mx-auto text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {config.hero.description}
      </motion.p>

      <motion.div
        className="mt-8 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button className="btn-primary px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition-transform">
          {config.hero.buttonText}
        </Button>
      </motion.div>

      <p className="mt-6 text-sm text-gray-400">
        Server IP: <span className="text-gradient font-semibold">{config.hero.serverIP}</span>
      </p>
    </section>
  );
}
