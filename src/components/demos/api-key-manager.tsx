"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ApiKey = { id: string; name: string; prefix: string; createdAt: string; lastUsed: string | null };

const initial: ApiKey[] = [
  { id: "1", name: "Production", prefix: "sk-prod-x9k...", createdAt: "2025-12-04", lastUsed: "2分前" },
  { id: "2", name: "Staging", prefix: "sk-stag-3mP...", createdAt: "2025-11-20", lastUsed: "3日前" },
  { id: "3", name: "Local Dev", prefix: "sk-dev-Hq8...", createdAt: "2025-08-12", lastUsed: null },
];

export default function ApiKeyManager() {
  const [keys, setKeys] = useState(initial);
  const create = () => setKeys((k) => [...k, { id: String(Date.now()), name: `Key ${k.length + 1}`, prefix: `sk-new-${Math.random().toString(36).slice(2, 7)}...`, createdAt: new Date().toISOString().slice(0, 10), lastUsed: null }]);
  const remove = (id: string) => setKeys((k) => k.filter((x) => x.id !== id));

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">API キー ({keys.length})</div>
        <Button size="sm" onClick={create}>
          <Plus className="size-4" />
          新規発行
        </Button>
      </div>
      <div className="rounded-md border divide-y">
        {keys.map((k) => (
          <div key={k.id} className="flex items-center gap-3 p-3 text-sm">
            <Key className="size-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <div className="font-medium">{k.name}</div>
              <code className="text-xs text-muted-foreground font-mono">{k.prefix}</code>
            </div>
            <div className="text-xs text-muted-foreground hidden sm:block">
              {k.lastUsed ? `最終使用: ${k.lastUsed}` : <Badge variant="secondary" className="text-[10px]">未使用</Badge>}
            </div>
            <button
              onClick={() => remove(k.id)}
              className="text-muted-foreground hover:text-red-600 p-1"
              aria-label="削除"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
