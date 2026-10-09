"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

const data: JsonValue = {
  user: { id: 42, name: "Alice", email: "alice@example.com", admin: true },
  posts: [{ id: 1, title: "Hello" }, { id: 2, title: "World" }],
  meta: null,
};

function Node({ k, v, depth = 0 }: { k?: string; v: JsonValue; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isObj = typeof v === "object" && v !== null;
  const pad = { paddingLeft: depth * 12 };

  if (!isObj) {
    const cls = typeof v === "string" ? "text-emerald-600" : typeof v === "number" ? "text-amber-600" : "text-purple-600";
    return (
      <div style={pad} className="text-xs font-mono">
        {k && <span className="text-muted-foreground">{`"${k}"`}: </span>}
        <span className={cls}>{typeof v === "string" ? `"${v}"` : String(v)}</span>
      </div>
    );
  }
  const isArray = Array.isArray(v);
  const entries = isArray ? v.map((x, i) => [String(i), x] as const) : Object.entries(v);
  return (
    <div style={pad}>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 text-xs font-mono hover:bg-accent rounded px-0.5">
        <ChevronRight className={`size-3 transition-transform ${open ? "rotate-90" : ""}`} />
        {k && <span className="text-muted-foreground">{`"${k}"`}: </span>}
        <span className="text-muted-foreground">{isArray ? `[${entries.length}]` : `{${entries.length}}`}</span>
      </button>
      {open && entries.map(([ck, cv]) => <Node key={ck} k={ck} v={cv} depth={depth + 1} />)}
    </div>
  );
}

export default function JsonViewer() {
  return (
    <div className="rounded-md border bg-background p-2">
      <Node v={data} />
    </div>
  );
}
