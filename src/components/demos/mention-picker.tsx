"use client";

import { useId, useRef, useState } from "react";

const USERS = [
  { handle: "misaki", name: "佐藤 美咲", role: "デザイン" },
  { handle: "ren", name: "田中 蓮", role: "フロントエンド" },
  { handle: "aoi", name: "鈴木 葵", role: "PM" },
  { handle: "minato", name: "高橋 湊", role: "バックエンド" },
  { handle: "yui", name: "伊藤 結衣", role: "QA" },
  { handle: "riku", name: "渡辺 陸", role: "インフラ" },
];
const HUES = ["bg-rose-500", "bg-sky-500", "bg-amber-500", "bg-emerald-500", "bg-violet-500", "bg-slate-500"];

function queryAt(text: string, caret: number) {
  const m = text.slice(0, caret).match(/(^|\s)@([\w]*)$/);
  return m ? { q: m[2].toLowerCase(), start: caret - m[2].length - 1 } : null;
}

function renderWithMentions(text: string) {
  return text.split(/(@\w+)/g).map((part, i) =>
    /^@\w+$/.test(part) && USERS.some((u) => "@" + u.handle === part) ? (
      <span key={i} className="rounded bg-sky-100 px-0.5 font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function MentionPicker() {
  const [value, setValue] = useState("デザインレビューお願いします ");
  const [caret, setCaret] = useState(value.length);
  const [active, setActive] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listId = useId();
  const inputId = useId();

  const match = queryAt(value, caret);
  const suggestions = match
    ? USERS.filter((u) => u.handle.startsWith(match.q) || u.name.includes(match.q)).slice(0, 5)
    : [];
  const open = !dismissed && suggestions.length > 0;
  const activeIdx = Math.min(active, Math.max(0, suggestions.length - 1));

  const update = (el: HTMLInputElement) => {
    setValue(el.value);
    setCaret(el.selectionStart ?? el.value.length);
    setActive(0);
    setDismissed(false);
  };

  const pick = (handle: string) => {
    if (!match) return;
    const before = value.slice(0, match.start) + "@" + handle + " ";
    const next = before + value.slice(caret);
    setValue(next);
    setCaret(before.length);
    setActive(0);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(before.length, before.length);
      }
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || e.nativeEvent.isComposing) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((activeIdx + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((activeIdx - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      pick(suggestions[activeIdx].handle);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setDismissed(true);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="text-xs font-medium">
          コメント
        </label>
        <div className="relative">
          <input
            id={inputId}
            ref={inputRef}
            value={value}
            onChange={(e) => update(e.currentTarget)}
            onSelect={(e) => setCaret(e.currentTarget.selectionStart ?? 0)}
            onKeyDown={onKeyDown}
            onBlur={() => setDismissed(true)}
            onFocus={() => setDismissed(false)}
            placeholder="@ でメンバーをメンション"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open ? `${listId}-${activeIdx}` : undefined}
            autoComplete="off"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <ul
            id={listId}
            role="listbox"
            aria-label="メンション候補"
            hidden={!open}
            className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md sm:right-auto sm:min-w-64"
          >
            {suggestions.map((u, i) => {
              const hue = HUES[USERS.indexOf(u) % HUES.length];
              return (
                <li
                  key={u.handle}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === activeIdx}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(u.handle);
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={`flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm ${
                    i === activeIdx ? "bg-muted" : ""
                  }`}
                >
                  <span className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-medium text-white ${hue}`}>
                    {u.name[0]}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {u.name} <span className="text-muted-foreground">@{u.handle}</span>
                  </span>
                  <span className="hidden text-xs text-muted-foreground sm:inline">{u.role}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">↑↓ で選択、Enter で確定、Esc で閉じる</p>
      </div>
      <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
        <div className="mb-1 text-xs text-muted-foreground">プレビュー</div>
        <p className="break-words">{value ? renderWithMentions(value) : <span className="text-muted-foreground">（空）</span>}</p>
      </div>
      <div className="sr-only" aria-live="polite">
        {open ? `${suggestions.length} 件の候補` : ""}
      </div>
    </div>
  );
}
