"use client";

import { ChevronRight, Home } from "lucide-react";

const path = [
  { label: "Home", icon: Home },
  { label: "Projects" },
  { label: "feature-catalog" },
  { label: "src/components" },
  { label: "demos" },
];

export default function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1 text-sm">
      {path.map((p, i) => (
        <div key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="size-3.5 text-muted-foreground" />}
          {i === path.length - 1 ? (
            <span className="font-medium px-1.5 py-0.5 rounded">{p.label}</span>
          ) : (
            <a className="text-muted-foreground hover:text-foreground hover:bg-accent px-1.5 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer">
              {p.icon && <p.icon className="size-3.5" />}
              {p.label}
            </a>
          )}
        </div>
      ))}
    </nav>
  );
}
