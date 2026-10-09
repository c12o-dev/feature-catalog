"use client";

const messages = [
  { user: "Alice", color: "bg-rose-400", text: "デプロイ準備ができました。レビューお願いします", time: "10:32" },
  { user: "Bob", color: "bg-blue-400", text: "確認します。テストは通ってる？", time: "10:35" },
  { user: "Alice", color: "bg-rose-400", text: "はい、CI 全グリーンです", time: "10:36" },
  { user: "Carol", color: "bg-emerald-400", text: "小さい修正提案を残しました", time: "10:42" },
];

export default function Thread() {
  return (
    <div className="space-y-3 max-w-md">
      <div className="rounded-md border bg-background p-3 text-sm">
        <span className="font-medium">原投稿:</span> v2.0 リリースの準備状況について
      </div>
      <div className="ml-6 border-l-2 border-muted pl-4 space-y-3">
        <div className="text-[10px] text-muted-foreground">スレッド ({messages.length})</div>
        {messages.map((m, i) => (
          <div key={i} className="flex gap-2">
            <div className={`size-7 rounded-full ${m.color} grid place-items-center text-white text-xs font-medium shrink-0`}>{m.user[0]}</div>
            <div className="flex-1 min-w-0 text-sm">
              <div className="flex items-baseline gap-2">
                <span className="font-medium">{m.user}</span>
                <span className="text-[10px] text-muted-foreground">{m.time}</span>
              </div>
              <div>{m.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
