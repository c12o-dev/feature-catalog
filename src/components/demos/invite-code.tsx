"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, Check, Loader2, X } from "lucide-react";

// Mocked server-side lookup table.
const CODES: Record<string, { from: string; reward: string }> = {
  WELCOME2026: { from: "キャンペーン", reward: "初月 50% オフ" },
  HANAKO7K3: { from: "佐藤 花子 さんの紹介", reward: "双方に 1,000 ポイント" },
};
const FORMAT = /^[A-Z0-9]{6,12}$/;

type State =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "error"; msg: string }
  | { kind: "applied"; code: string; from: string; reward: string };

export default function InviteCode() {
  const id = useId();
  const [code, setCode] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const apply = () => {
    const c = code.trim();
    if (!c) return;
    if (!FORMAT.test(c)) {
      setState({ kind: "error", msg: "コードは英数字 6〜12 文字です" });
      return;
    }
    setState({ kind: "checking" });
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const hit = CODES[c];
      setState(hit ? { kind: "applied", code: c, ...hit } : { kind: "error", msg: "このコードは無効か、有効期限が切れています" });
    }, 600);
  };

  const remove = () => {
    setState({ kind: "idle" });
    setCode("");
  };

  const errorId = `${id}-err`;

  return (
    <div className="w-full max-w-md space-y-2">
      <Label htmlFor={`${id}-code`} className="flex items-center gap-1.5">
        <Gift className="size-4 text-muted-foreground" aria-hidden />
        紹介コード（任意）
      </Label>

      {state.kind === "applied" ? (
        <div className="flex items-start gap-3 rounded-md border border-emerald-600/30 bg-emerald-50 px-3 py-2 dark:border-emerald-400/30 dark:bg-emerald-500/10">
          <Check className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
          <div className="min-w-0 flex-1 text-sm">
            <div className="font-mono font-medium">{state.code}</div>
            <div className="text-xs text-muted-foreground">
              {state.from} · {state.reward}
            </div>
          </div>
          <button type="button" onClick={remove} aria-label="紹介コードを取り消す" className="rounded p-0.5 text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            apply();
          }}
        >
          <Input
            id={`${id}-code`}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase().replace(/\s/g, ""));
              if (state.kind === "error") setState({ kind: "idle" });
            }}
            placeholder="例: WELCOME2026"
            aria-invalid={state.kind === "error"}
            aria-describedby={errorId}
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 font-mono uppercase"
          />
          <Button type="submit" variant="outline" disabled={!code || state.kind === "checking"}>
            {state.kind === "checking" ? <Loader2 className="size-4 motion-safe:animate-spin" aria-hidden /> : null}
            適用
          </Button>
        </form>
      )}

      <p id={errorId} aria-live="polite" className="min-h-4 text-xs">
        {state.kind === "error" ? (
          <span className="text-destructive">{state.msg}</span>
        ) : state.kind === "applied" ? (
          <span className="text-emerald-700 dark:text-emerald-400">紹介コードを適用しました</span>
        ) : (
          <span className="text-muted-foreground">試す: WELCOME2026 / HANAKO7K3</span>
        )}
      </p>
    </div>
  );
}
