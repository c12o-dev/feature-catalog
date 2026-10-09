"use client";

import { useState, useSyncExternalStore } from "react";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const KEY = "demo-form-restore";
const EVENT = "demo-form-restore-change";

function read() {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}
function write(v: string) {
  try {
    if (v) localStorage.setItem(KEY, v);
    else localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}
function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

export default function FormRestore() {
  // 保存値はクライアントでのみ読む（サーバー/初回ハイドレーションは空文字）
  const stored = useSyncExternalStore(subscribe, read, () => "");
  const [draft, setDraft] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const value = draft ?? stored;
  const restored = draft === null && stored !== "" && !dismissed;

  return (
    <div className="mx-auto w-full max-w-md space-y-2">
      <div aria-live="polite">
        {restored && (
          <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/60 px-2.5 py-1.5 text-xs">
            <span className="flex items-center gap-1.5">
              <History className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
              前回の入力を復元しました
            </span>
            <button type="button" onClick={() => setDismissed(true)} className="text-muted-foreground underline underline-offset-2">
              閉じる
            </button>
          </div>
        )}
      </div>
      <label htmlFor="fr-text" className="text-sm font-medium">
        お問い合わせ内容
      </label>
      <Textarea
        id="fr-text"
        value={value}
        onChange={(e) => {
          setDraft(e.target.value);
          write(e.target.value);
        }}
        placeholder="何か入力してから「リセット」やページ再読み込みを試してください"
        rows={3}
      />
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">入力はこのブラウザに自動で一時保存されます</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setDraft("");
            write("");
          }}
        >
          クリア
        </Button>
      </div>
    </div>
  );
}
