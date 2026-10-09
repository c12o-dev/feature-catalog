"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

const all = [
  "東京都新宿区西新宿 1-1", "東京都新宿区新宿 3-1", "東京都渋谷区道玄坂 1-2", "東京都渋谷区神南 1-1", "神奈川県横浜市西区高島 1-1",
];

export default function AddressAutocomplete() {
  const [v, setV] = useState("");
  const matches = v.length >= 2 ? all.filter((a) => a.includes(v)) : [];
  return (
    <div className="relative max-w-md">
      <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
        <MapPin className="size-4 text-muted-foreground" />
        <input value={v} onChange={(e) => setV(e.target.value)} placeholder="住所を入力..." className="flex-1 bg-transparent outline-none text-sm" />
      </div>
      {matches.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 rounded-md border bg-popover shadow-md max-h-48 overflow-y-auto z-10">
          {matches.map((m) => (
            <li key={m} onClick={() => { setV(m); }} className="px-3 py-1.5 text-sm hover:bg-accent cursor-pointer">{m}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
