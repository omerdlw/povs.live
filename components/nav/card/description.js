'use client';

import { motion, AnimatePresence } from "framer-motion";

export const Description = ({ text }) => {
  return (
    <div className="relative h-[20px]">
      <AnimatePresence mode="wait">
        <motion.p
          key={text}
          className="text-sm truncate absolute inset-0"
          transition={{ duration: 0.15 }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: .7, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};