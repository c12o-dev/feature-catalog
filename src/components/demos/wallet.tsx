"use client";

import { Wallet as W } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Wallet() {
  return (
    <div className="rounded-lg border bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4 max-w-sm">
      <div className="flex items-center gap-2 mb-2"><W className="size-4" /><span className="text-xs opacity-80">残高</span></div>
      <div className="text-3xl font-semibold tabular-nums">¥4,820</div>
      <div className="text-xs opacity-80 mt-1">≈ 482 credits</div>
      <Button size="sm" variant="secondary" className="mt-3 w-full">チャージ</Button>
    </div>
  );
}
