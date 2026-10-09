"use client";

import { useState } from "react";
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReaderMode() {
  const [reader, setReader] = useState(false);
  return (
    <div className="space-y-3">
      <Button size="sm" variant={reader ? "default" : "outline"} onClick={() => setReader((r) => !r)}>
        <Book className="size-4" />Reader mode {reader ? "ON" : "OFF"}
      </Button>
      {reader ? (
        <article className="max-w-prose mx-auto bg-amber-50 dark:bg-amber-950/30 rounded-md p-6 text-base leading-loose font-serif">
          <h3 className="text-lg font-semibold mb-3">記事タイトル</h3>
          <p>本文だけが残った読みやすい状態。広告・ナビ・サイドバー全てが取り除かれて、文字サイズと行間が読書向けに調整されている。</p>
        </article>
      ) : (
        <div className="rounded-md border p-3 text-xs text-muted-foreground">
          <div className="bg-muted p-1 mb-1">[広告 banner]</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2"><div className="font-bold text-foreground text-sm">記事タイトル</div><p className="text-xs">通常の web ページ。ナビ・広告・サイドバーが混在している。</p></div>
            <div className="bg-muted p-1 text-[10px]">[サイドバー]</div>
          </div>
        </div>
      )}
    </div>
  );
}
