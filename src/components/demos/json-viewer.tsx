"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

const data: JsonValue = {
  user: { id: 42, name: "佐藤 美咲", email: "misaki@example.com", admin: true },
  posts: [
    { id: 1, title: "はじめての投稿", likes: 12 },
    { id: 2, title: "週末のメモ", likes: 3 },
  ],
  meta: { page: 1, next: null },
};

function Node({ k, v, depth = 0 }: { k?: string; v: JsonValue; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isObj = typeof v === "object" && v !== null;
  const pad = { paddingLeft: depth * 12 };

  if (!isObj) {
    const cls =
      typeof v === "string"
        ? "text-emerald-700 dark:text-emerald-400"
        : typeof v === "number"
          ? "text-amber-700 dark:text-amber-400"
          : "text-violet-700 dark:text-violet-400";
    return (
      <div style={pad} className="whitespace-nowrap py-px pl-4 font-mono text-xs">
        {k !== undefined && <span className="text-muted-foreground">{`"${k}"`}: </span>}
        <span className={cls}>{typeof v === "string" ? `"${v}"` : String(v)}</span>
      </div>
    );
  }
  const isArray = Array.isArray(v);
  const entries = isArray ? v.map((x, i) => [String(i), x] as const) : Object.entries(v);
  const summary = isArray ? `[${entries.length}]` : `{${entries.length}}`;
  return (
    <div style={pad}>
      <button
        type="button"
        aria-expanded={open}
        aria-label={`${k ?? "root"} ${summary} を${open ? "折りたたむ" : "展開する"}`}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 whitespace-nowrap rounded px-0.5 py-px font-mono text-xs hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ChevronRight aria-hidden className={`size-3 transition-transform ${open ? "rotate-90" : ""}`} />
        {k !== undefined && <span className="text-muted-foreground">{`"${k}"`}: </span>}
        <span className="text-muted-foreground">{summary}</span>
      </button>
      {open && entries.map(([ck, cv]) => <Node key={ck} k={ck} v={cv} depth={depth + 1} />)}
    </div>
  );
}

export default function JsonViewer() {
  return (
    <div className="overflow-x-auto rounded-md border bg-background p-2">
      <Node v={data} />
    </div>
  );
}
