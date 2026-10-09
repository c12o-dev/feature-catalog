"use client";

import { useId, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const TAGS = ["react", "react-native", "redux", "remix", "rust", "ruby", "typescript", "tailwindcss", "testing", "node", "next.js", "nuxt", "vue", "vite", "vitest", "svelte", "go", "graphql"];

export default function Autocomplete() {
  const id = useId();
  const [v, setV] = useState("");
  const [tags, setTags] = useState<string[]>(["typescript"]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const q = v.trim().toLowerCase();
  const matches = q ? TAGS.filter((t) => t.startsWith(q) && !tags.includes(t)).slice(0, 6) : [];
  const expanded = open && matches.length > 0;

  const add = (t: string) => {
    if (!tags.includes(t)) setTags([...tags, t]);
    setV("");
    setActive(0);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      if (matches.length) setActive((a) => (a + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (matches.length) setActive((a) => (a - 1 + matches.length) % matches.length);
    } else if ((e.key === "Enter" || e.key === "Tab") && expanded) {
      e.preventDefault();
      add(matches[Math.min(active, matches.length - 1)]);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Backspace" && v === "" && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-1.5">
      <label htmlFor={`${id}-input`} className="text-sm font-medium">
        技術タグ
      </label>
      <div className="relative">
        <div className="flex min-h-9 flex-wrap items-center gap-1 rounded-md border bg-background px-2 py-1 focus-within:ring-2 focus-within:ring-ring/50">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-0.5 rounded bg-muted py-0.5 pl-1.5 pr-0.5 text-xs">
              {t}
              <button type="button" aria-label={`${t} を削除`} onClick={() => setTags(tags.filter((x) => x !== t))} className="rounded p-0.5 text-muted-foreground hover:bg-background hover:text-foreground">
                <X className="size-3" />
              </button>
            </span>
          ))}
          <input
            id={`${id}-input`}
            role="combobox"
            aria-expanded={expanded}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-activedescendant={expanded ? `${id}-opt-${Math.min(active, matches.length - 1)}` : undefined}
            aria-describedby={`${id}-hint`}
            value={v}
            onChange={(e) => {
              setV(e.target.value);
              setOpen(true);
              setActive(0);
            }}
            onKeyDown={onKey}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            autoComplete="off"
            placeholder={tags.length ? "" : "例: re"}
            className="h-7 min-w-[6rem] flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <ul id={`${id}-list`} role="listbox" aria-label="タグ候補" hidden={!expanded} className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-md border bg-popover py-1 text-popover-foreground shadow-md">
          {matches.map((m, i) => (
            <li
              key={m}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                add(m);
              }}
              onMouseMove={() => setActive(i)}
              className={cn("cursor-pointer px-3 py-1.5 text-sm", i === active && "bg-accent text-accent-foreground")}
            >
              <span className="font-medium">{m.slice(0, q.length)}</span>
              <span className="text-muted-foreground">{m.slice(q.length)}</span>
            </li>
          ))}
        </ul>
      </div>
      <p id={`${id}-hint`} className="text-xs text-muted-foreground">
        ↑↓ で選択、Enter で追加、空欄で Backspace すると最後のタグを削除
      </p>
      <p aria-live="polite" className="sr-only">
        {expanded ? `${matches.length} 件の候補` : ""}
      </p>
    </div>
  );
}
