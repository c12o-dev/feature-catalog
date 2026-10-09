"use client";

import { useId, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

type E = { c: string; k: string };
const GROUPS: { name: string; items: E[] }[] = [
  {
    name: "顔",
    items: [
      { c: "😀", k: "笑顔 にこにこ smile grin" },
      { c: "😂", k: "泣き笑い 爆笑 joy laugh" },
      { c: "🥹", k: "感動 うるうる" },
      { c: "😍", k: "ハート目 好き love" },
      { c: "🤔", k: "考える 疑問 think" },
      { c: "😅", k: "汗 苦笑 sweat" },
      { c: "😭", k: "号泣 泣く cry" },
      { c: "😴", k: "眠い 寝る sleep" },
    ],
  },
  {
    name: "ハート",
    items: [
      { c: "❤️", k: "赤 ハート heart love red" },
      { c: "🧡", k: "オレンジ ハート heart orange" },
      { c: "💛", k: "黄色 ハート heart yellow" },
      { c: "💚", k: "緑 ハート heart green" },
      { c: "💙", k: "青 ハート heart blue" },
      { c: "💜", k: "紫 ハート heart purple" },
    ],
  },
  {
    name: "手",
    items: [
      { c: "👍", k: "いいね グッド 賛成 thumbs up good" },
      { c: "👏", k: "拍手 clap" },
      { c: "🙌", k: "バンザイ 喜び hands" },
      { c: "🙏", k: "お願い 感謝 ありがとう pray thanks" },
      { c: "👋", k: "手を振る こんにちは wave hello" },
      { c: "✌️", k: "ピース victory peace" },
    ],
  },
  {
    name: "記号",
    items: [
      { c: "🎉", k: "お祝い クラッカー party" },
      { c: "🚀", k: "ロケット リリース rocket ship" },
      { c: "🔥", k: "炎 熱い fire" },
      { c: "✅", k: "完了 チェック done check" },
      { c: "👀", k: "見てる 確認中 eyes" },
      { c: "💯", k: "満点 100 hundred" },
      { c: "⚠️", k: "注意 警告 warning" },
      { c: "❓", k: "質問 はてな question" },
    ],
  },
];

export default function EmojiPicker() {
  const id = useId();
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [hover, setHover] = useState<E | null>(null);

  const query = q.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      GROUPS.map((g) => ({
        ...g,
        items: query ? g.items.filter((e) => e.k.toLowerCase().includes(query) || e.c === query) : g.items,
      })).filter((g) => g.items.length > 0),
    [query],
  );
  const count = filtered.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="mx-auto w-full max-w-xs space-y-3">
      <div className="min-h-10 rounded-md border bg-background px-3 py-2 text-sm">
        <span className="text-muted-foreground">メッセージ: </span>
        <span aria-live="polite">{picked.join("") || "（未選択）"}</span>
      </div>

      <div className="overflow-hidden rounded-lg border bg-popover shadow-md">
        <div className="relative border-b p-2">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <label htmlFor={id} className="sr-only">絵文字を検索</label>
          <input
            id={id}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="検索（例: いいね, fire）"
            className="w-full rounded-md border bg-background py-1.5 pl-7 pr-7 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label="検索をクリア"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="h-48 overflow-y-auto p-2">
          <p className="sr-only" aria-live="polite">{count} 件</p>
          {filtered.length === 0 ? (
            <div className="grid h-full place-items-center text-xs text-muted-foreground">「{q}」に一致する絵文字はありません</div>
          ) : (
            filtered.map((g) => (
              <div key={g.name} className="mb-1">
                <div className="sticky top-0 bg-popover py-1 text-xs text-muted-foreground">{g.name}</div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(2rem,1fr))] gap-0.5">
                  {g.items.map((e) => (
                    <button
                      key={e.c}
                      type="button"
                      aria-label={e.k.split(" ")[0]}
                      onClick={() => setPicked((p) => [...p, e.c].slice(-12))}
                      onPointerEnter={() => setHover(e)}
                      onFocus={() => setHover(e)}
                      className="grid aspect-square place-items-center rounded-md text-lg hover:bg-muted focus-visible:bg-muted"
                    >
                      {e.c}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex h-10 items-center gap-2 border-t px-3 text-xs text-muted-foreground">
          {hover ? (
            <>
              <span className="text-xl">{hover.c}</span>
              <span className="truncate">{hover.k.split(" ").slice(0, 2).join("・")}</span>
            </>
          ) : (
            <span>絵文字にカーソルを合わせると名前を表示</span>
          )}
        </div>
      </div>
    </div>
  );
}
