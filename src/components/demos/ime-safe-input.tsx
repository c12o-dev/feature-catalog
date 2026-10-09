"use client";

import { useId, useState } from "react";
import { CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type Log = { id: number; text: string; tone: "muted" | "ok" | "warn" };

export default function ImeSafeInput() {
  const id = useId();
  const [v, setV] = useState("");
  const [safe, setSafe] = useState(true);
  const [composing, setComposing] = useState(false);
  const [sent, setSent] = useState<string[]>([]);
  const [log, setLog] = useState<Log[]>([]);

  const push = (text: string, tone: Log["tone"] = "muted") =>
    setLog((l) => [{ id: (l[0]?.id ?? 0) + 1, text, tone }, ...l].slice(0, 4));

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    // isComposing covers most browsers; keyCode 229 covers Safari, where the confirming
    // Enter's keydown arrives after compositionend with isComposing already false.
    const imeEnter = e.nativeEvent.isComposing || e.keyCode === 229;
    if (safe && imeEnter) {
      push("変換確定の Enter → 送信しない", "ok");
      return;
    }
    e.preventDefault();
    if (!v.trim()) return;
    if (imeEnter) push("変換確定の Enter で送信してしまった", "warn");
    else push("Enter → 送信", "ok");
    setSent((s) => [v, ...s].slice(0, 3));
    setV("");
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-3 rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          メッセージ
        </label>
        <div role="radiogroup" aria-label="Enter の扱い" className="flex rounded-md bg-muted p-0.5 text-xs">
          {[
            { on: true, label: "IME 考慮あり" },
            { on: false, label: "考慮なし" },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              role="radio"
              aria-checked={safe === o.on}
              tabIndex={safe === o.on ? 0 : -1}
              onClick={() => setSafe(o.on)}
              onKeyDown={(e) => {
                if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
                e.preventDefault();
                setSafe(!o.on);
                const sib = (o.on ? e.currentTarget.nextElementSibling : e.currentTarget.previousElementSibling) as HTMLElement | null;
                sib?.focus();
              }}
              className={cn("rounded px-2 py-1", safe === o.on ? "bg-background font-medium shadow-xs" : "text-muted-foreground")}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative">
        <input
          id={id}
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={onKeyDown}
          onCompositionStart={() => {
            setComposing(true);
            push("compositionstart");
          }}
          onCompositionEnd={() => {
            setComposing(false);
            push("compositionend");
          }}
          placeholder="日本語で入力して Enter"
          className="h-9 w-full rounded-md border bg-background pl-3 pr-20 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        />
        <span
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 rounded px-1.5 py-0.5 text-[10px]",
            composing ? "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200" : "text-muted-foreground",
          )}
        >
          {composing ? "変換中" : <CornerDownLeft className="size-3.5" aria-label="Enter で送信" />}
        </span>
      </div>

      <div className="grid gap-3">
        <div>
          <div className="mb-1 text-xs text-muted-foreground">イベント</div>
          <ul className="min-h-[5.5rem] space-y-0.5 rounded-md bg-muted/50 p-2 font-mono text-[11px]" aria-live="polite">
            {log.length === 0 && <li className="text-muted-foreground">まだイベントはありません</li>}
            {log.map((l) => (
              <li
                key={l.id}
                className={cn(
                  l.tone === "ok" && "text-emerald-700 dark:text-emerald-400",
                  l.tone === "warn" && "text-destructive",
                  l.tone === "muted" && "text-muted-foreground",
                )}
              >
                {l.text}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-1 text-xs text-muted-foreground">送信済み</div>
          <ul className="space-y-1">
            {sent.length === 0 && <li className="text-xs text-muted-foreground">—</li>}
            {sent.map((s, i) => (
              <li key={`${s}-${i}`} className="truncate rounded-md border bg-background px-3 py-1.5 text-sm">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
