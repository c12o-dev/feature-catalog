"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

const options = [
  { label: "TypeScript", v: 412 },
  { label: "JavaScript", v: 280 },
  { label: "Python", v: 220 },
  { label: "Go", v: 88 },
];

export default function Poll() {
  const name = useId();
  const [choice, setChoice] = useState<number | null>(null);
  const [voted, setVoted] = useState<number | null>(null);
  const total = options.reduce((s, o) => s + o.v, 0) + (voted !== null ? 1 : 0);
  const showResult = voted !== null;

  return (
    <form
      className="mx-auto w-full max-w-sm space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (choice !== null) setVoted(choice);
      }}
    >
      <fieldset className="space-y-1.5" disabled={showResult}>
        <legend className="mb-2 text-sm font-medium">いちばん使っている言語は？</legend>
        {options.map((o, i) => {
          const v = o.v + (voted === i ? 1 : 0);
          const pct = (v / total) * 100;
          return (
            <label
              key={o.label}
              className={cn(
                "relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-md border bg-background px-3 py-2 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                (showResult ? voted === i : choice === i) && "border-primary",
                showResult && "cursor-default",
              )}
            >
              {showResult && (
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 origin-left bg-primary/10 transition-transform duration-500"
                  style={{ width: "100%", transform: `scaleX(${pct / 100})` }}
                />
              )}
              <input
                type="radio"
                name={name}
                value={i}
                checked={choice === i}
                onChange={() => setChoice(i)}
                className="relative accent-primary"
              />
              <span className="relative flex-1">{o.label}</span>
              {showResult && (
                <span className="relative text-xs text-muted-foreground tabular-nums">{pct.toFixed(0)}%</span>
              )}
            </label>
          );
        })}
      </fieldset>
      <div className="flex items-center justify-between gap-2">
        <span aria-live="polite" className="text-xs text-muted-foreground tabular-nums">
          {showResult ? `投票しました · 合計 ${total.toLocaleString()} 票` : `${total.toLocaleString()} 票`}
        </span>
        {showResult ? (
          <button
            type="button"
            onClick={() => {
              setVoted(null);
              setChoice(null);
            }}
            className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
          >
            投票を取り消す
          </button>
        ) : (
          <button
            type="submit"
            disabled={choice === null}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
          >
            投票する
          </button>
        )}
      </div>
    </form>
  );
}
