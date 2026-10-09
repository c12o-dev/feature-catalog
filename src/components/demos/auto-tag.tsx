"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AutoTag() {
  const [tags, setTags] = useState<string[]>([]);
  const generate = () => setTags(["TypeScript", "React 19", "shadcn/ui", "Tailwind v4"]);
  return (
    <div className="space-y-3 max-w-md">
      <div className="rounded-md border bg-background p-3 text-xs text-muted-foreground">
        Next.js 16 と React 19 を使い、shadcn/ui v4 と Tailwind v4 で UI を作る方法をまとめた記事...
      </div>
      <Button size="sm" onClick={generate} disabled={tags.length > 0}>
        <Sparkles className="size-3.5" />タグを自動付与
      </Button>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 text-xs rounded-full border bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5">
              <Sparkles className="size-2.5 text-blue-500" />{t}
              <button onClick={() => setTags((tags) => tags.filter((x) => x !== t))}><X className="size-2.5" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
