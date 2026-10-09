"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  if (done) return <div className="text-sm text-emerald-600 text-center">✓ フィードバックをお送りいただきありがとうございます</div>;
  return (
    <div className="space-y-2">
      {!open ? (
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}><Send className="size-3.5" />フィードバック</Button>
      ) : (
        <div className="rounded-md border bg-background p-3 space-y-2 max-w-md">
          <div className="text-sm font-medium">改善提案・バグ報告</div>
          <Textarea rows={3} placeholder="ご意見をお聞かせください..." />
          <div className="flex gap-1.5">
            <Button size="sm" onClick={() => setDone(true)}>送信</Button>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>キャンセル</Button>
          </div>
        </div>
      )}
    </div>
  );
}
