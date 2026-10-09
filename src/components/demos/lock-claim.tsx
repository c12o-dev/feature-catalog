"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Lock, LockOpen, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

type Holder = "none" | "me" | "other";
type Note = { tone: "info" | "warn" | "ok"; text: string } | null;

const OTHER = "佐藤 健太";

export default function LockClaim() {
  const [holder, setHolder] = useState<Holder>("other");
  const [note, setNote] = useState<Note>(null);
  const [requesting, setRequesting] = useState(false);
  const [body, setBody] = useState("## 決済フローの変更点\n- 3D セキュア対応\n- リトライ上限を 3 回に変更");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const claim = () => {
    if (holder === "none") {
      setHolder("me");
      setNote({ tone: "ok", text: "編集権を取得しました。他のメンバーは閲覧のみになります" });
    } else if (holder === "other") {
      setNote({ tone: "warn", text: `${OTHER}さんが編集中のため取得できませんでした` });
    }
  };

  const requestRelease = () => {
    setRequesting(true);
    setNote({ tone: "info", text: `${OTHER}さんに解放をリクエストしました…` });
    timer.current = setTimeout(() => {
      setRequesting(false);
      setHolder("me");
      setNote({ tone: "ok", text: `${OTHER}さんが編集権を解放し、あなたに移りました` });
    }, 1800);
  };

  const release = () => {
    setHolder("none");
    setNote({ tone: "info", text: "編集権を解放しました" });
  };

  const otherTries = () => {
    if (holder === "me") {
      setNote({ tone: "info", text: `${OTHER}さんが取得を試みましたが、あなたが保持中のため閲覧のみで開きました` });
    } else {
      setHolder("other");
      setNote({ tone: "info", text: `${OTHER}さんが編集権を取得しました` });
    }
  };

  const status = {
    none: { icon: LockOpen, text: "誰も編集していません", cls: "text-muted-foreground" },
    me: { icon: Lock, text: "あなたが編集中", cls: "text-emerald-700 dark:text-emerald-400" },
    other: { icon: Lock, text: `${OTHER}さんが編集中（5 分前から）`, cls: "text-amber-700 dark:text-amber-400" },
  }[holder];
  const StatusIcon = status.icon;

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
          <div className="text-sm font-medium">設計ドキュメント</div>
          <div className={cn("flex items-center gap-1.5 text-xs font-medium", status.cls)}>
            {holder === "other" ? (
              <span className="grid size-5 place-items-center rounded-full bg-amber-100 dark:bg-amber-950">
                <UserRound className="size-3" aria-hidden />
              </span>
            ) : (
              <StatusIcon className="size-3.5" aria-hidden />
            )}
            {status.text}
          </div>
        </div>
        <label htmlFor="lock-claim-body" className="sr-only">
          本文
        </label>
        <textarea
          id="lock-claim-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          readOnly={holder !== "me"}
          rows={4}
          className={cn(
            "block w-full resize-none bg-transparent px-3 py-2 font-mono text-xs leading-relaxed outline-none",
            holder !== "me" && "cursor-not-allowed text-muted-foreground",
          )}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {holder !== "me" ? (
          <button
            type="button"
            onClick={claim}
            disabled={requesting}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground disabled:opacity-50"
          >
            <Lock className="size-3.5" aria-hidden />
            編集権を取得
          </button>
        ) : (
          <button
            type="button"
            onClick={release}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium hover:bg-muted"
          >
            <LockOpen className="size-3.5" aria-hidden />
            編集権を解放
          </button>
        )}
        {holder === "other" && (
          <button
            type="button"
            onClick={requestRelease}
            disabled={requesting}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium hover:bg-muted disabled:opacity-60"
          >
            {requesting && <Loader2 className="size-3.5 motion-safe:animate-spin" aria-hidden />}
            解放をリクエスト
          </button>
        )}
        <button
          type="button"
          onClick={otherTries}
          disabled={requesting || holder === "other"}
          className="inline-flex h-8 items-center rounded-md px-3 text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
        >
          {OTHER.split(" ")[0]}さんが取得を試みる
        </button>
      </div>

      <p
        aria-live="polite"
        className={cn(
          "min-h-8 rounded-md px-3 py-2 text-xs",
          note?.tone === "warn" && "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
          note?.tone === "ok" && "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
          note?.tone === "info" && "bg-muted text-muted-foreground",
          !note && "text-muted-foreground",
        )}
      >
        {note?.text ?? "編集できるのは同時に 1 人だけです。取得すると他の人は閲覧のみになります"}
      </p>
    </div>
  );
}
