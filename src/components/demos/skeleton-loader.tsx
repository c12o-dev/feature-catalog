"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function SkeletonLoader() {
  const [loading, setLoading] = useState(true);
  const reload = () => {
    setLoading(true);
  };
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, [loading]);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" variant="ghost" onClick={reload}>
          <RefreshCw className="size-3" />
          リロード
        </Button>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {[
            { name: "Alice", msg: "新しいプロジェクトを作成しました" },
            { name: "Bob", msg: "コメントしました: \"良いですね\"" },
            { name: "Carol", msg: "PR をマージしました" },
          ].map((u) => (
            <div key={u.name} className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-blue-400 grid place-items-center text-white text-sm font-medium">
                {u.name[0]}
              </div>
              <div className="text-sm">
                <div className="font-medium">{u.name}</div>
                <div className="text-muted-foreground text-xs">{u.msg}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
