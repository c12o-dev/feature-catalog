"use client";

import { useState } from "react";

export default function SkipLink() {
  const [show, setShow] = useState(false);
  return (
    <div className="rounded-md border bg-background p-3">
      <a
        href="#main"
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className={`fixed top-2 left-2 z-50 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm transition-transform ${show ? "translate-y-0" : "-translate-y-20"}`}
      >
        コンテンツへスキップ
      </a>
      <div className="text-xs text-muted-foreground mb-2">↓ Tab キーを押すと skip リンクが現れます (focus してください)</div>
      <button onClick={() => { const a = document.querySelector('a[href="#main"]') as HTMLAnchorElement; a?.focus(); }} className="rounded border px-3 py-1 text-xs">疑似 Tab</button>
    </div>
  );
}
