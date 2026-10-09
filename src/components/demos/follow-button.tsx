"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, UserPlus } from "lucide-react";

export default function FollowButton() {
  const [following, setFollowing] = useState(false);
  const [count, setCount] = useState(1284);

  const toggle = () => {
    setFollowing((f) => {
      setCount((c) => c + (f ? -1 : 1));
      return !f;
    });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="size-12 rounded-full bg-purple-400 grid place-items-center text-white font-medium">S</div>
        <div>
          <div className="font-medium text-sm">Seu</div>
          <div className="text-xs text-muted-foreground tabular-nums">{count.toLocaleString()} フォロワー</div>
        </div>
      </div>
      <Button
        onClick={toggle}
        variant={following ? "outline" : "default"}
        size="sm"
        className="ml-auto min-w-[112px]"
      >
        {following ? (
          <><Check className="size-4" />フォロー中</>
        ) : (
          <><UserPlus className="size-4" />フォロー</>
        )}
      </Button>
    </div>
  );
}
