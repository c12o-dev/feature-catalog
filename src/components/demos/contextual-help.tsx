"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContextualHelp() {
  const [hov, setHov] = useState(false);
  return (
    <div className="space-y-1 max-w-sm">
      <div className="flex items-center gap-1.5">
        <Label className="text-xs">API ベース URL</Label>
        <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} className="relative">
          <HelpCircle className="size-3.5 text-muted-foreground" />
          {hov && (
            <div className="absolute left-0 top-full mt-1 z-10 w-64 rounded-md border bg-popover shadow-md p-2 text-xs text-left">
              <div className="font-medium mb-0.5">ヘルプ</div>
              <div className="text-muted-foreground">API のリクエスト先 URL。本番環境は https://api.example.com を使用。</div>
            </div>
          )}
        </button>
      </div>
      <Input placeholder="https://api.example.com" />
    </div>
  );
}
