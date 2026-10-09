"use client";

import { useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConnectionStatus() {
  const [online, setOnline] = useState(true);
  const [pulse, setPulse] = useState(false);

  const flicker = () => {
    setOnline(false);
    setPulse(true);
    setTimeout(() => {
      setOnline(true);
      setTimeout(() => setPulse(false), 600);
    }, 1500);
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
          online ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300" : "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
        }`}
      >
        <span className="relative flex size-2">
          {pulse && online && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />}
          <span className={`relative inline-flex size-2 rounded-full ${online ? "bg-emerald-500" : "bg-red-500"}`} />
        </span>
        {online ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
        {online ? "オンライン" : "オフライン"}
      </div>
      <Button variant="outline" size="sm" onClick={flicker}>切断シミュレート</Button>
    </div>
  );
}
