"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function TagInput() {
  const [tags, setTags] = useState(["typescript", "react"]);
  const [v, setV] = useState("");
  const onKey = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === ",") && v.trim()) {
      e.preventDefault();
      setTags((t) => [...t, v.trim().replace(",", "")]);
      setV("");
    }
    if (e.key === "Backspace" && !v) setTags((t) => t.slice(0, -1));
  };
  return (
    <div className="space-y-2 max-w-md">
      <div className="rounded-md border bg-background flex flex-wrap items-center gap-1 p-1.5">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs">
            {t}
            <button onClick={() => setTags((tags) => tags.filter((x) => x !== t))}><X className="size-3" /></button>
          </span>
        ))}
        <input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={onKey} placeholder="enter で追加" className="flex-1 min-w-[6rem] bg-transparent outline-none text-sm px-1" />
      </div>
    </div>
  );
}
