"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const sample = `{
  "id": 42,
  "name": "Alice",
  "email": "alice@example.com",
  "created_at": "2026-04-26T10:32:14Z"
}`;

export default function ApiPlayground() {
  const [response, setResponse] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-2">
        <div className="text-xs font-medium">Request</div>
        <div className="rounded-md border bg-zinc-950 text-zinc-100 font-mono text-xs p-3 space-y-1">
          <div><span className="text-emerald-400">GET</span> /api/users/42</div>
          <div className="text-zinc-500">Authorization: Bearer ***</div>
        </div>
        <Button size="sm" onClick={() => setResponse(sample)}><Play className="size-3.5" />送信</Button>
      </div>
      <div className="space-y-2">
        <div className="text-xs font-medium">Response {response && <span className="text-emerald-600 font-mono">200 OK</span>}</div>
        <pre className="rounded-md border bg-zinc-950 text-zinc-100 font-mono text-xs p-3 min-h-[6rem] overflow-x-auto">
          {response ?? <span className="text-zinc-500">送信して結果を確認</span>}
        </pre>
      </div>
    </div>
  );
}
