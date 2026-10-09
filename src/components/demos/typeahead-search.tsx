"use client";

import { useId, useState } from "react";
import { FileText, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { title: "TypeScript の型推論入門", section: "ガイド" },
  { title: "Type alias と interface の違い", section: "リファレンス" },
  { title: "型パラメータ (type parameter)", section: "リファレンス" },
  { title: "タプル型の使いどころ", section: "ガイド" },
  { title: "テーブルのソートとフィルタ", section: "コンポーネント" },
  { title: "テーマ切替の実装", section: "レシピ" },
  { title: "トースト通知の設計", section: "コンポーネント" },
  { title: "Tailwind v4 への移行", section: "レシピ" },
];

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const lower = text.toLowerCase();
  const needle = q.toLowerCase();
  const out: React.ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (i < text.length) {
    const at = lower.indexOf(needle, i);
    if (at === -1) {
      out.push(text.slice(i));
      break;
    }
    if (at > i) out.push(text.slice(i, at));
    out.push(
      <mark key={k++} className="rounded-sm bg-amber-200/70 text-foreground dark:bg-amber-500/30">
        {text.slice(at, at + needle.length)}
      </mark>,
    );
    i = at + needle.length;
  }
  return <>{out}</>;
}

export default function TypeaheadSearch() {
  const id = useId();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const trimmed = q.trim();
  const filtered = trimmed ? ITEMS.filter((i) => i.title.toLowerCase().includes(trimmed.toLowerCase())) : [];
  const expanded = open && trimmed.length > 0;

  const choose = (title: string) => {
    setQ(title);
    setPicked(title);
    setOpen(false);
    setActive(-1);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      if (filtered.length) setActive((a) => (a + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filtered.length) setActive((a) => (a <= 0 ? filtered.length - 1 : a - 1));
    } else if (e.key === "Enter" && active >= 0 && filtered[active]) {
      e.preventDefault();
      choose(filtered[active].title);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-2">
      <label htmlFor={`${id}-input`} className="text-xs font-medium text-muted-foreground">
        ドキュメントを検索
      </label>
      <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring/50">
        <Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
        <input
          id={`${id}-input`}
          role="combobox"
          aria-expanded={expanded}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={expanded && active >= 0 ? `${id}-opt-${active}` : undefined}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(-1);
            setPicked(null);
          }}
          onKeyDown={onKey}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          placeholder="例: type, テ"
        />
      </div>
      <div id={`${id}-list`} role="listbox" aria-label="検索候補" hidden={!expanded} className="overflow-hidden rounded-md border bg-popover shadow-sm">
        {filtered.map((item, i) => (
          <div
            key={item.title}
            id={`${id}-opt-${i}`}
            role="option"
            aria-selected={i === active}
            onMouseDown={(e) => {
              e.preventDefault();
              choose(item.title);
            }}
            onMouseMove={() => setActive(i)}
            className={cn("flex cursor-pointer items-center gap-2 px-3 py-2 text-sm", i === active && "bg-accent text-accent-foreground")}
          >
            <FileText aria-hidden className="size-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate">
              <Highlight text={item.title} q={trimmed} />
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">{item.section}</span>
          </div>
        ))}
        {expanded && filtered.length === 0 && <p className="px-3 py-3 text-sm text-muted-foreground">「{trimmed}」に一致する候補はありません</p>}
      </div>
      <p aria-live="polite" className="text-xs text-muted-foreground tabular-nums">
        {picked ? `「${picked}」を開きます` : expanded ? `${filtered.length} 件の候補` : "入力するとすぐに候補が表示されます"}
      </p>
    </div>
  );
}
