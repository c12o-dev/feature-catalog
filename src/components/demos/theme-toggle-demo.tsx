"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

const opts = [
  { v: "light", label: "Light", icon: Sun },
  { v: "system", label: "System", icon: Monitor },
  { v: "dark", label: "Dark", icon: Moon },
];

export default function ThemeToggleDemo() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex justify-center">
      <div className="inline-flex rounded-lg bg-muted p-1">
        {opts.map((o) => (
          <button
            key={o.v}
            onClick={() => setTheme(o.v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
              theme === o.v ? "bg-background shadow-sm" : "text-muted-foreground"
            }`}
          >
            <o.icon className="size-4" />
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
