"use client";

import { useId, useState } from "react";
import { CornerDownLeft } from "lucide-react";

const COMPLETIONS = [
  "return users.filter((u) => u.active);",
  "return users.map((u) => u.name);",
  "const total = items.reduce((sum, x) => sum + x.price, 0);",
  "const active = users.filter((u) => u.active);",
  "if (!users.length) return [];",
  "for (const user of users) {",
  "console.log(total);",
  "function formatPrice(n) {",
];

const INITIAL = "function activeUsers(users) {\n  if (!u";

function suggest(text: string) {
  const line = text.slice(text.lastIndexOf("\n") + 1);
  const typed = line.trimStart();
  if (!typed) return "";
  const hit = COMPLETIONS.find((c) => c.startsWith(typed) && c.length > typed.length);
  return hit ? hit.slice(typed.length) : "";
}

// Both layers share the exact same box model so the ghost text lines up.
const LAYER =
  "m-0 rounded-md border p-3 font-mono text-xs leading-5 whitespace-pre-wrap break-words";

export default function GhostText() {
  const [code, setCode] = useState(INITIAL);
  const [caretAtEnd, setCaretAtEnd] = useState(true);
  const [accepted, setAccepted] = useState(0);
  const id = useId();
  const ghost = caretAtEnd ? suggest(code) : "";

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab" && !e.shiftKey && ghost && !e.nativeEvent.isComposing) {
      e.preventDefault();
      setCode((c) => c + ghost);
      setAccepted((n) => n + 1);
    }
  };

  const syncCaret = (el: HTMLTextAreaElement) =>
    setCaretAtEnd(el.selectionStart === el.value.length && el.selectionEnd === el.value.length);

  return (
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-lg border bg-card">
      <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-1.5">
        <label htmlFor={id} className="font-mono text-xs text-muted-foreground">
          users.js<span className="sr-only">（コードエディタ）</span>
        </label>
        <span className="text-xs text-muted-foreground tabular-nums">確定 {accepted} 回</span>
      </div>
      <div className="relative p-2">
        <pre aria-hidden className={`${LAYER} pointer-events-none absolute inset-2 border-transparent`}>
          <span className="text-transparent">{code}</span>
          <span className="text-muted-foreground/60">{ghost}</span>
        </pre>
        <textarea
          id={id}
          aria-describedby={`${id}-hint`}
          value={code}
          spellCheck={false}
          onChange={(e) => {
            setCode(e.target.value);
            syncCaret(e.target);
          }}
          onSelect={(e) => syncCaret(e.currentTarget)}
          onKeyDown={onKey}
          rows={7}
          className={`${LAYER} relative block w-full resize-none overflow-hidden border-transparent bg-transparent text-foreground caret-foreground outline-none focus-visible:border-ring`}
        />
      </div>
      <div className="flex items-center gap-2 border-t px-3 py-2 text-xs text-muted-foreground" id={`${id}-hint`}>
        {ghost ? (
          <>
            <kbd className="inline-flex items-center gap-1 rounded border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
              Tab <CornerDownLeft className="size-3" />
            </kbd>
            候補を確定
          </>
        ) : (
          <span>改行して「ret」「const」「for」などと打つと候補が出ます</span>
        )}
      </div>
    </div>
  );
}
