"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

export default function AccountDelete() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [confirm, setConfirm] = useState("");
  return (
    <div className="rounded-md border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30 p-4 max-w-md space-y-3">
      <div className="flex items-center gap-2 text-red-700 dark:text-red-300"><AlertTriangle className="size-4" /><span className="font-medium text-sm">アカウント削除</span></div>
      {step === 1 && (
        <>
          <p className="text-xs text-red-700 dark:text-red-300">削除すると 30 日後に完全に消去されます (期間内なら復元可能)</p>
          <Button size="sm" variant="destructive" onClick={() => setStep(2)}>次へ</Button>
        </>
      )}
      {step === 2 && (
        <>
          <Label className="text-xs text-red-700 dark:text-red-300">確認のため「DELETE MY ACCOUNT」と入力</Label>
          <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="DELETE MY ACCOUNT" />
          <Button size="sm" variant="destructive" disabled={confirm !== "DELETE MY ACCOUNT"} onClick={() => setStep(3)}>削除を実行</Button>
        </>
      )}
      {step === 3 && (
        <p className="text-xs text-red-700 dark:text-red-300">アカウント削除を受け付けました。30 日以内なら復元できます。</p>
      )}
    </div>
  );
}
