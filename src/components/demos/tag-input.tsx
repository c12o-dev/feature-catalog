"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGEST = ["デザイン", "フロントエンド", "アクセシビリティ", "パフォーマンス"];

export default function TagInput() {
  const [tags, setTags] = useState(["TypeScript", "React"]);
  const [v, setV] = useState("");
  const [dupe, setDupe] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const add = (raw: string) => {
    const t = raw.replace(/[,、]/g, "").trim();
    if (!t) return;
    if (tags.some((x) => x.toLowerCase() === t.toLowerCase())) {
      setDupe(tags.find((x) => x.toLowerCase() === t.toLowerCase()) ?? t);
      setStatus(`「${t}」はすでに追加されています`);
      return;
    }
    setTags((prev) => [...prev, t]);
    setV("");
    setDupe(null);
    setStatus(`「${t}」を追加しました`);
  };

  const remove = (t: string) => {
    setTags((prev) => prev.filter((x) => x !== t));
    setStatus(`「${t}」を削除しました`);
    inputRef.current?.focus();
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(v);
    } else if (e.key === "Backspace" && !v && tags.length) {
      remove(tags[tags.length - 1]);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-2">
      <label htmlFor="tag-input-field" className="text-xs font-medium">
        スキル
      </label>
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex min-h-10 cursor-text flex-wrap items-center gap-1.5 rounded-md border bg-background p-1.5 focus-within:ring-2 focus-within:ring-ring/50"
      >
        {tags.map((t) => (
          <span
            key={t}
            className={cn(
              "inline-flex items-center gap-1 rounded-md bg-muted py-0.5 pr-1 pl-2 text-xs font-medium transition-colors",
              dupe === t && "bg-amber-100 text-amber-900 ring-1 ring-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:ring-amber-800",
            )}
          >
            {t}
            <button
              type="button"
              aria-label={`${t} を削除`}
              onClick={(e) => {
                e.stopPropagation();
                remove(t);
              }}
              className="grid size-4 place-items-center rounded-sm text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id="tag-input-field"
          value={v}
          onChange={(e) => {
            setV(e.target.value);
            setDupe(null);
          }}
          onKeyDown={onKey}
          placeholder={tags.length ? "" : "Enter で追加"}
          className="min-w-24 flex-1 bg-transparent px-1 py-0.5 text-sm outline-none"
        />
      </div>
      <p className="text-xs text-muted-foreground">Enter またはカンマで追加、Backspace で直前のタグを削除</p>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-muted-foreground">候補:</span>
        {SUGGEST.filter((s) => !tags.includes(s)).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => add(s)}
            className="rounded-full border border-dashed px-2 py-0.5 text-xs text-muted-foreground hover:border-solid hover:bg-muted hover:text-foreground"
          >
            + {s}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        {status}
      </p>
    </div>
  );
}
