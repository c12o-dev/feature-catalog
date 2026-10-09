"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SuspenseFallback() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 1500); return () => clearTimeout(t); }, []);
  return (
    <div className="rounded-md border bg-background p-3">
      <div className="text-xs text-muted-foreground mb-2">Suspense boundary: 部分的に loading</div>
      <div className="grid grid-cols-3 gap-2">
        <div><div className="text-xs text-muted-foreground mb-1">Header</div><div className="h-8 rounded bg-muted/40 grid place-items-center text-xs">ready</div></div>
        <div className="col-span-2"><div className="text-xs text-muted-foreground mb-1">Main</div>{ready ? <div className="h-8 rounded bg-emerald-100 dark:bg-emerald-950 grid place-items-center text-xs">data loaded</div> : <Skeleton className="h-8" />}</div>
      </div>
    </div>
  );
}
