"use client";

export default function OgpPreview() {
  return (
    <div className="space-y-2 max-w-md">
      <div className="text-sm">https://example.com/article/12345 を貼ったとき</div>
      <a className="block rounded-md border bg-background overflow-hidden hover:border-foreground/30 cursor-pointer">
        <div className="h-24 bg-gradient-to-br from-blue-400 to-purple-500" />
        <div className="p-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">example.com</div>
          <div className="text-sm font-medium mt-0.5">記事のタイトル</div>
          <div className="text-xs text-muted-foreground line-clamp-2 mt-1">記事のディスクリプション。OGP メタタグで定義された値が表示されます。</div>
        </div>
      </a>
    </div>
  );
}
