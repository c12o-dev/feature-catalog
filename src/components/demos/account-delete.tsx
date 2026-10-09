"use client";

import { useId, useState } from "react";
import { AlertTriangle, Clock, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const HANDLE = "misaki-tanaka";
const GRACE_DAYS = 30;
// Requested on 2026-10-01; final deletion on 2026-10-31.
const DELETE_ON = "2026年10月31日";

type Step = "active" | "warn" | "confirm" | "scheduled" | "gone";

export default function AccountDelete() {
  const [step, setStep] = useState<Step>("active");
  const [exported, setExported] = useState(false);
  const [typed, setTyped] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [notice, setNotice] = useState("");
  const id = useId();
  const left = GRACE_DAYS - elapsed;

  return (
    <div className="mx-auto w-full max-w-sm rounded-lg border bg-card p-4">
      <ol className="mb-4 flex gap-1" aria-label="手順">
        {["確認", "最終確認", "猶予期間"].map((s, i) => {
          const idx = step === "warn" ? 0 : step === "confirm" ? 1 : step === "scheduled" || step === "gone" ? 2 : -1;
          return (
            <li key={s} className="flex-1" aria-current={idx === i ? "step" : undefined}>
              <div className={`h-1 rounded-full ${idx >= i ? "bg-destructive" : "bg-muted"}`} />
              <div className={`mt-1 text-[10px] ${idx === i ? "font-medium text-foreground" : "text-muted-foreground"}`}>{s}</div>
            </li>
          );
        })}
      </ol>

      <div aria-live="polite" className="space-y-3">
        {step === "active" && (
          <>
            <div className="text-sm font-medium">アカウント設定</div>
            <p className="text-xs text-muted-foreground">@{HANDLE} · 2021 年から利用中</p>
            {notice && (
              <p className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-2 text-xs text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                <ShieldCheck className="size-3.5" aria-hidden />
                {notice}
              </p>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setNotice("");
                setStep("warn");
              }}
            >
              アカウントを削除…
            </Button>
          </>
        )}

        {step === "warn" && (
          <>
            <div className="flex items-center gap-2 text-sm font-medium text-destructive">
              <AlertTriangle className="size-4" aria-hidden />
              削除すると次のデータが消えます
            </div>
            <ul className="list-disc space-y-0.5 pl-5 text-xs text-muted-foreground">
              <li>プロジェクト 12 件と添付ファイル</li>
              <li>請求履歴（法定保存分を除く）</li>
              <li>連携中のアプリ 3 件</li>
            </ul>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={exported} onChange={(e) => setExported(e.target.checked)} />
              データのエクスポートを済ませた
            </label>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setStep("active")}>
                やめる
              </Button>
              <Button size="sm" variant="destructive" disabled={!exported} onClick={() => setStep("confirm")}>
                次へ
              </Button>
            </div>
          </>
        )}

        {step === "confirm" && (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (typed !== HANDLE) return;
              setElapsed(0);
              setStep("scheduled");
            }}
          >
            <Label htmlFor={id} className="block text-xs leading-relaxed">
              確認のため、ユーザー名 <span className="font-mono font-semibold">{HANDLE}</span> を入力してください
            </Label>
            <Input id={id} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" spellCheck={false} className="font-mono" />
            <div className="flex justify-end gap-2">
              <Button type="button" size="sm" variant="ghost" onClick={() => setStep("warn")}>
                戻る
              </Button>
              <Button type="submit" size="sm" variant="destructive" disabled={typed !== HANDLE}>
                削除を申請
              </Button>
            </div>
          </form>
        )}

        {step === "scheduled" && (
          <>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="size-4 text-amber-600 dark:text-amber-400" aria-hidden />
              削除を受け付けました
            </div>
            <p className="text-xs text-muted-foreground">
              {DELETE_ON}に完全に削除されます。それまではログインして取り消せます。
            </p>
            <div className="rounded-md border p-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">取り消せる残り日数</span>
                <span className="text-lg font-semibold tabular-nums">{left} 日</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-full origin-left bg-amber-500 transition-transform dark:bg-amber-400" style={{ transform: `scaleX(${left / GRACE_DAYS})` }} />
              </div>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (left <= 10) setStep("gone");
                  setElapsed((d) => Math.min(GRACE_DAYS, d + 10));
                }}
              >
                10 日進める（デモ）
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setStep("active");
                  setTyped("");
                  setExported(false);
                  setNotice("削除を取り消しました。アカウントは元どおり使えます。");
                }}
              >
                <RotateCcw />
                削除を取り消す
              </Button>
            </div>
          </>
        )}

        {step === "gone" && (
          <>
            <p className="text-sm font-medium">アカウントは完全に削除されました</p>
            <p className="text-xs text-muted-foreground">猶予期間が終了したため、復元できません。</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setStep("active");
                setTyped("");
                setExported(false);
                setElapsed(0);
              }}
            >
              デモを最初から
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
