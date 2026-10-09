"use client";

import { useId, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

/** Mock "model": completions keyed by what the user has typed so far. */
const COMPLETIONS = [
  "お世話になっております。先日はお打ち合わせのお時間をいただき、ありがとうございました。",
  "お世話になっております。ご依頼いただいた見積書を添付いたしますので、ご確認ください。",
  "本日の議事録を共有します。次回までの宿題は、デザイン案の修正と工数の見積もりです。",
  "本日の進捗です。ログイン画面の実装が完了し、明日からレビューに入ります。",
  "ご確認のほど、よろしくお願いいたします。",
];

const START = "お世話になっております。先日は";

function suggestFor(text: string) {
  if (text.trim().length < 2) return "";
  // complete the current sentence: look at the text after the last 。
  const cut = text.lastIndexOf("。") + 1;
  const head = text.slice(0, cut);
  const tail = text.slice(cut);
  for (const c of COMPLETIONS) {
    if (c.startsWith(text) && c.length > text.length) return c.slice(text.length);
  }
  if (tail.length === 0 && head.length > 0 && !text.endsWith(COMPLETIONS[4])) return COMPLETIONS[4];
  for (const c of COMPLETIONS) {
    if (tail.length >= 1 && c.startsWith(tail) && c.length > tail.length) return c.slice(tail.length);
  }
  return "";
}

export default function InlineAi() {
  const id = useId();
  const [text, setText] = useState(START);
  const [dismissed, setDismissed] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(0);
  const ref = useRef<HTMLTextAreaElement>(null);

  const raw = suggestFor(text);
  const suggestion = dismissed === text ? "" : raw;

  const accept = () => {
    if (!suggestion) return;
    setText(text + suggestion);
    setAccepted((n) => n + 1);
    setDismissed(null);
    ref.current?.focus();
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={`${id}-ta`} className="text-xs font-medium">
          メール本文
        </label>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Sparkles className="size-3 text-violet-600 dark:text-violet-400" aria-hidden />
          AI 補完 オン
        </span>
      </div>

      <div className="relative rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring/50">
        {/* mirror layer: typed text (invisible) + ghost suggestion */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden p-3 text-sm leading-relaxed break-words whitespace-pre-wrap"
        >
          <span className="text-transparent">{text}</span>
          <span className="text-muted-foreground/60">{suggestion}</span>
          {suggestion && (
            <kbd className="ml-1 rounded border bg-muted px-1 py-px align-middle font-sans text-[10px] text-muted-foreground">
              Tab
            </kbd>
          )}
        </div>
        <textarea
          ref={ref}
          id={`${id}-ta`}
          value={text}
          rows={5}
          aria-describedby={`${id}-hint ${id}-live`}
          onChange={(e) => {
            setText(e.target.value);
            setDismissed(null);
          }}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === "Tab" && !e.shiftKey && suggestion) {
              e.preventDefault();
              accept();
            } else if (e.key === "Escape" && suggestion) {
              e.preventDefault();
              setDismissed(text);
            }
          }}
          className="relative block w-full resize-none bg-transparent p-3 text-sm leading-relaxed break-words caret-foreground outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          Tab で採用 / Esc で却下 / そのまま入力で無視
        </p>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={accept}
            disabled={!suggestion}
            className="h-7 rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground disabled:opacity-40"
          >
            採用
          </button>
          <button
            type="button"
            onClick={() => {
              setText(START);
              setDismissed(null);
              setAccepted(0);
            }}
            className="h-7 rounded-md border px-2.5 text-xs font-medium hover:bg-muted"
          >
            リセット
          </button>
        </div>
      </div>
      <p id={`${id}-live`} aria-live="polite" className="sr-only">
        {suggestion ? `提案: ${suggestion}` : accepted ? `提案を ${accepted} 回採用しました` : ""}
      </p>
    </div>
  );
}
