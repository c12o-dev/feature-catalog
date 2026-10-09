"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, GitBranch, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

type Msg = { id: string; parent: string | null; role: "user" | "ai"; text: string };

const seed: Msg[] = [
  { id: "u1", parent: null, role: "user", text: "Tailwind v4 でダークモードを切り替えたい" },
  { id: "a1", parent: "u1", role: "ai", text: "@custom-variant dark で、クラスやデータ属性に追従する variant を定義できます。" },
  { id: "u2", parent: "a1", role: "user", text: "data-theme 属性で切り替える例は？" },
  { id: "a2", parent: "u2", role: "ai", text: "@custom-variant dark (&:where([data-theme=dark] *)); と書けば dark: が属性に追従します。" },
  { id: "u3", parent: "a1", role: "user", text: "OS 設定に合わせるだけなら？" },
  { id: "a3", parent: "u3", role: "ai", text: "何も定義しなければ prefers-color-scheme が既定です。variant の追加は不要です。" },
];

const replies = [
  "観点を変えると、CSS 変数をテーマごとに上書きする方法もあります。",
  "その条件なら、まず小さな例で挙動を確かめるのが確実です。",
  "別案として、ルート要素にクラスを付ける方式も選べます。",
];

const childrenOf = (msgs: Msg[], id: string | null) => msgs.filter((m) => m.parent === id);
const leafFrom = (msgs: Msg[], id: string): string => {
  const kids = childrenOf(msgs, id);
  return kids.length ? leafFrom(msgs, kids[kids.length - 1].id) : id;
};

export default function ChatHistory() {
  const [msgs, setMsgs] = useState(seed);
  const [leaf, setLeaf] = useState("a2");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const byId = useMemo(() => Object.fromEntries(msgs.map((m) => [m.id, m])), [msgs]);
  const path = useMemo(() => {
    const p: Msg[] = [];
    let cur: Msg | undefined = byId[leaf];
    while (cur) { p.unshift(cur); cur = cur.parent ? byId[cur.parent] : undefined; }
    return p;
  }, [byId, leaf]);
  const onPath = new Set(path.map((m) => m.id));

  const switchSibling = (m: Msg, dir: -1 | 1) => {
    const sibs = childrenOf(msgs, m.parent);
    const i = sibs.findIndex((s) => s.id === m.id);
    const next = sibs[(i + dir + sibs.length) % sibs.length];
    setLeaf(leafFrom(msgs, next.id));
  };

  const fork = (m: Msg) => {
    const text = draft.trim();
    if (!text) return;
    const n = msgs.filter((x) => x.role === "user").length;
    const uid = `u${n + 1}x`, aid = `a${n + 1}x`;
    setMsgs([...msgs, { id: uid, parent: m.parent, role: "user", text }, { id: aid, parent: uid, role: "ai", text: replies[n % replies.length] }]);
    setLeaf(aid);
    setEditing(null);
  };

  const renderTree = (parent: string | null, depth: number): React.ReactNode =>
    childrenOf(msgs, parent).map((m) =>
      m.role === "ai" ? renderTree(m.id, depth) : (
        <li key={m.id}>
          <button
            onClick={() => setLeaf(leafFrom(msgs, m.id))}
            aria-current={onPath.has(m.id) ? "true" : undefined}
            className={`flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-xs hover:bg-accent ${onPath.has(m.id) ? "bg-accent font-medium" : "text-muted-foreground"}`}
            style={{ paddingLeft: 6 + depth * 12 }}
          >
            {depth > 0 ? <GitBranch className="size-3 shrink-0" aria-hidden /> : <MessageSquare className="size-3 shrink-0" aria-hidden />}
            <span className="truncate">{m.text}</span>
          </button>
          <ul>{renderTree(m.id, depth + 1)}</ul>
        </li>
      ),
    );

  return (
    <div className="grid overflow-hidden rounded-lg border bg-background sm:grid-cols-[200px_1fr]">
      <nav aria-label="会話ツリー" className="border-b bg-muted/30 p-2 sm:border-r sm:border-b-0">
        <div className="mb-1 px-1.5 text-xs font-medium">会話ツリー</div>
        <ul>{renderTree(null, 0)}</ul>
      </nav>
      <div className="space-y-3 p-3">
        {path.map((m) => {
          const sibs = childrenOf(msgs, m.parent);
          const idx = sibs.findIndex((s) => s.id === m.id);
          if (m.role === "ai") return (
            <div key={m.id} className="max-w-[90%] rounded-lg bg-muted px-3 py-2 text-sm">{m.text}</div>
          );
          return (
            <div key={m.id} className="flex flex-col items-end gap-1">
              {editing === m.id ? (
                <div className="w-full max-w-[90%] space-y-1.5">
                  <label htmlFor={`fork-${m.id}`} className="sr-only">分岐させる質問</label>
                  <textarea
                    id={`fork-${m.id}`}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); fork(m); } }}
                    rows={2}
                    className="w-full resize-none rounded-md border bg-background px-2 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <div className="flex justify-end gap-1.5">
                    <Button size="xs" variant="ghost" onClick={() => setEditing(null)}>キャンセル</Button>
                    <Button size="xs" onClick={() => fork(m)} disabled={!draft.trim()}>新しい分岐で送信</Button>
                  </div>
                </div>
              ) : (
                <div className="max-w-[90%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">{m.text}</div>
              )}
              {editing !== m.id && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {sibs.length > 1 && (
                    <span className="flex items-center">
                      <button aria-label="前の分岐" onClick={() => switchSibling(m, -1)} className="grid size-6 place-items-center rounded hover:bg-accent"><ChevronLeft className="size-3.5" /></button>
                      <span className="tabular-nums">{idx + 1}/{sibs.length}</span>
                      <button aria-label="次の分岐" onClick={() => switchSibling(m, 1)} className="grid size-6 place-items-center rounded hover:bg-accent"><ChevronRight className="size-3.5" /></button>
                    </span>
                  )}
                  <button onClick={() => { setEditing(m.id); setDraft(m.text); }} className="flex items-center gap-1 rounded px-1.5 py-1 hover:bg-accent hover:text-foreground">
                    <GitBranch className="size-3" aria-hidden />ここから分岐
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
