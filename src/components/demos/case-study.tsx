"use client";

import { ArrowRight } from "lucide-react";

export default function CaseStudy() {
  return (
    <a className="block rounded-lg border bg-background overflow-hidden cursor-pointer hover:border-foreground/30 transition-colors">
      <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-500" />
      <div className="p-4">
        <div className="text-xs text-muted-foreground mb-1">CASE STUDY · Acme Inc.</div>
        <h3 className="font-semibold mb-2">運用工数を 60% 削減した方法</h3>
        <p className="text-xs text-muted-foreground mb-3">CTO Bob 氏に話を聞きました。導入の経緯から定着までの軌跡。</p>
        <div className="flex gap-3 text-center mb-3">
          <div><div className="text-lg font-semibold">60%</div><div className="text-[10px] text-muted-foreground">工数削減</div></div>
          <div><div className="text-lg font-semibold">3x</div><div className="text-[10px] text-muted-foreground">スループット</div></div>
          <div><div className="text-lg font-semibold">2 週</div><div className="text-[10px] text-muted-foreground">で定着</div></div>
        </div>
        <span className="text-xs text-primary inline-flex items-center gap-1">続きを読む <ArrowRight className="size-3" /></span>
      </div>
    </a>
  );
}
