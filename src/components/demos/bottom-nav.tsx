"use client";

import { useState } from "react";
import { Home, Search, Bell, User, Plus } from "lucide-react";

const items = [
  { id: "home", label: "ホーム", icon: Home },
  { id: "search", label: "検索", icon: Search },
  { id: "post", label: "", icon: Plus, primary: true },
  { id: "alerts", label: "通知", icon: Bell },
  { id: "me", label: "プロフィール", icon: User },
];

export default function BottomNav() {
  const [active, setActive] = useState("home");
  return (
    <div className="rounded-2xl border bg-background p-1 max-w-sm mx-auto">
      <div className="flex items-center justify-around">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => setActive(it.id)}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors ${
              it.primary ? "bg-primary text-primary-foreground" : active === it.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <it.icon className={it.primary ? "size-5" : "size-4"} />
            {it.label && <span className="text-[10px]">{it.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
