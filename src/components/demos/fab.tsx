"use client";

import { Plus } from "lucide-react";

export default function Fab() {
  return (
    <div className="relative h-32 rounded-md border bg-muted/30 overflow-hidden">
      <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">アプリ画面</div>
      <button className="absolute bottom-3 right-3 size-12 rounded-full bg-primary text-primary-foreground shadow-lg grid place-items-center hover:scale-105 transition-transform">
        <Plus className="size-5" />
      </button>
    </div>
  );
}
