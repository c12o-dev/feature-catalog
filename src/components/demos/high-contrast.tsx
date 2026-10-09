"use client";

import { useState } from "react";

export default function HighContrast() {
  const [hc, setHc] = useState(false);
  return (
    <div className="space-y-2">
      <button onClick={() => setHc((h) => !h)} className="rounded-md border px-3 py-1.5 text-xs">{hc ? "通常" : "高コントラスト"}モード</button>
      <div className={`rounded-md border p-4 ${hc ? "bg-black text-white border-white border-2" : "bg-background text-foreground"}`}>
        <h3 className={`font-semibold mb-1 ${hc ? "underline" : ""}`}>サンプル見出し</h3>
        <p className="text-sm">本文。{hc ? "高コントラストでは色のコントラスト比を最大化、リンクに下線を必ずつける。" : "通常表示のテキスト。"}</p>
        <a className={`text-sm ${hc ? "text-yellow-300 underline" : "text-blue-600 hover:underline"}`}>これはリンク</a>
      </div>
    </div>
  );
}
