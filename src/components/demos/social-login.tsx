"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// color: 各プロバイダのボタン配色（ブランドガイドに倣い Apple / X は塗り、他はアウトライン）
const providers = [
  { id: "google", name: "Google", mark: "G", color: "border bg-background text-foreground hover:bg-accent", markColor: "bg-muted text-foreground" },
  { id: "apple", name: "Apple", mark: "A", color: "bg-foreground text-background hover:opacity-90", markColor: "bg-background/15" },
  { id: "github", name: "GitHub", mark: "GH", color: "border bg-background text-foreground hover:bg-accent", markColor: "bg-muted text-foreground" },
  { id: "x", name: "X", mark: "X", color: "bg-foreground text-background hover:opacity-90", markColor: "bg-background/15" },
];

type Phase = { kind: "idle" } | { kind: "redirect"; id: string } | { kind: "done"; id: string };

export default function SocialLogin() {
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  const signIn = (id: string) => {
    setPhase({ kind: "redirect", id });
    timers.current.push(setTimeout(() => setPhase({ kind: "done", id }), 1400));
  };

  const busy = phase.kind === "redirect";
  const current = phase.kind !== "idle" ? providers.find((p) => p.id === phase.id) : null;

  return (
    <div className="mx-auto w-full max-w-xs rounded-lg border bg-card p-5 shadow-sm">
      {phase.kind === "done" && current ? (
        <div className="space-y-4 text-center" aria-live="polite">
          <div className="mx-auto grid size-10 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Check className="size-5" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-medium">{current.name} でサインインしました</p>
            <p className="mt-1 text-xs text-muted-foreground">sakura.minato@example.com</p>
          </div>
          <button type="button" onClick={() => setPhase({ kind: "idle" })} className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">
            サインアウト
          </button>
        </div>
      ) : (
        <>
          <p className="text-center text-sm font-semibold">アカウントにサインイン</p>
          <p className="mt-1 text-center text-xs text-muted-foreground">外部アカウントでかんたんに続行</p>
          <div className="mt-4 space-y-2">
            {providers.map((p) => {
              const loading = phase.kind === "redirect" && phase.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => signIn(p.id)}
                  disabled={busy}
                  aria-busy={loading}
                  className={cn(
                    "relative flex h-9 w-full items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-[opacity,background-color] disabled:cursor-not-allowed",
                    p.color,
                    busy && !loading && "opacity-50",
                  )}
                >
                  <span aria-hidden className={cn("absolute left-2.5 grid size-5 place-items-center rounded text-[10px] font-bold", p.markColor)}>
                    {loading ? <Loader2 className="size-3.5 motion-safe:animate-spin" /> : p.mark}
                  </span>
                  {loading ? `${p.name} に接続中…` : `${p.name} で続行`}
                </button>
              );
            })}
          </div>
          <p className="mt-3 h-4 text-center text-xs text-muted-foreground" aria-live="polite">
            {current && busy ? `${current.name} の認証画面へ移動しています` : ""}
          </p>
        </>
      )}
    </div>
  );
}
