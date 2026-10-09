"use client";

import { useId, useState } from "react";
import { ArrowLeft, CornerDownLeft, FileText, Hash, Search, User, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Kind = "doc" | "person" | "channel";
type Item = { kind: Kind; title: string; path: string; snippet: string };

const DATA: Item[] = [
  { kind: "doc", title: "Q4 プロダクト戦略", path: "ドキュメント / 企画", snippet: "Q4 は既存顧客の継続率改善に集中する。新規機能は 2 本に絞る。" },
  { kind: "doc", title: "API 設計レビュー", path: "ドキュメント / 開発", snippet: "ページネーションはカーソル方式に統一。エラー形式は RFC 9457 準拠。" },
  { kind: "doc", title: "オンボーディング手順書", path: "ドキュメント / 人事", snippet: "初日はアカウント発行と開発環境のセットアップまでを目標にする。" },
  { kind: "person", title: "田中 彩", path: "メンバー / デザイン", snippet: "プロダクトデザイナー · 東京オフィス" },
  { kind: "person", title: "佐藤 健太", path: "メンバー / 開発", snippet: "バックエンドエンジニア · API チームリード" },
  { kind: "channel", title: "#engineering", path: "チャンネル", snippet: "開発全般の相談・共有。メンバー 48 人" },
  { kind: "channel", title: "#design-review", path: "チャンネル", snippet: "毎週木曜のデザインレビュー用。メンバー 21 人" },
];
const META: Record<Kind, { label: string; icon: LucideIcon }> = {
  doc: { label: "ドキュメント", icon: FileText },
  person: { label: "メンバー", icon: User },
  channel: { label: "チャンネル", icon: Hash },
};
const KINDS: Kind[] = ["doc", "person", "channel"];

export default function GlobalSearch() {
  const id = useId();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [page, setPage] = useState<Item | null>(null);

  const needle = q.trim().toLowerCase();
  const filtered = DATA.filter((d) => !needle || d.title.toLowerCase().includes(needle) || d.snippet.toLowerCase().includes(needle));
  // Flatten in display (grouped) order so arrow keys follow what is on screen.
  const ordered = KINDS.flatMap((k) => filtered.filter((d) => d.kind === k));
  const cur = Math.min(active, ordered.length - 1);

  const jump = (it: Item) => setPage(it);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || ordered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((cur + 1) % ordered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((cur - 1 + ordered.length) % ordered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      jump(ordered[cur]);
    }
  };

  if (page) {
    const Icon = META[page.kind].icon;
    return (
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg border bg-card text-card-foreground">
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <button type="button" onClick={() => setPage(null)} className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
            <ArrowLeft aria-hidden className="size-3.5" />
            検索に戻る
          </button>
          <span className="truncate text-xs text-muted-foreground">{page.path}</span>
        </div>
        <div className="space-y-2 p-4" aria-live="polite">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Icon aria-hidden className="size-4 text-muted-foreground" />
            {page.title}
          </h3>
          <p className="rounded-md bg-amber-100/70 p-2 text-sm leading-relaxed dark:bg-amber-500/15">{page.snippet}</p>
          <div className="space-y-1.5 pt-1" aria-hidden>
            <div className="h-2.5 w-11/12 rounded bg-muted" />
            <div className="h-2.5 w-4/5 rounded bg-muted" />
            <div className="h-2.5 w-2/3 rounded bg-muted" />
          </div>
          <p className="pt-1 text-xs text-muted-foreground">検索結果からこの箇所へジャンプしました</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-sm">
      <div className="flex items-center gap-2 border-b px-3 py-2.5">
        <Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
        <input
          role="combobox"
          aria-label="ワークスペース全体を検索"
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={ordered.length ? `${id}-${cur}` : undefined}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKey}
          placeholder="ドキュメント・メンバー・チャンネルを検索"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <kbd className="hidden rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:inline">⌘K</kbd>
      </div>
      <div id={`${id}-list`} role="listbox" aria-label="検索結果" className="max-h-64 overflow-y-auto py-1">
        {KINDS.map((k) => {
          const items = ordered.filter((d) => d.kind === k);
          if (!items.length) return null;
          return (
            <div key={k} role="group" aria-label={META[k].label}>
              <div className="px-3 pb-1 pt-2 text-[11px] font-medium text-muted-foreground">{META[k].label}</div>
              {items.map((it) => {
                const idx = ordered.indexOf(it);
                const Icon = META[k].icon;
                return (
                  <div
                    key={it.title}
                    id={`${id}-${idx}`}
                    role="option"
                    aria-selected={idx === cur}
                    onClick={() => jump(it)}
                    onMouseMove={() => setActive(idx)}
                    className={cn("mx-1 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm", idx === cur && "bg-accent text-accent-foreground")}
                  >
                    <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate">{it.title}</span>
                    {idx === cur && <CornerDownLeft aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />}
                  </div>
                );
              })}
            </div>
          );
        })}
        {ordered.length === 0 && (
          <div className="px-3 py-8 text-center">
            <p className="text-sm">「{q.trim()}」に一致する結果はありません</p>
            <p className="mt-1 text-xs text-muted-foreground">別のキーワードや表記で試してください</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-t px-3 py-1.5 text-[11px] text-muted-foreground">
        <span>↑↓ 移動 · Enter でジャンプ</span>
        <span aria-live="polite" className="tabular-nums">{ordered.length} 件</span>
      </div>
    </div>
  );
}
