"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => toast("ファイルを保存しました")}>
        Default
      </Button>
      <Button variant="outline" size="sm" onClick={() => toast.success("デプロイが完了")}>
        Success
      </Button>
      <Button variant="outline" size="sm" onClick={() => toast.error("接続に失敗しました")}>
        Error
      </Button>
      <Button variant="outline" size="sm" onClick={() => toast.info("新しいバージョンがあります")}>
        Info
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast("ファイルを削除しました", {
            action: { label: "Undo", onClick: () => toast.success("復元しました") },
          })
        }
      >
        With Action
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast.promise(new Promise<void>((r) => setTimeout(r, 1500)), {
            loading: "アップロード中...",
            success: "完了",
            error: "失敗",
          })
        }
      >
        Promise
      </Button>
    </div>
  );
}
