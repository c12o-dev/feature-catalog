"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AtSign, Bell, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type Member = { id: string; name: string; role: string; hue: string };
const members: Member[] = [
  { id: "sato", name: "佐藤美咲", role: "デザイナー", hue: "bg-rose-500" },
  { id: "nakamura", name: "中村葵", role: "PM", hue: "bg-sky-500" },
  { id: "mori", name: "森健太", role: "エンジニア", hue: "bg-emerald-500" },
  { id: "ishida", name: "石田遼", role: "エンジニア", hue: "bg-amber-500" },
  { id: "kobayashi", name: "小林結衣", role: "QA", hue: "bg-violet-500" },
];

type Inbox = { id: number; from: string; where: string; when: string; text: string; unread: boolean };
const initialInbox: Inbox[] = [
  { id: 1, from: "中村葵", where: "#release", when: "5 分前", text: "@あなた 告知文のレビューお願いします", unread: true },
  { id: 2, from: "森健太", where: "PR #284", when: "1 時間前", text: "@あなた API の命名どう思いますか？", unread: true },
  { id: 3, from: "佐藤美咲", where: "Doc: Q4 計画", when: "昨日", text: "@あなた ここの数字を確認してください", unread: false },
];

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const mentionRe = new RegExp(`(@(?:${members.map((m) => escapeRe(m.name)).join("|")}))`, "g");

function Highlighted({ text }: { text: string }) {
  return (
    <>
      {text.split(mentionRe).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="rounded bg-primary/10 px-0.5 font-medium text-primary">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export default function MentionList() {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inbox, setInbox] = useState(initialInbox);
  const [text, setText] = useState("");
  const [caret, setCaret] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [closed, setClosed] = useState(false);
  const [pendingCaret, setPendingCaret] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [lastSent, setLastSent] = useState<string | null>(null);

  const query = useMemo(() => {
    const m = /(^|\s)@([^\s@]*)$/.exec(text.slice(0, caret));
    return m ? { q: m[2], start: caret - m[2].length - 1 } : null;
  }, [text, caret]);

  const matches = useMemo(() => {
    if (!query) return [];
    const q = query.q.toLowerCase();
    return members.filter((m) => m.name.includes(query.q) || m.id.startsWith(q));
  }, [query]);

  const open = !!query && matches.length > 0 && !closed;
  const active = Math.min(activeIdx, Math.max(0, matches.length - 1));

  useEffect(() => {
    if (pendingCaret === null) return;
    const el = inputRef.current;
    el?.focus();
    el?.setSelectionRange(pendingCaret, pendingCaret);
  }, [pendingCaret]);

  const sync = (el: HTMLInputElement) => {
    setCaret(el.selectionStart ?? el.value.length);
  };

  const pick = (m: Member) => {
    if (!query) return;
    const before = text.slice(0, query.start);
    const after = text.slice(caret);
    const insert = `@${m.name} `;
    const next = before + insert + after;
    const pos = before.length + insert.length;
    setText(next);
    setCaret(pos);
    setPendingCaret(pos);
    setActiveIdx(0);
  };

  const send = () => {
    const body = text.trim();
    if (!body) return;
    const mentioned = members.filter((m) => body.includes(`@${m.name}`)).map((m) => m.name);
    setNotice(mentioned.length ? `${mentioned.join("さん、")}さんに通知を送りました` : "送信しました（メンションなし）");
    setText("");
    setCaret(0);
    setLastSent(body);
  };

  const unreadCount = inbox.filter((i) => i.unread).length;

  return (
    <div className="mx-auto w-full max-w-md overflow-visible rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-3 py-2 text-xs">
        <span className="flex items-center gap-1.5 font-medium">
          <Bell className="size-3.5" /> メンション
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground tabular-nums">{unreadCount}</span>
          )}
        </span>
        {unreadCount > 0 && (
          <button type="button" onClick={() => setInbox((b) => b.map((i) => ({ ...i, unread: false })))} className="text-primary hover:underline">
            すべて既読
          </button>
        )}
      </div>
      <ul className="divide-y">
        {inbox.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => setInbox((b) => b.map((i) => (i.id === m.id ? { ...i, unread: false } : i)))}
              className={`flex w-full gap-2 px-3 py-2 text-left text-sm hover:bg-muted/50 ${m.unread ? "bg-primary/5" : ""}`}
            >
              <span aria-hidden className={`mt-1.5 size-2 shrink-0 rounded-full ${m.unread ? "bg-primary" : "bg-transparent"}`} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={m.unread ? "font-semibold text-foreground" : "text-foreground"}>{m.from}</span>
                  <span className="truncate">{m.where} · {m.when}</span>
                  {m.unread && <span className="ml-auto shrink-0 text-[10px] font-medium text-primary">未読</span>}
                </span>
                <span className={`mt-0.5 block ${m.unread ? "font-medium" : "text-muted-foreground"}`}>{m.text}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="border-t p-3">
        {lastSent && (
          <div className="mb-2 rounded-md bg-muted/60 px-3 py-2 text-sm">
            <span className="text-xs text-muted-foreground">あなた · 今</span>
            <p className="break-words"><Highlighted text={lastSent} /></p>
          </div>
        )}
        <form
          className="relative flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          {open && (
            <ul
              id={`${id}-list`}
              role="listbox"
              aria-label="メンバー"
              className="absolute inset-x-0 bottom-full z-10 mb-1 max-h-48 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-lg"
            >
              {matches.map((m, i) => (
                <li
                  key={m.id}
                  id={`${id}-opt-${m.id}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(m);
                  }}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm ${i === active ? "bg-muted" : ""}`}
                >
                  <span className={`grid size-6 place-items-center rounded-full text-[10px] font-semibold text-white ${m.hue}`}>{m.name[0]}</span>
                  <span className="font-medium">{m.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{m.role}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="relative min-w-0 flex-1">
            <AtSign className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              value={text}
              role="combobox"
              aria-label="メッセージ（@ でメンバーを指名）"
              aria-expanded={open}
              aria-controls={`${id}-list`}
              aria-autocomplete="list"
              aria-activedescendant={open ? `${id}-opt-${matches[active].id}` : undefined}
              placeholder="@ でメンバーを指名…"
              onChange={(e) => {
                setText(e.target.value);
                setClosed(false);
                setActiveIdx(0);
                sync(e.target);
              }}
              onSelect={(e) => sync(e.currentTarget)}
              onBlur={() => setClosed(true)}
              onFocus={() => setClosed(false)}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) {
                  if (e.key === "Enter") e.preventDefault();
                  return;
                }
                if (open) {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveIdx((active + 1) % matches.length);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveIdx((active - 1 + matches.length) % matches.length);
                  } else if (e.key === "Enter" || e.key === "Tab") {
                    e.preventDefault();
                    pick(matches[active]);
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    setClosed(true);
                  }
                }
              }}
              className="w-full rounded-md border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
          <Button type="submit" size="sm" disabled={!text.trim()} aria-label="送信">
            <Send />
          </Button>
        </form>
        <p aria-live="polite" className="mt-1.5 min-h-4 text-xs text-muted-foreground">{notice}</p>
      </div>
    </div>
  );
}
