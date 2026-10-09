"use client";

import { Loader2 } from "lucide-react";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center gap-6 py-4">
      <Loader2 className="size-4 animate-spin text-muted-foreground" />
      <Loader2 className="size-6 animate-spin" />
      <div className="size-6 rounded-full border-2 border-muted border-t-primary animate-spin" />
      <div className="flex gap-1">
        <div className="size-2 rounded-full bg-primary animate-bounce" />
        <div className="size-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
        <div className="size-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
