"use client";

import { Button } from "@/components/ui/button";
import { UserCircle2, ArrowRight } from "lucide-react";

export default function GuestMode() {
  return (
    <div className="space-y-3 max-w-md text-center">
      <Button size="lg" className="w-full">サインイン / 登録</Button>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="h-px bg-border flex-1" />または<div className="h-px bg-border flex-1" />
      </div>
      <button className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
        <UserCircle2 className="size-4" />ゲストとして試す（保存できません）<ArrowRight className="size-3" />
      </button>
    </div>
  );
}
