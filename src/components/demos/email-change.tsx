"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EmailChange() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("new@example.com");

  return (
    <div className="space-y-3 max-w-md">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {([1, 2, 3] as const).map((n) => (
          <div key={n} className={`flex items-center gap-1 ${step >= n ? "text-foreground" : ""}`}>
            <div className={`size-5 rounded-full grid place-items-center text-[10px] ${step > n ? "bg-emerald-500 text-white" : step === n ? "bg-foreground text-background" : "bg-muted"}`}>
              {step > n ? <Check className="size-3" /> : n}
            </div>
            {n === 1 && "新メール"}{n === 2 && "確認"}{n === 3 && "完了"}
          </div>
        ))}
      </div>
      {step === 1 && (
        <div className="space-y-2">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="新しいメール" />
          <Button onClick={() => setStep(2)}>確認メール送信</Button>
        </div>
      )}
      {step === 2 && (
        <div className="rounded-md border bg-background p-3 text-sm">
          <Mail className="size-5 text-blue-500 mb-2" />
          {email} に確認リンクを送信しました。メール内のリンクをクリックしてください。
          <Button size="sm" className="mt-2" onClick={() => setStep(3)}>シミュレート: クリック</Button>
        </div>
      )}
      {step === 3 && <div className="text-emerald-600 text-sm">✓ メールアドレスを変更しました</div>}
    </div>
  );
}
