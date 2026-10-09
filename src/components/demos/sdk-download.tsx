"use client";

import { useState } from "react";

const platforms = [
  { v: "npm", l: "npm", cmd: "npm install @example/sdk" },
  { v: "pip", l: "Python", cmd: "pip install example-sdk" },
  { v: "brew", l: "Homebrew", cmd: "brew install example/tap/cli" },
  { v: "go", l: "Go", cmd: "go get github.com/example/sdk" },
];

export default function SdkDownload() {
  const [v, setV] = useState("npm");
  const cur = platforms.find((p) => p.v === v)!;
  return (
    <div className="space-y-2 max-w-md">
      <div className="flex gap-1">
        {platforms.map((p) => (
          <button key={p.v} onClick={() => setV(p.v)} className={`text-xs rounded-md px-3 py-1.5 ${v === p.v ? "bg-foreground text-background" : "border hover:bg-accent"}`}>{p.l}</button>
        ))}
      </div>
      <pre className="rounded-md border bg-zinc-950 text-zinc-100 font-mono text-xs p-3">$ {cur.cmd}</pre>
    </div>
  );
}
