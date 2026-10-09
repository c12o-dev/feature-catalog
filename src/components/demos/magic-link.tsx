"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MagicLink() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  if (sent) return (
    <div className="rounded-md border bg-emerald-50 dark:bg-emerald-950/40 p-4 text-sm text-emerald-700 dark:text-emerald-300 max-w-md text-center">
      <Check className="size-5 mx-auto mb-2" />
      {email} にログインリンクを送信しました
    </div>
  );
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }} className="space-y-2 max-w-md">
      <div className="flex items-center gap-2 text-sm font-medium"><Mail className="size-4" />Magic link でサインイン</div>
      <div className="flex gap-2">
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        <Button type="submit">送信</Button>
      </div>
      <div className="text-xs text-muted-foreground">メールに届いたリンクをクリックするだけでログインできます</div>
    </form>
  );
}
