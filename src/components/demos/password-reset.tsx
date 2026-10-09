"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check } from "lucide-react";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  if (sent) return (
    <div className="rounded-md border bg-emerald-50 dark:bg-emerald-950/40 p-4 text-sm max-w-md text-emerald-700 dark:text-emerald-300">
      <Check className="size-5 mb-2" />
      パスワードリセットリンクを {email} に送信しました
    </div>
  );
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }} className="space-y-2 max-w-md">
      <div className="flex items-center gap-1.5 text-sm font-medium"><Mail className="size-4" />パスワードリセット</div>
      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="登録メールアドレス" required />
      <Button type="submit">リセットリンクを送信</Button>
    </form>
  );
}
