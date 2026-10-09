"use client";

const events = [
  { time: "10:30", title: "デプロイ完了", desc: "v1.4.0 を production にリリース" },
  { time: "09:15", title: "PR #284 マージ", desc: "feature: Add command palette" },
  { time: "昨日 18:42", title: "新規ユーザー登録", desc: "alice@example.com" },
  { time: "昨日 14:20", title: "アラート解決", desc: "API latency が正常に戻った" },
];

export default function Timeline() {
  return (
    <ol className="relative border-l ml-2 space-y-4 pl-4">
      {events.map((e, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[1.4rem] top-1 size-2.5 rounded-full bg-primary ring-2 ring-background" />
          <div className="text-xs text-muted-foreground">{e.time}</div>
          <div className="text-sm font-medium">{e.title}</div>
          <div className="text-xs text-muted-foreground">{e.desc}</div>
        </li>
      ))}
    </ol>
  );
}
