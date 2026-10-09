"use client";

export default function QuotePost() {
  return (
    <div className="space-y-2 max-w-md">
      <div className="text-sm">これはとても参考になる投稿でした 👇</div>
      <div className="rounded-md border bg-muted/30 p-3 space-y-1">
        <div className="text-xs text-muted-foreground"><span className="font-medium text-foreground">@original_author</span> · 1 時間前</div>
        <div className="text-sm">引用される元の投稿。Twitter / X の引用ポスト UI。</div>
      </div>
    </div>
  );
}
