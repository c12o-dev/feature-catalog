"use client";

import { motion } from "motion/react";

export default function SpringScroll() {
  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">バネ減衰のあるアニメ（クリック）</div>
      <motion.div
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 12 }}
        className="size-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 grid place-items-center text-white font-semibold cursor-pointer"
      >
        Tap me
      </motion.div>
    </div>
  );
}
