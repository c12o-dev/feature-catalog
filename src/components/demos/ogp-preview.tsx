"use client";

import { useId, useState } from "react";
import { Link2 } from "lucide-react";

type Ogp = { site: string; title: string; desc: string; from: string; to: string };

const MOCK: Record<string, Ogp> = {
  "https://hoshizora.example/blog/design-tokens": {
    site: "hoshizora.example",
    title: "デザイントークンを 3 階層で設計する",
    desc: "プリミティブ・セマンティック・コンポーネントの 3 層に分けると、ダークモード対応と保守が楽になります。",
    from: "from-sky-400",
    to: "to-indigo-500",
  },
  "https://mori-cafe.example/menu/autumn": {
    site: "mori-cafe.example",
    title: "秋の限定メニュー｜森のカフェ",
    desc: "栗と和三盆のモンブラン、ほうじ茶ラテなど 10 月の限定メニューをご紹介します。",
    from: "from-amber-400",
    to: "to-rose-500",
  },
};
const SAMPLES = Object.keys(MOCK);

export default function OgpPreview() {
  const id = useId();
  const [url, setUrl] = useState(SAMPLES[0]);
  const [opened, setOpened] = useState(false);
  const ogp = MOCK[url.trim()];
  const isUrl = /^https?:\/\/\S+$/.test(url.trim());

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div className="space-y-1">
        <label htmlFor={id} className="text-xs text-muted-foreground">
          メッセージに URL を貼り付け
        </label>
        <input
          id={id}
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setOpened(false);
          }}
          className="h-9 w-full rounded-md border bg-background px-3 text-sm"
        />
        <div className="flex flex-wrap gap-1">
          {SAMPLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setUrl(s);
                setOpened(false);
              }}
              className="rounded border bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-muted"
            >
              {MOCK[s].site}
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite">
        {ogp ? (
          <a
            href={`#ogp-${ogp.site}`}
            onClick={(e) => {
              e.preventDefault();
              setOpened(true);
            }}
            className="block overflow-hidden rounded-lg border bg-card transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className={`h-24 bg-gradient-to-br ${ogp.from} ${ogp.to} opacity-90`} aria-hidden />
            <div className="p-3">
              <div className="text-[11px] text-muted-foreground">{ogp.site}</div>
              <div className="mt-0.5 text-sm font-medium">{ogp.title}</div>
              <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{ogp.desc}</div>
            </div>
          </a>
        ) : isUrl ? (
          <p className="flex items-center gap-1.5 rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
            <Link2 className="size-3.5" aria-hidden />
            OGP 情報が見つからないため、リンクのみ表示します
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">URL を入力するとカードが表示されます</p>
        )}
        {opened && ogp && <p className="mt-2 text-xs text-muted-foreground">（デモ）{ogp.site} を新しいタブで開きます</p>}
      </div>
    </div>
  );
}
