"use client";

import { useState } from "react";

const ghost = ' return list.filter(x => x.active);';

export default function GhostText() {
  const [code, setCode] = useState("function activeOnly(list) {\n");
  const [accepted, setAccepted] = useState(false);

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab" && !accepted) { e.preventDefault(); setCode((c) => c + ghost + "\n}"); setAccepted(true); }
  };

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">エディタ内の薄文字（ghost text）— Tab で確定</div>
      <div className="relative font-mono text-xs">
        <pre aria-hidden className="absolute inset-0 m-0 p-3 whitespace-pre pointer-events-none text-muted-foreground/40">
          {code}{!accepted && ghost}
        </pre>
        <textarea value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={onKey} rows={6} className="relative w-full rounded-md border bg-background/0 p-3 outline-none text-foreground" />
      </div>
    </div>
  );
}
