"use client";

const stats = [
  { v: "10,000+", label: "ユーザー" },
  { v: "99.99%", label: "Uptime" },
  { v: "180+", label: "国" },
  { v: "$2.4B", label: "処理金額" },
];

export default function HeroNumbers() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      {stats.map((s) => (
        <div key={s.label}>
          <div className="text-3xl font-semibold tabular-nums">{s.v}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
