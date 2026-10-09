"use client";

export default function Mindmap() {
  return (
    <svg viewBox="0 0 400 220" className="w-full">
      <line x1="200" y1="110" x2="80" y2="40" stroke="currentColor" strokeOpacity="0.3" />
      <line x1="200" y1="110" x2="80" y2="180" stroke="currentColor" strokeOpacity="0.3" />
      <line x1="200" y1="110" x2="320" y2="40" stroke="currentColor" strokeOpacity="0.3" />
      <line x1="200" y1="110" x2="320" y2="180" stroke="currentColor" strokeOpacity="0.3" />
      <line x1="320" y1="40" x2="380" y2="20" stroke="currentColor" strokeOpacity="0.2" />
      <line x1="320" y1="40" x2="380" y2="60" stroke="currentColor" strokeOpacity="0.2" />
      {[
        { x: 200, y: 110, label: "プロダクト", main: true },
        { x: 80, y: 40, label: "認証" }, { x: 80, y: 180, label: "課金" },
        { x: 320, y: 40, label: "AI" }, { x: 320, y: 180, label: "通知" },
        { x: 380, y: 20, label: "RAG" }, { x: 380, y: 60, label: "Chat" },
      ].map((n, i) => (
        <g key={i}>
          <rect x={n.x - 35} y={n.y - 12} width="70" height="24" rx="12" className={n.main ? "fill-primary" : "fill-background stroke-foreground/20"} strokeWidth="1" />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" className={n.main ? "fill-primary-foreground" : "fill-foreground"}>{n.label}</text>
        </g>
      ))}
    </svg>
  );
}
