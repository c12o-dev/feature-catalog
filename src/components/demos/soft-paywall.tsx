"use client";

import { Button } from "@/components/ui/button";

export default function SoftPaywall() {
  return (
    <div className="relative max-w-md rounded-md border bg-background overflow-hidden">
      <article className="p-4 text-sm leading-relaxed space-y-2">
        <h3 className="font-semibold">記事タイトル</h3>
        <p>記事の冒頭部分です。読者の興味を引きつける重要な部分。</p>
        <p>続きは...</p>
        <div className="h-16 -mt-4 bg-gradient-to-b from-transparent to-background" />
      </article>
      <div className="absolute inset-x-0 bottom-0 bg-background border-t p-4 text-center space-y-2">
        <div className="text-sm font-medium">続きを読むには会員登録が必要です</div>
        <div className="text-xs text-muted-foreground">無料プランでは月 3 本まで</div>
        <Button size="sm">会員登録（無料）</Button>
      </div>
    </div>
  );
}
