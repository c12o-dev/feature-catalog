"use client";

import { Wrench } from "lucide-react";

export default function MaintenanceBanner() {
  return (
    <div className="rounded-md bg-zinc-900 text-white px-4 py-2 flex items-center gap-2 text-sm">
      <Wrench className="size-4" />
      <span className="font-medium">メンテナンス予告</span>
      <span className="text-zinc-300 text-xs">2026-04-28 02:00–04:00 (JST) にサービス停止します</span>
    </div>
  );
}
