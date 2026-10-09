"use client";

const msgs = [
  { who: "them", t: "やあ！" },
  { who: "me", t: "こんにちは" },
  { who: "them", t: "そのプロジェクトの件、来週時間ある？" },
  { who: "me", t: "火曜の午後がいいかも" },
  { who: "them", t: "了解！カレンダー送るね" },
];

export default function DmThread() {
  return (
    <div className="rounded-md border bg-background p-3 space-y-2 max-w-md">
      {msgs.map((m, i) => (
        <div key={i} className={`flex ${m.who === "me" ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[70%] rounded-2xl px-3 py-1.5 text-sm ${m.who === "me" ? "bg-blue-500 text-white" : "bg-muted"}`}>
            {m.t}
          </div>
        </div>
      ))}
      <div className="flex gap-2 pt-2 border-t">
        <input placeholder="メッセージを送る..." className="flex-1 rounded-full border bg-background px-3 py-1.5 text-sm" />
      </div>
    </div>
  );
}
