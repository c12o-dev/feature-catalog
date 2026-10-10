"use client";

import { useState } from "react";
import { ScrollHint, useScrollHint } from "./_scroll-hint";

type Node = { id: string; x: number; y: number; label: string; parent?: string };

const nodes: Node[] = [
  { id: "root", x: 220, y: 110, label: "プロダクト" },
  { id: "auth", x: 100, y: 50, label: "認証", parent: "root" },
  { id: "billing", x: 100, y: 170, label: "課金", parent: "root" },
  { id: "ai", x: 300, y: 50, label: "AI", parent: "root" },
  { id: "notify", x: 300, y: 170, label: "通知", parent: "root" },
  { id: "sso", x: 40, y: 20, label: "SSO", parent: "auth" },
  { id: "mfa", x: 40, y: 80, label: "MFA", parent: "auth" },
  { id: "rag", x: 395, y: 25, label: "RAG", parent: "ai" },
  { id: "chat", x: 395, y: 75, label: "Chat", parent: "ai" },
  { id: "plan", x: 40, y: 195, label: "プラン", parent: "billing" },
  { id: "push", x: 395, y: 195, label: "Push", parent: "notify" },
];

const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
const width = (n: Node) => (n.id === "root" ? 88 : Math.max(48, n.label.length * 12 + 20));
const isRelated = (n: Node, focus: string | null) => {
  if (!focus) return true;
  let cur: Node | undefined = n;
  while (cur) { if (cur.id === focus) return true; cur = cur.parent ? byId[cur.parent] : undefined; }
  let f: Node | undefined = byId[focus];
  while (f) { if (f.id === n.id) return true; f = f.parent ? byId[f.parent] : undefined; }
  return false;
};

export default function Mindmap() {
  const [focus, setFocus] = useState<string | null>(null);
  const { hint, scrollProps } = useScrollHint<HTMLDivElement>();
  return (
    <div className="mx-auto w-full max-w-xl space-y-2">
      {/* The SVG keeps at least its 440px viewBox width so the 11px labels never shrink below 11px:
          on a phone stage (~310px) it scrolls sideways instead, with a hint until the far edge is seen. */}
      <div className="relative">
        <div {...scrollProps} className="overflow-x-auto overflow-y-hidden">
          <svg viewBox="0 0 440 220" className="block w-full min-w-[440px]" role="group" aria-label="マインドマップ: プロダクト">
            {nodes.filter((n) => n.parent).map((n) => {
              const p = byId[n.parent!];
              const on = isRelated(n, focus);
              const mx = (p.x + n.x) / 2;
              return (
                <path
                  key={`e-${n.id}`}
                  d={`M${p.x} ${p.y} C${mx} ${p.y} ${mx} ${n.y} ${n.x} ${n.y}`}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={on ? (p.id === "root" ? 0.35 : 0.22) : 0.08}
                  strokeWidth={p.id === "root" ? 1.5 : 1}
                  className="text-foreground transition-[stroke-opacity]"
                />
              );
            })}
            {nodes.map((n) => {
              const w = width(n);
              const root = n.id === "root";
              const on = isRelated(n, focus);
              return (
                <g
                  key={n.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`${n.label} の枝を強調`}
                  aria-pressed={focus === n.id}
                  onClick={() => setFocus((f) => (f === n.id ? null : n.id))}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFocus((f) => (f === n.id ? null : n.id)); } }}
                  className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-ring [&:focus-visible>rect]:stroke-2"
                  opacity={on ? 1 : 0.35}
                >
                  <rect
                    x={n.x - w / 2} y={n.y - 12} width={w} height="24" rx="12" strokeWidth="1"
                    className={root ? "fill-primary stroke-primary" : focus === n.id ? "fill-muted stroke-foreground/50" : "fill-background stroke-foreground/20"}
                  />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" className={root ? "fill-primary-foreground font-medium" : "fill-foreground"}>{n.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <ScrollHint show={hint} className="from-background" />
      </div>
      <p className="text-center text-xs text-muted-foreground" aria-live="polite">
        {focus ? `「${byId[focus].label}」の枝を表示中。もう一度押すと解除` : "ノードを押すと、その枝だけを強調します"}
      </p>
    </div>
  );
}
