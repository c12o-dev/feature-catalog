"use client";

import { useState } from "react";
import { Check, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const BASE_FOLLOWERS = 1284;

export default function FollowButton() {
  const [following, setFollowing] = useState(false);
  const count = BASE_FOLLOWERS + (following ? 1 : 0);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-wrap items-center gap-3 rounded-lg border bg-card p-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-full bg-violet-500 text-sm font-medium text-white dark:bg-violet-400 dark:text-violet-950">
          美
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">森田 美咲</div>
          <div className="truncate text-xs text-muted-foreground">@misaki_design</div>
          <div className="mt-0.5 text-xs text-muted-foreground tabular-nums" aria-live="polite">
            <span className="font-medium text-foreground">{count.toLocaleString("ja-JP")}</span> フォロワー
          </div>
        </div>
      </div>
      <Button
        onClick={() => setFollowing((f) => !f)}
        variant={following ? "outline" : "default"}
        size="sm"
        aria-pressed={following}
        aria-label={`森田 美咲さんをフォロー`}
        className="group min-w-28"
      >
        {following ? (
          <>
            <Check aria-hidden className="group-hover:hidden" />
            <span className="group-hover:hidden">フォロー中</span>
            <span className="hidden text-destructive group-hover:inline">フォロー解除</span>
          </>
        ) : (
          <>
            <UserPlus aria-hidden />
            フォロー
          </>
        )}
      </Button>
    </div>
  );
}
