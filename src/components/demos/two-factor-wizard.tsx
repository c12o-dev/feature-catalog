"use client";

import { useState } from "react";
import { QrCode, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TwoFactorWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  return (
    <div className="space-y-3 max-w-md">
      <div className="flex items-center gap-2 text-xs">
        {[1, 2, 3].map((n) => (
          <div key={n} className={`flex items-center gap-1 ${step >= n ? "text-foreground" : "text-muted-foreground"}`}>
            <div className={`size-5 rounded-full grid place-items-center text-[10px] ${step > n ? "bg-emerald-500 text-white" : step === n ? "bg-foreground text-background" : "bg-muted"}`}>{step > n ? <Check className="size-3" /> : n}</div>
            {n === 1 && "QR"}{n === 2 && "コード"}{n === 3 && "完了"}
          </div>
        ))}
      </div>
      {step === 1 && (
        <div className="rounded-md border bg-background p-4 text-center">
          <QrCode className="size-32 mx-auto" />
          <div className="text-xs text-muted-foreground mt-2">Authenticator アプリでスキャン</div>
          <Button size="sm" className="mt-2" onClick={() => setStep(2)}>次へ</Button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-2">
          <Input placeholder="6 桁コード" className="font-mono text-center" maxLength={6} />
          <Button size="sm" onClick={() => setStep(3)}>確認</Button>
        </div>
      )}
      {step === 3 && <div className="text-emerald-600 text-sm">✓ 2 段階認証を有効化しました</div>}
    </div>
  );
}
