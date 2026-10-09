"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

export default function ViewTransition() {
  const [page, setPage] = useState(0);
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <Button key={i} size="sm" variant={page === i ? "default" : "outline"} onClick={() => setPage(i)}>Page {i + 1}</Button>
        ))}
      </div>
      <div className="rounded-md border bg-background p-6 h-32 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 grid place-items-center text-2xl font-semibold"
          >
            Page {page + 1}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
