"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function DestructiveModal() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const ok = confirm === "DELETE";
  return (
    <div className="text-center">
      <Button variant="destructive" onClick={() => setOpen(true)}>プロジェクトを削除</Button>
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setConfirm(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="size-5 text-red-500" />本当に削除しますか？</DialogTitle>
            <DialogDescription>この操作は取り消せません。プロジェクトと全データが完全に削除されます。</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <div className="text-sm">確認のため <code className="bg-muted px-1 rounded">DELETE</code> と入力してください</div>
            <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="DELETE" />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>キャンセル</Button>
            <Button variant="destructive" disabled={!ok} onClick={() => { setOpen(false); toast.success("削除しました"); setConfirm(""); }}>削除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
