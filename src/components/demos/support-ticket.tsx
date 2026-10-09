"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Paperclip } from "lucide-react";

export default function SupportTicket() {
  const [done, setDone] = useState(false);
  if (done) return <div className="rounded-md border bg-emerald-50 dark:bg-emerald-950/40 p-3 text-sm max-w-md text-emerald-700 dark:text-emerald-300">✓ チケット #12839 を作成しました。1 営業日以内に返信します。</div>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="space-y-3 max-w-md">
      <div>
        <Label className="text-xs">件名</Label>
        <Input placeholder="問題の概要" />
      </div>
      <div>
        <Label className="text-xs">詳細</Label>
        <Textarea placeholder="再現手順や期待される動作..." rows={3} />
      </div>
      <Button size="sm" variant="outline" type="button"><Paperclip className="size-3.5" />添付</Button>
      <Button type="submit" size="sm" className="ml-2">送信</Button>
    </form>
  );
}
