"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NAME = "marketing-site";

export default function DestructiveModal() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [deleted, setDeleted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const ok = confirm === NAME;

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const close = () => {
    setOpen(false);
    setConfirm("");
    triggerRef.current?.focus();
  };

  return (
    <div className="relative mx-auto min-h-[300px] w-full max-w-md">
      <div className="rounded-lg border bg-card p-4">
        {deleted ? (
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm" aria-live="polite">
            <span className="text-muted-foreground">プロジェクト「{NAME}」を削除しました</span>
            <Button size="sm" variant="ghost" onClick={() => setDeleted(false)}>
              元に戻す（デモ）
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm font-medium">
              <FolderKanban className="size-4 text-muted-foreground" aria-hidden />
              {NAME}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">デプロイ 128 件 · メンバー 6 人</p>
            <div className="mt-4 rounded-md border border-red-200 bg-red-50/60 p-3 dark:border-red-900/60 dark:bg-red-950/30">
              <div className="text-sm font-medium text-red-700 dark:text-red-300">危険な操作</div>
              <p className="mt-0.5 text-xs text-muted-foreground">削除すると、すべてのデプロイと設定が失われます。</p>
              <Button ref={triggerRef} size="sm" variant="destructive" className="mt-3" onClick={() => setOpen(true)}>
                プロジェクトを削除
              </Button>
            </div>
          </>
        )}
      </div>

      {open && (
        <div
          className="absolute inset-0 z-10 grid place-items-center rounded-lg bg-black/50 p-3"
          onClick={(e) => e.target === e.currentTarget && close()}
          onKeyDown={(e) => e.key === "Escape" && close()}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="dm-title"
            aria-describedby="dm-desc"
            className="w-full max-w-sm rounded-lg border bg-popover p-4 text-popover-foreground shadow-xl"
          >
            <div className="flex gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-red-100 dark:bg-red-950/60">
                <AlertTriangle className="size-4 text-red-600 dark:text-red-400" aria-hidden />
              </span>
              <div className="min-w-0">
                <h3 id="dm-title" className="text-sm font-semibold">
                  プロジェクトを削除しますか？
                </h3>
                <p id="dm-desc" className="mt-1 text-xs text-muted-foreground">
                  この操作は取り消せません。「{NAME}」と関連するデプロイ 128 件が完全に削除されます。
                </p>
              </div>
            </div>
            <form
              className="mt-4 space-y-1.5"
              onSubmit={(e) => {
                e.preventDefault();
                if (!ok) return;
                setOpen(false);
                setConfirm("");
                setDeleted(true);
              }}
            >
              <label htmlFor="dm-confirm" className="block text-xs">
                確認のため <code className="rounded bg-muted px-1 font-mono">{NAME}</code> と入力してください
              </label>
              <Input
                id="dm-confirm"
                ref={inputRef}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                aria-describedby="dm-desc"
                className="font-mono"
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" size="sm" variant="ghost" onClick={close}>
                  キャンセル
                </Button>
                <Button type="submit" size="sm" variant="destructive" disabled={!ok}>
                  削除する
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
