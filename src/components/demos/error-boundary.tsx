"use client";

import { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundaryDemo() {
  const [err, setErr] = useState(true);
  return (
    <div className="rounded-md border bg-background p-4 max-w-md">
      {err ? (
        <div className="text-center space-y-3">
          <AlertCircle className="size-10 text-red-500 mx-auto" />
          <div>
            <div className="font-medium">問題が発生しました</div>
            <div className="text-xs text-muted-foreground mt-1">読み込み中に予期しないエラーが起きました</div>
          </div>
          <Button size="sm" onClick={() => setErr(false)}><RefreshCw className="size-3.5" />再試行</Button>
        </div>
      ) : (
        <div className="text-center text-sm text-muted-foreground">✓ 正常に表示されています</div>
      )}
    </div>
  );
}
