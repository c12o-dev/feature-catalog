"use client";

import { useEffect } from "react";

/** Tints the ambient glow with this page's category hue while mounted (v2-launch §3.2). */
export function TintHue({ hue }: { hue: number }) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--tint-hue", String(hue));
    return () => root.style.setProperty("--tint-hue", "75");
  }, [hue]);
  return null;
}
