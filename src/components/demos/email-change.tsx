"use client";

import { useId, useState } from "react";
import { Check, Mail, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const CURRENT = "haruka.sato@example.jp";
const STEPS = ["新しいアドレス", "確認", "完了"];

export default function EmailChange() {
  const id = useId();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
    if (!input.checkValidity()) {
      setError("メールアドレスの形式が正しくありません");
      return;
    }
    if (email.trim().toLowerCase() === CURRENT) {
      setError("現在のアドレスと同じです");
      return;
    }
    setError("");
    setStep(1);
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-4 rounded-lg border bg-card p-4 shadow-sm">
      <ol className="flex items-center gap-2 text-xs" aria-label="進行状況">
        {STEPS.map((label, n) => (
          <li key={label} className="flex min-w-0 flex-1 items-center gap-1.5" aria-current={step === n ? "step" : undefined}>
            <span
              className={cn(
                "grid size-5 shrink-0 place-items-center rounded-full text-[10px] tabular-nums",
                step > n ? "bg-emerald-600 text-white dark:bg-emerald-500" : step === n ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
              )}
            >
              {step > n ? <Check className="size-3" aria-hidden /> : n + 1}
            </span>
            <span className={cn("truncate", step >= n ? "text-foreground" : "text-muted-foreground")}>{label}</span>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <form onSubmit={submit} noValidate className="space-y-3">
          <div className="text-xs text-muted-foreground">
            現在: <span className="text-foreground">{CURRENT}</span>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={id}>新しいメールアドレス</Label>
            <Input
              id={id}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="name@example.jp"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              aria-invalid={!!error}
              aria-describedby={error ? `${id}-err` : undefined}
            />
            {error && (
              <p id={`${id}-err`} className="text-xs text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>
          <Button type="submit" size="sm">確認メールを送信</Button>
        </form>
      )}

      {step === 1 && (
        <div className="space-y-3" aria-live="polite">
          <div className="flex gap-3 rounded-md border bg-background p-3">
            <Mail className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <p className="min-w-0 text-sm">
              <span className="break-all font-medium">{email}</span> に確認リンクを送信しました。24 時間以内にリンクを開くと変更が完了します。
            </p>
          </div>
          <p className="text-xs text-muted-foreground">確認が済むまで、ログインには現在のアドレスを使います。</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setStep(2)}>メールのリンクを開く（模擬）</Button>
            <Button size="sm" variant="ghost" onClick={() => setStep(0)}>アドレスを修正</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3" aria-live="polite">
          <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
            <MailCheck className="size-5" aria-hidden />
            メールアドレスを変更しました
          </div>
          <p className="break-all text-xs text-muted-foreground">
            {CURRENT} → <span className="text-foreground">{email}</span>
            <br />旧アドレスにも変更通知を送りました。
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEmail("");
              setStep(0);
            }}
          >
            最初から
          </Button>
        </div>
      )}
    </div>
  );
}
