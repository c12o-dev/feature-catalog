"use client";

import { useId, useState } from "react";
import { Check, CircleAlert, CircleCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TAKEN = ["taro@example.com"];

const RULES = [
  { label: "8 文字以上", test: (s: string) => s.length >= 8 },
  { label: "英字と数字を含む", test: (s: string) => /[a-zA-Z]/.test(s) && /\d/.test(s) },
  {
    label: "メールアドレスの名前部分を含まない",
    test: (s: string, email: string) => {
      const local = email.split("@")[0].toLowerCase();
      return s.length > 0 && (local.length < 3 || !s.toLowerCase().includes(local));
    },
  },
];

function emailError(v: string) {
  if (!v) return "メールアドレスを入力してください";
  if (!EMAIL.test(v)) return "「name@example.com」の形式で入力してください";
  if (TAKEN.includes(v.toLowerCase())) return "このメールアドレスは登録済みです";
  return null;
}

export default function InlineValidation() {
  const id = useId();
  const emailId = `${id}-email`;
  const pwId = `${id}-password`;
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  // Show errors only after the user has left the field once, then update live while typing.
  const [touched, setTouched] = useState({ email: false, pw: false });
  const [done, setDone] = useState<string | null>(null);

  const eErr = emailError(email);
  const ruleState = RULES.map((r) => r.test(pw, email));
  const pwOk = ruleState.every(Boolean);
  const showE = touched.email && !!email;
  const valid = !eErr && pwOk;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTouched({ email: true, pw: true });
        if (valid) setDone(email);
      }}
      className="mx-auto w-full max-w-sm space-y-4 rounded-lg border bg-card p-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor={emailId}>メールアドレス</Label>
        <div className="relative">
          <Input
            id={emailId}
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setDone(null);
            }}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            aria-invalid={(showE && !!eErr) || undefined}
            aria-describedby={`${emailId}-msg`}
            className={cn("pr-8", showE && !eErr && "border-emerald-500 dark:border-emerald-400")}
          />
          {showE &&
            (eErr ? (
              <CircleAlert className="absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-destructive" aria-hidden />
            ) : (
              <CircleCheck className="absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" aria-hidden />
            ))}
        </div>
        <p id={`${emailId}-msg`} aria-live="polite" className={cn("min-h-4 text-xs", eErr ? "text-destructive" : "text-emerald-600 dark:text-emerald-400")}>
          {showE ? eErr ?? "使用できます" : ""}
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={pwId}>パスワード</Label>
        <Input
          id={pwId}
          type="password"
          autoComplete="new-password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setDone(null);
          }}
          onBlur={() => setTouched((t) => ({ ...t, pw: true }))}
          aria-invalid={(touched.pw && !pwOk) || undefined}
          aria-describedby={`${pwId}-rules`}
          className={cn(pw && pwOk && "border-emerald-500 dark:border-emerald-400")}
        />
        <ul id={`${pwId}-rules`} className="space-y-0.5 text-xs">
          {RULES.map((r, i) => {
            const ok = ruleState[i];
            const bad = !ok && (touched.pw || pw.length > 0);
            return (
              <li
                key={r.label}
                className={cn(
                  "flex items-center gap-1.5",
                  ok ? "text-emerald-600 dark:text-emerald-400" : bad ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {ok ? <Check className="size-3" aria-hidden /> : <X className="size-3" aria-hidden />}
                {r.label}
                <span className="sr-only">{ok ? "（満たしています）" : "（未達）"}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <Button type="submit" className="w-full">
        アカウントを作成
      </Button>
      <p aria-live="polite" className="min-h-4 text-center text-xs text-emerald-600 dark:text-emerald-400">
        {done && `${done} で登録しました`}
      </p>
    </form>
  );
}
