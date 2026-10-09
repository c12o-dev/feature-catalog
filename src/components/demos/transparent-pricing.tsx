"use client";

import { Check } from "lucide-react";

export default function TransparentPricing() {
  return (
    <div className="rounded-lg border bg-background p-4 space-y-3 max-w-md">
      <div className="text-sm font-semibold">透明性のある料金</div>
      <ul className="space-y-1.5 text-sm">
        {[
          "月額 ¥980 （税込）",
          "セットアップ料金 ¥0",
          "解約料金 ¥0、いつでもキャンセル可",
          "上限制 — 100 ユーザーまで含まれる",
          "超過分は ¥10/ユーザー/月",
        ].map((l, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />{l}
          </li>
        ))}
      </ul>
      <div className="text-xs text-muted-foreground pt-2 border-t">隠れた費用は一切ありません</div>
    </div>
  );
}
