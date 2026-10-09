"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

const fruits = ["Apple", "Apricot", "Avocado", "Banana", "Blueberry", "Cherry", "Coconut", "Date", "Fig", "Grape", "Kiwi", "Lemon", "Mango", "Orange", "Peach", "Pear", "Plum", "Strawberry"];

export default function Autocomplete() {
  const [v, setV] = useState("");
  const [open, setOpen] = useState(false);
  const matches = v ? fruits.filter((f) => f.toLowerCase().startsWith(v.toLowerCase())).slice(0, 5) : [];
  return (
    <div className="relative max-w-xs">
      <Input value={v} onChange={(e) => { setV(e.target.value); setOpen(true); }} onBlur={() => setTimeout(() => setOpen(false), 100)} onFocus={() => v && setOpen(true)} placeholder="果物の名前..." />
      {open && matches.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 rounded-md border bg-popover shadow-md z-10 overflow-hidden">
          {matches.map((m) => (
            <li key={m} onMouseDown={() => { setV(m); setOpen(false); }} className="px-3 py-1.5 text-sm hover:bg-accent cursor-pointer">{m}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
