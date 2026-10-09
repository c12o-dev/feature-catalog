"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HoverMicro() {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button className="group">
        Click me
        <ArrowRight className="transition-transform group-hover:translate-x-1" />
      </Button>
      <button className="rounded-md border px-3 py-1.5 text-sm transition-all hover:scale-105 hover:shadow-md">Lift</button>
      <button className="rounded-md bg-foreground text-background px-3 py-1.5 text-sm transition-all hover:bg-foreground/80 active:scale-95">Press</button>
      <button className="rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-blue-500 hover:text-white hover:border-blue-500">Color</button>
    </div>
  );
}
