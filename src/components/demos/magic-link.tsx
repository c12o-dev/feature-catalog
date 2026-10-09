"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Mail, MailCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const COOLDOWN = 30;

export default function MagicLink() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"form" | "sending" | "sent">("form");
  const [cooldown, setCooldown] = useState(0);
  const [sendCount, setSendCount] = useState(0);
  const timeout = useRef<number | undefined>(undefined);
  const interval = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      clearTimeout(timeout.current);
      clearInterval(interval.current);
    },
    [],
  );

  const startCooldown = () => {
    clearInterval(interval.current);
    setCooldown(COOLDOWN);
    interval.current = window.setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(interval.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const send = () => {
    setPhase("sending");
    clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => {
      setPhase("sent");
      setSendCount((n) => n + 1);
      startCooldown();
    }, 700);
  };

  const edit = () => {
    clearInterval(interval.current);
    setCooldown(0);
    setSendCount(0);
    setPhase("form");
  };

  if (phase === "sent") {
    return (
      <div className="w-full max-w-sm space-y-3 rounded-lg border bg-card p-4 text-center">
        <MailCheck className="mx-auto size-6 text-emerald-600 dark:text-emerald-400" aria-hidden />
        <div aria-live="polite" className="space-y-1">
          <div className="text-sm font-medium">メールを確認してください</div>
          <p className="text-xs text-muted-foreground">
            <span className="break-all font-medium text-foreground">{email}</span> にログインリンクを送信しました
            {sendCount > 1 ? `（再送 ${sendCount - 1} 回目）` : ""}。リンクの有効期限は 15 分です。
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm" onClick={send} disabled={cooldown > 0}>
            {cooldown > 0 ? <span className="tabular-nums">{cooldown} 秒後に再送できます</span> : "リンクを再送する"}
          </Button>
          <Button variant="ghost" size="sm" onClick={edit}>
            メールアドレスを変更
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">届かない場合は迷惑メールフォルダもご確認ください</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email) send();
      }}
      className="w-full max-w-sm space-y-2"
    >
      <Label htmlFor={`${id}-email`} className="flex items-center gap-1.5">
        <Mail className="size-4 text-muted-foreground" aria-hidden />
        メールアドレスでサインイン
      </Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id={`${id}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
          className="min-w-0"
        />
        <Button type="submit" disabled={phase === "sending"}>
          {phase === "sending" && <Loader2 className="size-4 motion-safe:animate-spin" aria-hidden />}
          リンクを送信
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">パスワード不要。届いたリンクを開くだけでログインできます。</p>
    </form>
  );
}
